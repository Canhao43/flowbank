import express from 'express'
import users from '../data/users.js'

const router = express.Router()

// Middleware simples de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autenticado' })
  }
  next()
}

// Obter dados do usuário
router.get('/profile', authenticate, (req, res) => {
  // Para MVP, usar email do header ou primeiro usuário
  const userEmail = req.headers['user-email'] || users[0].email
  const user = users.find(u => u.email === userEmail)

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
  }

  const { password: _, ...userData } = user

  res.json({
    success: true,
    data: userData
  })
})

// Obter dashboard (resumo financeiro)
router.get('/dashboard', authenticate, (req, res) => {
  const userEmail = req.headers['user-email'] || users[0].email
  const user = users.find(u => u.email === userEmail)

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
  }

  // Calcular saldo real somando todas as transações
  const realBalance = user.transactions.reduce((sum, t) => sum + t.amount, 0)

  // Calcular estatísticas
  const last30Days = user.transactions.filter(t => {
    const daysDiff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff <= 30
  })

  const expenses = last30Days.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const income = last30Days.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)

  // Agrupar por categoria
  const byCategory = {}
  last30Days.filter(t => t.type === 'debit').forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = { total: 0, icon: t.icon, count: 0 }
    }
    byCategory[t.category].total += Math.abs(t.amount)
    byCategory[t.category].count++
  })

  const categories = Object.entries(byCategory).map(([name, data]) => ({
    name,
    total: parseFloat(data.total.toFixed(2)),
    percentage: parseFloat(((data.total / expenses) * 100).toFixed(1)),
    icon: data.icon,
    count: data.count
  })).sort((a, b) => b.total - a.total)

  // Detectar alerta de desconexão
  const recargaCelular = user.transactions.filter(t => t.category === 'Recarga Celular')
  const lastRecharge = recargaCelular[0]
  const avgDaysBetweenRecharges = 15 // Simplificado
  
  let alert = null
  if (lastRecharge) {
    const daysSinceLastRecharge = (new Date() - new Date(lastRecharge.date)) / (1000 * 60 * 60 * 24)
    if (daysSinceLastRecharge >= avgDaysBetweenRecharges - 2 && realBalance < 30) {
      alert = {
        type: 'disconnection_risk',
        title: 'Risco de Desconexão',
        message: `Você costuma recarregar seu celular a cada ${avgDaysBetweenRecharges} dias. Sua última recarga foi há ${Math.floor(daysSinceLastRecharge)} dias e seu saldo está baixo.`,
        action: 'Simular Empréstimo',
        icon: 'mdi-cellphone-off'
      }
    }
  }

  // Calcula limite disponível considerando empréstimos ativos
  const activeLoans = user.activeLoans || []
  const totalActiveLoanAmount = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
  
  // CÁLCULO ROBUSTO DO LIMITE DE CRÉDITO
  // Considera: Score + Tempo de Banco + Renda Estimada
  
  // 1. Limite base pelo score (4 níveis: Bronze < 30 | Prata 30-49 | Ouro 50-79 | Diamante 80+)
  let baseLimitByScore = 0
  if (user.score >= 80) baseLimitByScore = 50000      // Diamante
  else if (user.score >= 50) baseLimitByScore = 20000 // Ouro
  else if (user.score >= 30) baseLimitByScore = 8000  // Prata
  else baseLimitByScore = 3000                         // Bronze
  
  // 2. Estima renda mensal baseada em entradas (salário + freelance + outras receitas)
  const last90Days = user.transactions.filter(t => {
    const daysDiff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff <= 90
  })
  
  const incomeTransactions = last90Days.filter(t => t.type === 'credit')
  const totalIncome90Days = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const estimatedMonthlyIncome = totalIncome90Days / 3 // Média mensal dos últimos 3 meses
  
  // 3. Regra: Empréstimo não pode ser maior que 3x a renda mensal
  // Para quem tem score baixo (<60) e pouco tempo (<6 meses), limita ainda mais
  let maxLoanByIncome = estimatedMonthlyIncome * 3 // 3x renda mensal (padrão)
  
  if (user.score < 60 && user.monthsActive < 6) {
    // Cliente novo com score baixo: máximo 1.5x renda mensal
    maxLoanByIncome = estimatedMonthlyIncome * 1.5
  } else if (user.score < 60) {
    // Score baixo mas tempo maior: 2x renda mensal
    maxLoanByIncome = estimatedMonthlyIncome * 2
  } else if (user.monthsActive < 6) {
    // Cliente novo mas score bom: 2.5x renda mensal
    maxLoanByIncome = estimatedMonthlyIncome * 2.5
  }
  
  // 4. Penalidade por tempo de banco insuficiente
  let timeFactor = 1.0
  if (user.monthsActive < 3) timeFactor = 0.3      // Muito novo: 30% do limite
  else if (user.monthsActive < 6) timeFactor = 0.5  // Novo: 50% do limite
  else if (user.monthsActive < 12) timeFactor = 0.75 // Regular: 75% do limite
  // >= 12 meses: 100% do limite (sem penalidade)
  
  // 5. Limite final = menor entre (limite por score * tempo) e (limite por renda)
  const adjustedLimitByScore = baseLimitByScore * timeFactor
  const finalCreditLimit = Math.min(adjustedLimitByScore, maxLoanByIncome)
  
  // 6. Desconta empréstimos ativos
  const availableCredit = Math.max(0, finalCreditLimit - totalActiveLoanAmount)

  res.json({
    success: true,
    data: {
      balance: realBalance,
      score: user.score,
      creditLimit: availableCredit, // Limite disponível (já descontando empréstimos ativos)
      totalCreditLimit: finalCreditLimit, // Limite total calculado
      baseLimitByScore: baseLimitByScore, // Limite bruto por score
      estimatedMonthlyIncome: estimatedMonthlyIncome, // Renda mensal estimada
      monthsActive: user.monthsActive, // Tempo de banco
      activeLoansAmount: totalActiveLoanAmount, // Quanto está comprometido
      expenses,
      income,
      categories,
      recentTransactions: user.transactions.slice(0, 5),
      alert
    }
  })
})

export default router
