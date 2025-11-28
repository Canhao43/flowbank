# 🧮 Algoritmos e Cálculos - Documentação Técnica

## 🎯 Score de Saúde Financeira

### Filosofia do Algoritmo

O **Score de Saúde Financeira** do FlowBank é único no mercado porque:

1. ✅ **Não depende de bureaus de crédito** (SPC, Serasa)
2. ✅ **Analisa comportamento real** dentro do próprio banco
3. ✅ **É transparente e educativo** - cliente sabe como melhorar
4. ✅ **Atualiza em tempo real** - cada transação pode impactar
5. ✅ **Prioriza saúde financeira** sobre volume de crédito

---

### 📊 Fórmula Completa do Score

```javascript
function calculateScore(transactions, monthsActive) {
  let score = 0 // Inicia em 0
  
  // Filtros de transações
  const recargas = transactions.filter(t => 
    t.category === 'Recarga Celular' && t.type === 'debit'
  )
  const contas = transactions.filter(t => 
    t.category === 'Moradia' && t.type === 'debit'
  )
  
  // Calcula saldo atual
  const saldo = transactions.reduce((sum, t) => sum + t.amount, 0)
  
  // ==========================================
  // FATOR 1: SAÚDE DO SALDO (25 pontos)
  // ==========================================
  if (saldo >= 5000) score += 25       // R$ 5k+ = Excelente reserva
  else if (saldo >= 2000) score += 18  // R$ 2k+ = Boa reserva
  else if (saldo >= 500) score += 10   // R$ 500+ = Reserva moderada
  else if (saldo >= 0) score += 3      // Positivo mas baixo
  else if (saldo >= -1000) score -= 10 // Levemente negativo (PENALIDADE)
  else if (saldo >= -3000) score -= 20 // Negativo moderado (PENALIDADE CRÍTICA)
  else score -= 35                     // Muito negativo (PENALIDADE MÁXIMA)
  
  // ==========================================
  // FATOR 2: RECORRÊNCIA DE RECARGAS (25 pontos)
  // ==========================================
  const recargasPerMonth = recargas.length / monthsActive
  
  if (recargasPerMonth >= 4) score += 25      // 4+ recargas/mês = Excelente
  else if (recargasPerMonth >= 3) score += 18 // 3+ recargas/mês = Muito bom
  else if (recargasPerMonth >= 2) score += 10 // 2+ recargas/mês = Bom
  else if (recargasPerMonth >= 1) score += 3  // 1+ recarga/mês = Fraco
  // Menos de 1/mês = 0 pontos (sem penalidade)
  
  // ==========================================
  // FATOR 3: PAGAMENTO DE CONTAS (20 pontos)
  // ==========================================
  const contasPerMonth = contas.length / monthsActive
  
  if (contasPerMonth >= 3) score += 20       // 3+ contas/mês = Excelente
  else if (contasPerMonth >= 2) score += 10  // 2+ contas/mês = Bom
  else if (contasPerMonth >= 1) score += 3   // 1+ conta/mês = Fraco
  
  // ==========================================
  // FATOR 4: TEMPO DE CONTA (15 pontos)
  // ==========================================
  score += Math.min(monthsActive * 1, 15) // 1 ponto/mês, máx 15
  
  // ==========================================
  // FATOR 5: DIVERSIDADE (8 pontos)
  // ==========================================
  const categorias = [...new Set(transactions.map(t => t.category))]
  
  if (categorias.length >= 6) score += 8      // 6+ categorias = Excelente
  else if (categorias.length >= 5) score += 5 // 5 categorias = Muito bom
  else if (categorias.length >= 4) score += 2 // 4 categorias = Bom
  
  // ==========================================
  // FATOR 6: VOLUME DE TRANSAÇÕES (7 pontos)
  // ==========================================
  const transactionsPerMonth = transactions.length / monthsActive
  
  if (transactionsPerMonth >= 30) score += 7     // 30+ transações/mês
  else if (transactionsPerMonth >= 20) score += 4 // 20+ transações/mês
  else if (transactionsPerMonth >= 10) score += 1 // 10+ transações/mês
  
  // ==========================================
  // FATOR 7: CONSISTÊNCIA MENSAL (5 pontos)
  // ==========================================
  const mesesAtivos = {}
  transactions.forEach(t => {
    const mesKey = new Date(t.date).toISOString().slice(0, 7) // YYYY-MM
    mesesAtivos[mesKey] = (mesesAtivos[mesKey] || 0) + 1
  })
  
  const mesesComAtividade = Object.keys(mesesAtivos).length
  const consistencia = mesesComAtividade / monthsActive
  
  if (consistencia >= 0.95) score += 5       // 95%+ = Muito consistente
  else if (consistencia >= 0.8) score += 3   // 80%+ = Consistente
  else if (consistencia >= 0.6) score += 1   // 60%+ = Moderado
  
  // ==========================================
  // NORMALIZAÇÃO FINAL
  // ==========================================
  // Garante que score está entre 15 e 100
  return Math.min(Math.max(score, 15), 100)
}
```

---

### 📈 Distribuição de Pontos (Máximo Teórico)

```
Total Teórico Máximo: 105 pontos (limitado a 100)

┌──────────────────────────┬─────────┬──────────┐
│ Fator                    │ Pontos  │ % Total  │
├──────────────────────────┼─────────┼──────────┤
│ Saúde do Saldo           │ 25      │ 23.8%    │
│ Recorrência de Recargas  │ 25      │ 23.8%    │
│ Pagamento de Contas      │ 20      │ 19.0%    │
│ Tempo de Relacionamento  │ 15      │ 14.3%    │
│ Diversidade de Gastos    │  8      │  7.6%    │
│ Volume de Transações     │  7      │  6.7%    │
│ Consistência Mensal      │  5      │  4.8%    │
├──────────────────────────┼─────────┼──────────┤
│ TOTAL                    │ 105     │ 100%     │
└──────────────────────────┴─────────┴──────────┘
```

**Por que essa distribuição?**

1. **Saúde do Saldo (25%)**: Indicador mais importante de responsabilidade financeira
   - Cliente com reservas raramente fica inadimplente
   - Demonstra capacidade de poupar
   
2. **Recargas (25%)**: Proxy de renda ativa
   - Quem paga celular regularmente tem fluxo de caixa
   - Indicador confiável de emprego/renda
   
3. **Contas (20%)**: Responsabilidade com compromissos
   - Pagamento de luz, água, internet
   - Demonstra priorização de despesas essenciais
   
4. **Tempo (15%)**: Fidelidade e histórico
   - Quanto mais tempo, mais dados confiáveis
   - Relacionamento de longo prazo vale mais
   
5. **Demais fatores (15%)**: Complementares
   - Refinam a análise
   - Diferenciam clientes similares

---

### 🎯 Casos de Uso Reais

#### Caso 1: Cliente Diamante Perfeito

```javascript
Cliente: João Silva
Meses Ativos: 18
Transações: 280
Saldo: R$ 1.647,50

Cálculo:
├─ Saldo (R$ 1.647,50 ≥ 500): +10 pontos
├─ Recargas (52 / 18 = 2.9/mês): +18 pontos
├─ Contas (54 / 18 = 3/mês): +20 pontos
├─ Tempo (18 meses): +15 pontos (max)
├─ Diversidade (7 categorias): +8 pontos
├─ Volume (280 / 18 = 15.5/mês): +4 pontos
└─ Consistência (18/18 = 100%): +5 pontos

Score Final: 10+18+20+15+8+4+5 = 80 pontos
Tier: 🥇 Ouro (estava perto de Diamante)

Observação: Com apenas R$ 353 a mais no saldo,
chegaria a R$ 2.000 e ganharia +8 pontos = 88 (Diamante)
```

#### Caso 2: Cliente em Desenvolvimento

```javascript
Cliente: Maria Santos
Meses Ativos: 8
Transações: 110
Saldo: R$ 623,80

Cálculo:
├─ Saldo (R$ 623,80 ≥ 500): +10 pontos
├─ Recargas (18 / 8 = 2.25/mês): +10 pontos
├─ Contas (20 / 8 = 2.5/mês): +10 pontos
├─ Tempo (8 meses): +8 pontos
├─ Diversidade (5 categorias): +5 pontos
├─ Volume (110 / 8 = 13.75/mês): +1 ponto
└─ Consistência (8/8 = 100%): +5 pontos

Score Final: 10+10+10+8+5+1+5 = 49 pontos
Tier: 🥈 Prata

Dicas para subir para Ouro (50+):
- Fazer mais 1 recarga/mês (+8 pontos)
- Ou aumentar saldo para R$ 2.000 (+8 pontos)
- Ou manter conta por mais 7 meses (+7 pontos)
```

#### Caso 3: Cliente em Situação Crítica

```javascript
Cliente: Hipotético - João em Dificuldade
Meses Ativos: 12
Transações: 85
Saldo: -R$ 4.500 (muito negativo)

Cálculo:
├─ Saldo (-R$ 4.500 < -3.000): -35 pontos ⚠️
├─ Recargas (8 / 12 = 0.66/mês): +0 pontos
├─ Contas (12 / 12 = 1/mês): +3 pontos
├─ Tempo (12 meses): +12 pontos
├─ Diversidade (4 categorias): +2 pontos
├─ Volume (85 / 12 = 7/mês): +0 pontos
└─ Consistência (10/12 = 83%): +3 pontos

Score Final: -35+0+3+12+2+0+3 = -15 pontos
Normalizado: 15 pontos (mínimo)
Tier: 🔴 Bronze

Status: CRÍTICO
Ações do Banco:
- Bloquear novos empréstimos
- Congelar limite de crédito
- Contato imediato para negociação
- Oferecer programa de recuperação
```

---

## 🏅 Sistema de Tiers

### Limites e Benefícios

```javascript
function getTierByScore(score) {
  if (score >= 80) {
    return {
      tier: 'Diamante',
      icon: '💎',
      color: 'green',
      creditLimit: 50000,
      loanInterest: 0.015, // 1.5% a.m.
      cashback: 0.03, // 3%
      benefits: [
        'Limite R$ 50.000',
        'Cashback 3%',
        'Juros 1,5% a.m.',
        'Atendimento VIP 24/7',
        'Salas VIP aeroportos',
        'Seguros gratuitos'
      ]
    }
  } else if (score >= 50) {
    return {
      tier: 'Ouro',
      icon: '🥇',
      color: 'amber',
      creditLimit: 20000,
      loanInterest: 0.025, // 2.5% a.m.
      cashback: 0.015, // 1.5%
      benefits: [
        'Limite R$ 20.000',
        'Cashback 1,5%',
        'Juros 2,5% a.m.',
        'Saques ilimitados',
        'Programa de pontos'
      ]
    }
  } else if (score >= 30) {
    return {
      tier: 'Prata',
      icon: '🥈',
      color: 'grey',
      creditLimit: 8000,
      loanInterest: 0.040, // 4% a.m.
      cashback: 0.005, // 0.5%
      benefits: [
        'Limite R$ 8.000',
        'Cashback 0,5%',
        'Juros 4% a.m.',
        'Cartão de crédito'
      ]
    }
  } else {
    return {
      tier: 'Bronze',
      icon: '🔴',
      color: 'red',
      creditLimit: 3000,
      loanInterest: 0.065, // 6.5% a.m.
      cashback: 0,
      benefits: [
        'Limite R$ 3.000',
        'Conta digital gratuita',
        'PIX ilimitado'
      ]
    }
  }
}
```

---

## 🎲 Algoritmo de Compatibilidade de Campanhas

### Fórmula de Match

```javascript
function calculateCampaignMatch(user, campaign) {
  let compatibility = 0
  
  // ==========================================
  // FATOR 1: SCORE (40% do peso)
  // ==========================================
  // Normaliza score do usuário para 0-40
  const scoreMatch = (user.score / 100) * 40
  compatibility += scoreMatch
  
  // Exemplo: 
  // - Score 100 = 40 pontos
  // - Score 50 = 20 pontos
  // - Score 25 = 10 pontos
  
  // ==========================================
  // FATOR 2: CATEGORIAS (30% do peso)
  // ==========================================
  // Verifica match entre categorias do usuário e da campanha
  const userTopCategories = getUserTopCategories(user, 3)
  const categoryMatches = campaign.targetCategories.filter(cat =>
    userTopCategories.includes(cat)
  ).length
  
  const categoryScore = (categoryMatches / campaign.targetCategories.length) * 30
  compatibility += categoryScore
  
  // Exemplo:
  // Campanha: [Lazer, Alimentação]
  // Usuário: [Lazer, Alimentação, Transporte]
  // Match: 2/2 = 100% = 30 pontos
  
  // ==========================================
  // FATOR 3: RECARGAS (20% do peso)
  // ==========================================
  const userRecharges = user.recharges / user.monthsActive
  
  if (userRecharges >= campaign.minRecharges) {
    // Cliente atende ao mínimo
    const excess = userRecharges - campaign.minRecharges
    const rechargeScore = Math.min(20, 10 + (excess * 2))
    compatibility += rechargeScore
  }
  // Se não atende ao mínimo, 0 pontos
  
  // Exemplo:
  // Mínimo: 2 recargas/mês
  // Usuário: 3 recargas/mês
  // Excesso: 1
  // Pontos: 10 + (1 × 2) = 12 pontos
  
  // ==========================================
  // FATOR 4: RENDA (10% do peso)
  // ==========================================
  const estimatedIncome = estimateUserIncome(user)
  
  if (estimatedIncome >= campaign.minIncome) {
    const ratio = estimatedIncome / campaign.minIncome
    const incomeScore = Math.min(10, ratio * 5)
    compatibility += incomeScore
  }
  
  // Exemplo:
  // Mínimo: R$ 2.500
  // Usuário: R$ 3.000
  // Ratio: 1.2
  // Pontos: 1.2 × 5 = 6 pontos
  
  // ==========================================
  // NORMALIZAÇÃO FINAL
  // ==========================================
  return Math.min(Math.max(Math.round(compatibility), 0), 100)
}
```

### Estimativa de Renda

```javascript
function estimateUserIncome(user) {
  // Método 1: Baseado em salário registrado
  if (user.salaryAmount > 0) {
    return user.salaryAmount
  }
  
  // Método 2: Baseado em transações de crédito
  const creditos = user.transactions.filter(t => t.type === 'credit')
  const mediaMensal = creditos.reduce((sum, t) => sum + t.amount, 0) / user.monthsActive
  
  if (mediaMensal > 0) {
    return mediaMensal
  }
  
  // Método 3: Estimativa conservadora baseada no saldo médio
  const saldoMedio = user.balance / user.monthsActive
  return Math.max(saldoMedio * 2, 1320) // Mínimo = salário mínimo
}
```

---

## 📊 Cálculos de ROI

### Métricas de Campanha

```javascript
function calculateCampaignROI(campaign) {
  // Dados da campanha
  const enviados = campaign.prospects.length
  const conversoes = campaign.conversions.length
  const custoUnitario = 10 // R$ 10 por lead (e-mail/notificação)
  const receitaMedia = 498 // R$ 498 valor médio do produto
  
  // Cálculos
  const taxaConversao = (conversoes / enviados) * 100
  const custoTotal = enviados * custoUnitario
  const receitaTotal = conversoes * receitaMedia
  const lucro = receitaTotal - custoTotal
  const roi = (lucro / custoTotal) * 100
  
  // CAC (Custo de Aquisição por Cliente)
  const cac = custoTotal / conversoes
  
  // LTV (Lifetime Value) estimado
  const ltv = receitaMedia * 12 // Assume 12 meses de fidelidade
  
  // Payback Period
  const paybackMonths = cac / (receitaMedia / 12)
  
  return {
    enviados,
    conversoes,
    taxaConversao: `${taxaConversao.toFixed(1)}%`,
    custoTotal: `R$ ${custoTotal.toLocaleString('pt-BR')}`,
    receitaTotal: `R$ ${receitaTotal.toLocaleString('pt-BR')}`,
    lucro: `R$ ${lucro.toLocaleString('pt-BR')}`,
    roi: `${roi.toFixed(0)}%`,
    cac: `R$ ${cac.toFixed(2)}`,
    ltv: `R$ ${ltv.toFixed(2)}`,
    paybackMonths: `${paybackMonths.toFixed(1)} meses`
  }
}
```

**Exemplo Real:**

```
Campanha: Cartão Platinum
Prospects: 42 clientes (match ≥ 50%)

Resultados:
├─ Enviados: 42
├─ Conversões: 10
├─ Taxa de Conversão: 23.8%
├─ Custo Total: R$ 420
├─ Receita Total: R$ 4.980
├─ Lucro: R$ 4.560
├─ ROI: 1.086%
├─ CAC: R$ 42,00
├─ LTV: R$ 5.976,00
└─ Payback: 1 mês

Comparação com Broadcast (envio massivo):
├─ Enviados: 100
├─ Conversões: 5
├─ Taxa de Conversão: 5%
├─ Custo Total: R$ 1.000
├─ Receita Total: R$ 2.490
├─ Lucro: R$ 1.490
├─ ROI: 149%
├─ CAC: R$ 200,00
└─ Payback: 4.8 meses

Melhoria com IA:
✅ 376% mais conversões (10 vs 5)
✅ 206% mais lucro (R$ 4.560 vs R$ 1.490)
✅ 628% melhor ROI (1.086% vs 149%)
✅ 79% redução no CAC (R$ 42 vs R$ 200)
```

---

## 🔢 Outros Cálculos Importantes

### Limite de Crédito Disponível

```javascript
function calculateAvailableCredit(user) {
  // Limite base do tier
  const tierInfo = getTierByScore(user.score)
  const baseLimit = tierInfo.creditLimit
  
  // Subtrai empréstimos ativos
  const activeLoans = user.activeLoans || []
  const loansTotal = activeLoans.reduce((sum, loan) => sum + loan.remaining, 0)
  
  // Subtrai fatura do cartão
  const cardBalance = user.cardBalance || 0
  
  // Limite disponível
  const available = baseLimit - loansTotal - cardBalance
  
  return Math.max(available, 0) // Não pode ser negativo
}
```

### Cálculo de Parcelas de Empréstimo

```javascript
function calculateLoanInstallments(principal, rate, months) {
  // Fórmula Price (parcela fixa)
  const monthlyRate = rate // Taxa já vem mensal
  const factor = Math.pow(1 + monthlyRate, months)
  const installment = principal * (monthlyRate * factor) / (factor - 1)
  
  const total = installment * months
  const interest = total - principal
  
  return {
    installment: Math.round(installment * 100) / 100,
    total: Math.round(total * 100) / 100,
    interest: Math.round(interest * 100) / 100,
    effectiveRate: (monthlyRate * 12 * 100).toFixed(2) + '% a.a.'
  }
}
```

**Exemplo:**

```javascript
calculateLoanInstallments(5000, 0.025, 12)

// Retorna:
{
  installment: 471.23,
  total: 5654.76,
  interest: 654.76,
  effectiveRate: '30.00% a.a.'
}
```

---

## 🎯 Validações e Regras de Negócio

### Validação de Score

```javascript
function validateScore(score) {
  // Score deve estar entre 15 e 100
  if (score < 15) return 15
  if (score > 100) return 100
  return score
}
```

### Validação de Campanha

```javascript
function validateCampaign(campaign) {
  const errors = []
  
  // Nome obrigatório
  if (!campaign.name || campaign.name.trim() === '') {
    errors.push('Nome da campanha é obrigatório')
  }
  
  // Score mínimo válido
  if (campaign.minScore < 0 || campaign.minScore > 100) {
    errors.push('Score mínimo deve estar entre 0 e 100')
  }
  
  // Categorias obrigatórias
  if (!campaign.categories || campaign.categories.length === 0) {
    errors.push('Selecione pelo menos uma categoria')
  }
  
  // Período válido
  if (new Date(campaign.endDate) <= new Date(campaign.startDate)) {
    errors.push('Data final deve ser posterior à data inicial')
  }
  
  return errors
}
```

---

**Próximo:** [05-SISTEMA-CAMPANHAS.md](./05-SISTEMA-CAMPANHAS.md)
