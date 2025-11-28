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

// Listar transações
router.get('/', authenticate, (req, res) => {
  const userEmail = req.headers['user-email'] || users[0].email
  const user = users.find(u => u.email === userEmail)

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
  }

  const { limit = 50, category, type } = req.query

  let transactions = user.transactions

  if (category) {
    transactions = transactions.filter(t => t.category === category)
  }

  if (type) {
    transactions = transactions.filter(t => t.type === type)
  }

  res.json({
    success: true,
    data: transactions.slice(0, parseInt(limit))
  })
})

// Obter extrato com análise inteligente
router.get('/extrato', authenticate, (req, res) => {
  const userEmail = req.headers['user-email'] || users[0].email
  const user = users.find(u => u.email === userEmail)

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
  }

  // Agrupar por mês
  const byMonth = {}
  user.transactions.forEach(t => {
    const date = new Date(t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = { expenses: 0, income: 0, transactions: [] }
    }
    
    byMonth[monthKey].transactions.push(t)
    if (t.type === 'debit') {
      byMonth[monthKey].expenses += Math.abs(t.amount)
    } else {
      byMonth[monthKey].income += t.amount
    }
  })

  const insights = []
  const now = new Date()
  const activeSubscriptions = user.subscriptions || [] // Assinaturas fixas do usuário
  
  const last90Days = user.transactions.filter(t => {
    const daysDiff = (now - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff <= 90
  })
  
  // Insight 1: Maior categoria de gastos
  const categoryTotals = last90Days
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})
  
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

  if (sortedCategories.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Maior categoria de gastos',
      message: `Você gastou ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sortedCategories[0][1])} em ${sortedCategories[0][0]} nos últimos 3 meses.`
    })
  }

  // Insight 2: Assinaturas ativas (USA DADOS FIXOS DO USUÁRIO)
  if (activeSubscriptions.length > 0) {
    const totalMonthly = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0)
    
    insights.push({
      type: 'info',
      title: 'Assinaturas ativas',
      message: `Você tem ${activeSubscriptions.length} assinatura${activeSubscriptions.length > 1 ? 's' : ''} ativa${activeSubscriptions.length > 1 ? 's' : ''} totalizando ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthly)}/mês.`
    })
  }

  // Insight 3: Comparação de gastos (últimos 30 vs 30-60 dias atrás)
  const last30Days = last90Days.filter(t => {
    const daysDiff = (now - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff <= 30 && t.type === 'debit'
  })
  
  const previous30Days = last90Days.filter(t => {
    const daysDiff = (now - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff > 30 && daysDiff <= 60 && t.type === 'debit'
  })

  if (previous30Days.length > 0) {
    const currentTotal = last30Days.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const previousTotal = previous30Days.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100

    if (Math.abs(percentChange) > 10) {
      insights.push({
        type: percentChange > 0 ? 'warning' : 'success',
        title: percentChange > 0 ? 'Gastos aumentaram' : 'Parabéns! Você economizou',
        message: `Seus gastos ${percentChange > 0 ? 'aumentaram' : 'diminuíram'} ${Math.abs(percentChange).toFixed(1)}% em relação ao mês anterior.`
      })
    }
  }

  // Insight 4: Recargas Claro (comportamento chave)
  const recharges = last90Days.filter(t => t.category === 'Recarga Celular' && t.type === 'debit')
  const rechargesPerMonth = recharges.length / 3

  if (rechargesPerMonth < 2) {
    insights.push({
      type: 'warning',
      title: 'Baixa frequência de recargas',
      message: `Você fez apenas ${recharges.length} recarga${recharges.length !== 1 ? 's' : ''} nos últimos 3 meses. Recargas regulares melhoram seu score!`
    })
  } else if (rechargesPerMonth >= 3) {
    insights.push({
      type: 'success',
      title: 'Ótima frequência de recargas',
      message: `Você mantém uma excelente consistência com ${recharges.length} recargas nos últimos 3 meses. Isso aumenta seu score!`
    })
  }

  // Insight 5: Gastos com lazer vs necessidades
  const lazerTotal = last30Days
    .filter(t => t.category === 'Lazer')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const necessidadesTotal = last30Days
    .filter(t => ['Moradia', 'Alimentação', 'Transporte', 'Saúde'].includes(t.category))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  if (necessidadesTotal > 0 && lazerTotal > necessidadesTotal * 0.3) {
    const lazerPercent = (lazerTotal / (lazerTotal + necessidadesTotal)) * 100
    insights.push({
      type: 'info',
      title: 'Equilíbrio financeiro',
      message: `${lazerPercent.toFixed(0)}% dos seus gastos são com lazer. Considere equilibrar com despesas essenciais.`
    })
  }

  // Projeta assinaturas FIXAS do usuário para os próximos 12 meses
  const futureSubscriptions = []
  
  activeSubscriptions.forEach(sub => {
    const now = new Date()
    
    // Projeta cada assinatura para 12 meses
    for (let i = 1; i <= 12; i++) {
      const futureDate = new Date(now)
      futureDate.setMonth(futureDate.getMonth() + i)
      futureDate.setDate(sub.dueDay || 15) // Usa o dia fixo de cobrança
      
      futureSubscriptions.push({
        id: `SUB_${sub.name.replace(/\s/g, '_')}_${i}`,
        description: sub.name,
        amount: sub.amount,
        category: 'Lazer',
        type: 'subscription',
        dueDate: futureDate.toISOString(),
        month: i,
        icon: sub.icon
      })
    }
  })

  // Combina parcelas futuras (empréstimos/cartão) com assinaturas projetadas
  const allFuturePayments = [
    ...(user.futurePayments || []),
    ...futureSubscriptions
  ].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  res.json({
    success: true,
    data: {
      byMonth,
      allTransactions: user.transactions,
      futurePayments: allFuturePayments,
      insights,
      score: user.score
    }
  })
})

// Criar nova transação (pagamento)
router.post('/', authenticate, (req, res) => {
  const userEmail = req.headers['user-email'] || users[0].email
  const user = users.find(u => u.email === userEmail)

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
  }

  const { description, amount, category, paymentMethod } = req.body

  if (!description || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Dados inválidos' })
  }

  // Determina se é crédito (empréstimo) ou débito (pagamento)
  const isLoan = paymentMethod === 'loan'
  const isCard = paymentMethod === 'card'
  const { installments = 1, monthlyPayment, totalAmount: totalWithInterest } = req.body
  
  // Verifica saldo apenas para pagamentos (não para empréstimos)
  if (!isLoan) {
    const balance = user.transactions.reduce((sum, t) => sum + t.amount, 0)
    if (balance < amount) {
      return res.status(400).json({ success: false, message: 'Saldo insuficiente' })
    }
  }

  // Cria nova transação
  const newTransaction = {
    id: `TXN${Date.now()}`,
    description,
    amount: isLoan ? Math.abs(amount) : -Math.abs(amount), // Positivo para empréstimo, negativo para pagamento
    category: category || 'Outros',
    type: isLoan ? 'credit' : 'debit',
    date: new Date().toISOString(),
    icon: isLoan ? 'mdi-cash-plus' :
          paymentMethod === 'pix' ? 'mdi-qrcode' : 
          paymentMethod === 'boleto' ? 'mdi-barcode' : 'mdi-credit-card'
  }

  // Adiciona transação ao início do array
  user.transactions.unshift(newTransaction)

  // Cria parcelas futuras para empréstimos e cartão parcelado
  if (isLoan || (isCard && installments > 1)) {
    const now = new Date()
    const paymentAmount = isLoan ? monthlyPayment : (totalWithInterest || amount) / installments
    const totalMonths = isLoan ? installments : installments
    
    // Se for empréstimo, adiciona aos empréstimos ativos
    if (isLoan) {
      user.activeLoans = user.activeLoans || []
      user.activeLoans.push({
        id: newTransaction.id,
        amount: Math.abs(amount),
        remainingAmount: Math.abs(amount),
        monthlyPayment: paymentAmount,
        remainingInstallments: totalMonths,
        totalInstallments: totalMonths,
        startDate: now.toISOString()
      })
    }
    
    // Cria parcelas futuras
    user.futurePayments = user.futurePayments || []
    for (let i = 1; i <= totalMonths; i++) {
      const dueDate = new Date(now)
      dueDate.setMonth(dueDate.getMonth() + i)
      
      user.futurePayments.push({
        id: `FUT${Date.now()}_${i}`,
        transactionId: newTransaction.id,
        description: isLoan ? `Parcela ${i}/${totalMonths} - Empréstimo` : `Parcela ${i}/${totalMonths} - ${description}`,
        amount: paymentAmount,
        category: isLoan ? 'Empréstimo' : category,
        type: 'future',
        paymentType: isLoan ? 'loan' : 'card',
        dueDate: dueDate.toISOString(),
        installment: i,
        totalInstallments: totalMonths,
        icon: isLoan ? 'mdi-cash-minus' : 'mdi-credit-card'
      })
    }
  }

  // Recalcula saldo
  const newBalance = user.transactions.reduce((sum, t) => sum + t.amount, 0)

  res.json({
    success: true,
    message: isLoan ? 'Empréstimo aprovado com sucesso' : 'Pagamento realizado com sucesso',
    data: {
      transaction: newTransaction,
      newBalance
    }
  })
})

export default router
