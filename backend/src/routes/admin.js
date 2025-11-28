import express from 'express'
import users from '../data/users.js'
import campaigns from '../data/campaigns.js'

const router = express.Router()

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autenticado' })
  }
  next()
}

// Dashboard administrativo (apenas PJ)
router.get('/customers', authenticate, (req, res) => {
  const userEmail = req.headers['user-email']
  const adminUser = users.find(u => u.email === userEmail)

  console.log('Admin request - User email:', userEmail)
  console.log('Admin user found:', adminUser?.name, adminUser?.type)
  console.log('Total users in database:', users.length)

  if (!adminUser || adminUser.type !== 'PJ') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas contas empresariais.' 
    })
  }

  // Retorna todos os usuários PF com estatísticas
  const customers = users
    .filter(u => u.type === 'PF')
    .map(customer => {
      const last30Days = customer.transactions.filter(t => {
        const daysDiff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24)
        return daysDiff <= 30
      })

      const recharges = customer.transactions.filter(t => 
        t.category === 'Recarga Celular' && t.type === 'debit'
      )

      const totalSpent = last30Days
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const totalRecharges = recharges.reduce((sum, t) => sum + Math.abs(t.amount), 0)

      console.log(`${customer.name}: Score = ${customer.score}`)

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        balance: customer.balance,
        score: customer.score,
        creditLimit: customer.creditLimit,
        avatar: customer.avatar,
        createdAt: customer.createdAt,
        stats: {
          totalTransactions: customer.transactions.length,
          totalSpent,
          totalRecharges,
          rechargeCount: recharges.length,
          lastRecharge: recharges[0]?.date || null,
          avgRechargeValue: recharges.length > 0 
            ? totalRecharges / recharges.length 
            : 0
        }
      }
    })

  // Estatísticas gerais
  const totalCustomers = customers.length
  const averageScore = customers.reduce((sum, c) => sum + c.score, 0) / totalCustomers
  const totalRevenueFromRecharges = customers.reduce((sum, c) => sum + c.stats.totalRecharges, 0)
  const activeCustomers = customers.filter(c => c.stats.totalTransactions > 10).length

  res.json({
    success: true,
    data: {
      customers,
      summary: {
        totalCustomers,
        activeCustomers,
        averageScore: parseFloat(averageScore.toFixed(1)),
        totalRevenueFromRecharges: parseFloat(totalRevenueFromRecharges.toFixed(2)),
        conversionRate: parseFloat(((activeCustomers / totalCustomers) * 100).toFixed(1))
      }
    }
  })
})

// Detalhes de um cliente específico
router.get('/customers/:id', authenticate, (req, res) => {
  const userEmail = req.headers['user-email']
  const adminUser = users.find(u => u.email === userEmail)

  if (!adminUser || adminUser.type !== 'PJ') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado' 
    })
  }

  const customer = users.find(u => u.id === req.params.id && u.type === 'PF')

  if (!customer) {
    return res.status(404).json({ 
      success: false, 
      message: 'Cliente não encontrado' 
    })
  }

  res.json({
    success: true,
    data: {
      ...customer,
      password: undefined // Remove senha
    }
  })
})

// ============= CAMPANHAS E INSIGHTS DE VENDAS =============

// Listar todas as campanhas ativas
router.get('/campaigns', authenticate, (req, res) => {
  const userEmail = req.headers['user-email']
  const adminUser = users.find(u => u.email === userEmail)

  if (!adminUser || adminUser.type !== 'PJ') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado' 
    })
  }

  const activeCampaigns = campaigns.filter(c => c.active)

  res.json({
    success: true,
    data: activeCampaigns
  })
})

// Calcular compatibilidade de um cliente com uma campanha
function calculateCompatibility(customer, campaign) {
  let score = 0
  let maxScore = 0
  const reasons = []

  const last90Days = customer.transactions.filter(t => {
    const daysDiff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24)
    return daysDiff <= 90
  })

  // 1. Score mínimo (peso: 20 pontos) - CRITÉRIO ELIMINATÓRIO
  maxScore += 20
  if (customer.score >= campaign.targetProfile.minScore) {
    const scoreRange = 100 - campaign.targetProfile.minScore
    const customerAboveMin = customer.score - campaign.targetProfile.minScore
    score += 10 + (customerAboveMin / scoreRange) * 10 // 10-20 pontos
    reasons.push(`✅ Score ${customer.score} (mín: ${campaign.targetProfile.minScore})`)
  } else {
    // Score abaixo do mínimo = 0 pontos
    reasons.push(`❌ Score ${customer.score} insuficiente (mín: ${campaign.targetProfile.minScore})`)
  }

  // 2. Score máximo (se definido) - para campanhas Light
  if (campaign.targetProfile.maxScore) {
    if (customer.score <= campaign.targetProfile.maxScore) {
      score += 5
      reasons.push(`✅ Score ideal para esta oferta`)
    } else {
      score -= 15 // Penalidade pesada para quem está acima
      reasons.push(`⚠️ Score muito alto para esta oferta econômica`)
    }
  }

  // 3. Categorias de gasto (peso: 30 pontos) - MAIS SELETIVO
  if (campaign.targetProfile.categories && campaign.targetProfile.categories.length > 0) {
    maxScore += 30
    const customerCategories = [...new Set(last90Days.map(t => t.category))]
    const matchedCategories = campaign.targetProfile.categories.filter(cat => 
      customerCategories.includes(cat)
    )
    
    const matchRate = matchedCategories.length / campaign.targetProfile.categories.length
    const categoryScore = matchRate * 30
    score += categoryScore
    
    if (matchedCategories.length > 0) {
      reasons.push(`${matchRate >= 0.7 ? '✅' : '⚠️'} Gasta em ${matchedCategories.length}/${campaign.targetProfile.categories.length} categorias alvo`)
    } else {
      reasons.push(`❌ Não gasta em categorias relevantes`)
    }
  }

  // 4. Recargas por mês (peso: 25 pontos) - SELETIVO
  if (campaign.targetProfile.minRechargesPerMonth) {
    maxScore += 25
    const recharges = customer.transactions.filter(t => 
      t.category === 'Recarga Celular' && t.type === 'debit'
    )
    const monthsToAnalyze = Math.min(customer.monthsActive || 1, 3) // Últimos 3 meses
    const rechargesPerMonth = recharges.length / monthsToAnalyze
    
    if (rechargesPerMonth >= campaign.targetProfile.minRechargesPerMonth) {
      // Bonus para quem faz mais recargas que o mínimo
      const bonus = Math.min((rechargesPerMonth / campaign.targetProfile.minRechargesPerMonth) * 25, 25)
      score += bonus
      reasons.push(`✅ ${rechargesPerMonth.toFixed(1)} recargas/mês (mín: ${campaign.targetProfile.minRechargesPerMonth})`)
    } else if (rechargesPerMonth > 0) {
      // Pontuação parcial proporcional
      const partial = (rechargesPerMonth / campaign.targetProfile.minRechargesPerMonth) * 25
      score += partial
      reasons.push(`⚠️ ${rechargesPerMonth.toFixed(1)} recargas/mês (mín: ${campaign.targetProfile.minRechargesPerMonth})`)
    } else {
      reasons.push(`❌ Não faz recargas regularmente`)
    }
  }

  // 5. Valor médio de recarga (peso: 15 pontos) - SELETIVO
  if (campaign.targetProfile.minRechargeValue) {
    maxScore += 15
    const recharges = customer.transactions.filter(t => 
      t.category === 'Recarga Celular' && t.type === 'debit'
    )
    const avgRecharge = recharges.length > 0 
      ? recharges.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recharges.length 
      : 0
    
    if (avgRecharge >= campaign.targetProfile.minRechargeValue) {
      score += 15
      reasons.push(`✅ Média R$ ${avgRecharge.toFixed(2)}/recarga (mín: R$ ${campaign.targetProfile.minRechargeValue})`)
    } else if (avgRecharge > 0) {
      const partial = (avgRecharge / campaign.targetProfile.minRechargeValue) * 15
      score += partial
      reasons.push(`⚠️ Média R$ ${avgRecharge.toFixed(2)}/recarga (mín: R$ ${campaign.targetProfile.minRechargeValue})`)
    } else {
      reasons.push(`❌ Sem histórico de recargas`)
    }
  }

  // 6. Valor máximo de recarga (para planos Light) - SELETIVO
  if (campaign.targetProfile.maxRechargeValue) {
    maxScore += 10
    const recharges = customer.transactions.filter(t => 
      t.category === 'Recarga Celular' && t.type === 'debit'
    )
    const avgRecharge = recharges.length > 0 
      ? recharges.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recharges.length 
      : 0
    
    if (avgRecharge > 0 && avgRecharge <= campaign.targetProfile.maxRechargeValue) {
      score += 10
      reasons.push(`✅ Perfil econômico (R$ ${avgRecharge.toFixed(2)}/recarga)`)
    } else if (avgRecharge > campaign.targetProfile.maxRechargeValue) {
      // Penaliza quem gasta muito (não é o target)
      score -= 10
      reasons.push(`❌ Gasta muito com recargas (não ideal para plano Light)`)
    }
  }

  // 7. Tem assinaturas (peso: 10 pontos) - SELETIVO
  if (campaign.targetProfile.hasSubscriptions !== undefined) {
    maxScore += 10
    const hasSubscriptions = customer.subscriptions && customer.subscriptions.length > 0
    
    if (hasSubscriptions === campaign.targetProfile.hasSubscriptions) {
      score += 10
      if (hasSubscriptions) {
        reasons.push(`✅ Tem ${customer.subscriptions.length} assinatura(s) ativa(s)`)
      } else {
        reasons.push(`✅ Sem assinaturas (oportunidade de venda)`)
      }
    } else {
      // Não atende ao critério
      if (campaign.targetProfile.hasSubscriptions) {
        reasons.push(`❌ Não tem assinaturas de streaming`)
      }
    }
  }

  // 8. Paga aluguel (para internet) - BONUS/MALUS
  if (campaign.targetProfile.hasRent !== undefined) {
    const paysRent = last90Days.some(t => t.description === 'Aluguel')
    
    if (paysRent === campaign.targetProfile.hasRent) {
      score += 5
      if (paysRent) {
        reasons.push(`✅ Paga aluguel (precisa de internet fixa)`)
      }
    } else if (!paysRent && campaign.targetProfile.hasRent) {
      // Prefere quem aluga mas não elimina quem tem casa
      score -= 3
    }
  }

  // 9. RENDA - Critério importante
  const incomeTransactions = last90Days.filter(t => t.type === 'credit')
  const estimatedMonthlyIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / 3

  if (campaign.targetProfile.preferredIncome) {
    maxScore += 10
    if (estimatedMonthlyIncome >= campaign.targetProfile.preferredIncome) {
      score += 10
      reasons.push(`✅ Renda estimada R$ ${estimatedMonthlyIncome.toFixed(0)}`)
    } else {
      const incomeRatio = estimatedMonthlyIncome / campaign.targetProfile.preferredIncome
      score += incomeRatio * 10
      reasons.push(`⚠️ Renda estimada R$ ${estimatedMonthlyIncome.toFixed(0)} (ideal: R$ ${campaign.targetProfile.preferredIncome})`)
    }
  }

  // Normaliza score para 0-100, mas garante que scores muito baixos fiquem próximos de 0
  let compatibilityScore = maxScore > 0 ? (score / maxScore) * 100 : 0
  
  // Aplica curva de penalidade para scores muito baixos
  if (compatibilityScore < 40) {
    compatibilityScore = compatibilityScore * 0.7 // Reduz ainda mais
  }
  
  compatibilityScore = Math.max(0, Math.min(100, Math.round(compatibilityScore)))

  return {
    score: compatibilityScore,
    estimatedIncome: estimatedMonthlyIncome,
    meetsMinimumIncome: estimatedMonthlyIncome >= (campaign.targetProfile.preferredIncome || 0),
    reasons: reasons.slice(0, 5), // Top 5 razões
    canAfford: estimatedMonthlyIncome >= campaign.campaignPrice * 1.2, // Margem de 20%
    savingsPerMonth: campaign.originalPrice - campaign.campaignPrice,
    savingsDescription: campaign.discount
  }
}

// Obter clientes propensos para uma campanha específica
router.get('/campaigns/:id/prospects', authenticate, (req, res) => {
  const userEmail = req.headers['user-email']
  const adminUser = users.find(u => u.email === userEmail)

  if (!adminUser || adminUser.type !== 'PJ') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado' 
    })
  }

  const campaign = campaigns.find(c => c.id === req.params.id)
  
  if (!campaign) {
    return res.status(404).json({ 
      success: false, 
      message: 'Campanha não encontrada' 
    })
  }

  // Parâmetros de ordenação
  const sortBy = req.query.sortBy || 'compatibility' // 'compatibility' ou 'income'
  const includeIncome = req.query.includeIncome === 'true'

  // Calcula compatibilidade para todos os clientes PF
  const prospects = users
    .filter(u => u.type === 'PF')
    .map(customer => {
      const compatibility = calculateCompatibility(customer, campaign)
      
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        score: customer.score,
        avatar: customer.avatar,
        monthsActive: customer.monthsActive,
        compatibility: compatibility.score,
        estimatedIncome: compatibility.estimatedIncome,
        meetsMinimumIncome: compatibility.meetsMinimumIncome,
        canAfford: compatibility.canAfford,
        reasons: compatibility.reasons,
        savingsPerMonth: compatibility.savingsPerMonth,
        savingsDescription: compatibility.savingsDescription
      }
    })

  // Ordena por compatibilidade (sempre)
  prospects.sort((a, b) => b.compatibility - a.compatibility)

  // Se incluir renda, reordena considerando ambos os fatores
  if (includeIncome && sortBy === 'income') {
    prospects.sort((a, b) => {
      // Primeiro por compatibilidade alta (>50)
      const aHighCompat = a.compatibility >= 50
      const bHighCompat = b.compatibility >= 50
      
      if (aHighCompat && !bHighCompat) return -1
      if (!aHighCompat && bHighCompat) return 1
      
      // Dentro do mesmo grupo, ordena por renda
      return b.estimatedIncome - a.estimatedIncome
    })
  }

  // Insights gerais da campanha
  const totalProspects = prospects.length
  const highCompatibility = prospects.filter(p => p.compatibility >= 70).length
  const mediumCompatibility = prospects.filter(p => p.compatibility >= 50 && p.compatibility < 70).length
  const canAffordCount = prospects.filter(p => p.canAfford).length
  const avgCompatibility = prospects.reduce((sum, p) => sum + p.compatibility, 0) / totalProspects
  const potentialRevenue = canAffordCount * campaign.campaignPrice

  res.json({
    success: true,
    data: {
      campaign,
      prospects,
      insights: {
        totalProspects,
        highCompatibility,
        mediumCompatibility,
        canAffordCount,
        avgCompatibility: Math.round(avgCompatibility),
        potentialRevenue: Math.round(potentialRevenue),
        conversionEstimate: Math.round((highCompatibility / totalProspects) * 100)
      }
    }
  })
})

export default router
