# 🏢 Painel Administrativo - Documentação Completa

## 🎯 Visão Geral do Admin

O **Painel Administrativo do FlowBank** é uma plataforma de **Business Intelligence** e **gestão de campanhas** que transforma dados brutos de 100 clientes em **insights acionáveis** para aumentar vendas e reduzir riscos.

### Por que um Painel Admin é Estratégico?

Bancos tradicionais falham em:
- ❌ Enviar ofertas genéricas para todos
- ❌ Não segmentar clientes adequadamente
- ❌ Desperdiçar recursos em leads ruins
- ❌ Não identificar oportunidades de upsell

**FlowBank resolve com:**
- ✅ Segmentação automática por IA
- ✅ Campanhas personalizadas
- ✅ ROI mensurável
- ✅ Prevenção de inadimplência

---

## 📊 Dashboard Executivo

### Visão Estratégica em Tempo Real

#### 1️⃣ **Métricas Principais (KPIs)**

```
┌─────────────────────────────────────────┐
│ 📈 TOTAL DE CLIENTES                    │
│    100 clientes                         │
│    +12% vs mês anterior                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💰 RECEITA TOTAL                        │
│    R$ 47.832,50                         │
│    +8% vs mês anterior                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⭐ SCORE MÉDIO                          │
│    61 pontos                            │
│    Base saudável (maioria em Ouro)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎯 TAXA DE CONVERSÃO                    │
│    24.5%                                │
│    +15% com campanhas inteligentes     │
└─────────────────────────────────────────┘
```

**Cálculos:**
```javascript
// Total de Clientes
totalClientes = users.filter(u => u.type === 'PF').length

// Receita Total (últimos 30 dias)
receita = sum(transactions.filter(t => 
  t.type === 'credit' && 
  t.date >= lastMonth
).map(t => t.amount))

// Score Médio da Base
scoreMedia = avg(users.map(u => u.score))

// Taxa de Conversão
conversao = (campanhasConvertidas / campanhasEnviadas) * 100
```

---

#### 2️⃣ **Distribuição de Clientes por Tier**

```
Gráfico de Pizza:

💎 Diamante (80-100): 33 clientes (33%)
   - Menor risco
   - Maior valor vitalício (LTV)
   - Foco em retenção

🥇 Ouro (50-79): 38 clientes (38%)
   - Risco moderado
   - Potencial de upgrade
   - Foco em crescimento

🥈 Prata (30-49): 16 clientes (16%)
   - Risco médio-alto
   - Necessitam educação financeira
   - Foco em desenvolvimento

🔴 Bronze (15-29): 13 clientes (13%)
   - Alto risco
   - Limites reduzidos
   - Foco em monitoramento
```

**Insight Estratégico:**
```
71% dos clientes estão em Ouro ou Diamante
= Base saudável com baixo risco de inadimplência
= Oportunidade de aumentar limites e vender produtos premium
```

---

#### 3️⃣ **Análise de Engajamento**

```
Métricas de Atividade:

├─ Clientes Ativos (30 dias): 87%
├─ Login Semanal: 78%
├─ Uso de PIX: 92%
├─ Uso de Cartão: 65%
├─ Simulações de Empréstimo: 42%
└─ Visualização de Score: 91%
```

**Segmentação por Engajamento:**
```
🔥 Alta Atividade (20+ transações/mês): 45 clientes
   → Alvo para cartões premium e investimentos

📊 Média Atividade (10-19 transações/mês): 38 clientes
   → Alvo para programas de fidelidade

⚠️ Baixa Atividade (<10 transações/mês): 17 clientes
   → Risco de churn, enviar campanhas de reengajamento
```

---

#### 4️⃣ **Indicadores de Risco**

```
Alertas de Inadimplência:

🔴 Crítico (saldo < -R$ 2.000): 8 clientes
   → Ação: Bloquear novos empréstimos
   → Ação: Contato proativo para negociação

⚠️ Atenção (saldo -R$ 500 a -R$ 2.000): 12 clientes
   → Ação: Monitorar semanalmente
   → Ação: Oferecer consultoria financeira

🟡 Observação (saldo R$ 0 a R$ 500): 23 clientes
   → Ação: Educar sobre reserva de emergência

✅ Saudável (saldo > R$ 500): 57 clientes
   → Ação: Upsell de produtos
```

---

## 👥 Gestão de Clientes

### Visão 360° de Cada Cliente

#### 🔍 **Lista de Clientes com Filtros Avançados**

```
Filtros Disponíveis:

1. Score:
   ├─ Todos
   ├─ Diamante (80-100)
   ├─ Ouro (50-79)
   ├─ Prata (30-49)
   └─ Bronze (15-29)

2. Engajamento:
   ├─ Todos
   ├─ Alta Atividade
   ├─ Média Atividade
   └─ Baixa Atividade

3. Risco:
   ├─ Todos
   ├─ Saudável
   ├─ Observação
   ├─ Atenção
   └─ Crítico

4. Busca:
   └─ Por nome, CPF, e-mail
```

**Colunas da Tabela:**
```
┌────────────┬────────┬──────────────┬──────────┬─────────────┬────────┐
│ Nome       │ Score  │ Tier         │ Saldo    │ Recargas    │ Ações  │
├────────────┼────────┼──────────────┼──────────┼─────────────┼────────┤
│ João Silva │  100   │ 💎 Diamante  │ R$ 1.6k  │ 52x (2.9/m) │ [👁️ℹ️] │
│ Maria S.   │   32   │ 🥈 Prata     │ R$ 623   │ 18x (2.2/m) │ [👁️ℹ️] │
│ Carlos O.  │   50   │ 🥇 Ouro      │ R$ 189   │ 4x (1.3/m)  │ [👁️ℹ️] │
└────────────┴────────┴──────────────┴──────────┴─────────────┴────────┘
```

**Ordenação:**
- Por Score (padrão)
- Por Saldo
- Por Nome
- Por Recargas/mês

---

#### 📋 **Modal de Detalhes do Cliente**

Ao clicar no ícone 👁️, abre modal completo com **4 seções de insights**:

##### **Seção 1: KPIs do Cliente**

```
┌─────────────────────────────────────────┐
│ SCORE ATUAL                             │
│ 72 pontos                               │
│ Tier: 🥇 Ouro                           │
│ Cor: Amarelo (Bom)                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ NÍVEL DE ENGAJAMENTO                    │
│ Alto                                    │
│ 28 transações/mês                       │
│ Login: 23 dias dos últimos 30           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ POTENCIAL DE CONVERSÃO                  │
│ Médio-Alto                              │
│ 68% de match com produtos premium       │
│ Histórico: 2 conversões de 3 ofertas   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CLASSIFICAÇÃO DE RISCO                  │
│ Baixo                                   │
│ Saldo positivo há 8 meses               │
│ 0 atrasos nos últimos 12 meses          │
└─────────────────────────────────────────┘
```

**Algoritmos:**

```javascript
// Tier do Cliente
function getClientTier(score) {
  if (score >= 80) return { tier: 'Diamante', icon: '💎', color: 'green' }
  if (score >= 50) return { tier: 'Ouro', icon: '🥇', color: 'amber' }
  if (score >= 30) return { tier: 'Prata', icon: '🥈', color: 'grey' }
  return { tier: 'Bronze', icon: '🔴', color: 'red' }
}

// Nível de Engajamento
function getEngagementLevel(transactionsPerMonth) {
  if (transactionsPerMonth >= 20) return 'Alto'
  if (transactionsPerMonth >= 10) return 'Médio'
  return 'Baixo'
}

// Potencial de Conversão
function getConversionPotential(score, rechargeFrequency, balance) {
  let potential = 0
  
  if (score >= 70) potential += 40
  else if (score >= 50) potential += 25
  else if (score >= 30) potential += 10
  
  if (rechargeFrequency >= 3) potential += 30
  else if (rechargeFrequency >= 2) potential += 15
  
  if (balance > 1000) potential += 30
  else if (balance > 500) potential += 15
  else if (balance > 0) potential += 5
  
  if (potential >= 70) return 'Alto'
  if (potential >= 40) return 'Médio-Alto'
  if (potential >= 20) return 'Médio'
  return 'Baixo'
}

// Classificação de Risco
function getRiskClassification(balance, score, latePayments) {
  if (balance < -2000 || latePayments > 2 || score < 30) return 'Crítico'
  if (balance < -500 || latePayments > 0 || score < 50) return 'Alto'
  if (balance < 500 || score < 70) return 'Moderado'
  return 'Baixo'
}
```

##### **Seção 2: Insights Estratégicos**

```
💡 RECOMENDAÇÕES PERSONALIZADAS

Para: Maria Santos (Score 32, Prata)

1️⃣ OPORTUNIDADE DE UPSELL
   "Cliente com alta frequência de recargas (2.2/mês).
    Ofereca plano de telefonia com desconto."
   
   Produto Sugerido: Plano Controle 15GB
   Probabilidade de Conversão: 68%
   Receita Estimada: R$ 49,90/mês

2️⃣ RISCO DE CHURN
   "Saldo baixo (R$ 623) e score em queda.
    Envie dicas de controle de gastos."
   
   Ação: E-mail com conteúdo educativo
   Objetivo: Aumentar score em 10 pts em 60 dias

3️⃣ POTENCIAL DE CRESCIMENTO
   "Está a 18 pontos do tier Ouro.
    Com pequenas melhorias pode alcançar."
   
   Dica para o Cliente:
   - Manter saldo acima de R$ 800 (+8 pts)
   - Fazer mais 2 recargas/mês (+5 pts)
   - Diversificar gastos (+5 pts)
```

**Geração de Insights:**

```javascript
function getRecommendation(client) {
  const insights = []
  
  // Upsell baseado em comportamento
  if (client.rechargesPerMonth >= 2) {
    insights.push({
      type: 'upsell',
      title: 'Oportunidade de Upsell',
      description: `Cliente com alta frequência de recargas (${client.rechargesPerMonth}/mês).`,
      action: 'Ofereça plano de telefonia com desconto.',
      product: 'Plano Controle 15GB',
      probability: calculateConversionProbability(client),
      revenue: 49.90
    })
  }
  
  // Alerta de churn
  if (client.balance < 1000 && client.score < 50) {
    insights.push({
      type: 'risk',
      title: 'Risco de Churn',
      description: `Saldo baixo (R$ ${client.balance}) e score em queda.`,
      action: 'Envie dicas de controle de gastos.',
      campaign: 'E-mail educativo',
      goal: 'Aumentar score em 10 pts em 60 dias'
    })
  }
  
  // Potencial de crescimento
  const pointsToNextTier = getPointsToNextTier(client.score)
  if (pointsToNextTier <= 20) {
    insights.push({
      type: 'growth',
      title: 'Potencial de Crescimento',
      description: `Está a ${pointsToNextTier} pontos do próximo tier.`,
      action: 'Incentive melhorias nas métricas.',
      tips: generateScoreImprovementTips(client)
    })
  }
  
  return insights
}
```

##### **Seção 3: Histórico Completo**

```
📊 DADOS HISTÓRICOS

Evolução de Score (últimos 6 meses):
Mai: 28 → Jun: 30 → Jul: 32 → Ago: 31 → Set: 32 → Out: 32
Tendência: Estável (Prata)

Transações:
├─ Total: 110 transações
├─ Média/mês: 13.75
├─ Maior débito: R$ 1.200 (Aluguel - 15/Out)
└─ Maior crédito: R$ 1.850 (Freelance - 05/Set)

Categorias Favoritas:
1. Moradia: 18% dos gastos
2. Alimentação: 15% dos gastos
3. Transporte: 12% dos gastos

Produtos Ativos:
├─ Conta Digital: Ativa desde Mar/2025
├─ Cartão de Crédito: R$ 8.000 (25% utilizado)
└─ Assinaturas: Spotify Premium (R$ 21,90/mês)
```

##### **Seção 4: Botão de Ação**

```
┌─────────────────────────────────────────┐
│  🎯 ADICIONAR A CAMPANHA               │
│                                         │
│  Envie ofertas personalizadas para     │
│  este cliente com base nos insights    │
│                                         │
│        [Selecionar Campanha ▼]         │
└─────────────────────────────────────────┘
```

---

## 🎯 Sistema de Campanhas Inteligentes

### O Coração do ROI do FlowBank

#### 📋 **Criação de Campanhas**

```
Formulário de Nova Campanha:

┌─────────────────────────────────────────┐
│ INFORMAÇÕES BÁSICAS                     │
├─────────────────────────────────────────┤
│ Nome:                                   │
│ [Cartão Platinum Black Friday]         │
│                                         │
│ Descrição:                              │
│ [Cartão premium com cashback 3% e...]  │
│                                         │
│ Produto:                                │
│ [Cartão de Crédito ▼]                  │
│                                         │
│ Período:                                │
│ [01/11/2025] até [30/11/2025]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CRITÉRIOS DE SEGMENTAÇÃO                │
├─────────────────────────────────────────┤
│ Score Mínimo: [70]                      │
│ Categorias de Interesse:                │
│ ☑️ Lazer  ☑️ Alimentação  ☐ Transporte │
│                                         │
│ Frequência Mínima de Recargas: [2/mês] │
│                                         │
│ Renda Estimada Mínima: [R$ 2.500]      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ PREVISÃO DE ALCANCE                     │
├─────────────────────────────────────────┤
│ Clientes Compatíveis: 42 de 100        │
│ Taxa de Conversão Estimada: 24%         │
│ Conversões Esperadas: ~10 clientes      │
│ Receita Estimada: R$ 4.980,00          │
└─────────────────────────────────────────┘
```

**Cálculo em Tempo Real:**

```javascript
function calculateCampaignReach(criteria) {
  const compatibleClients = users.filter(user => {
    // Filtro de score
    if (user.score < criteria.minScore) return false
    
    // Filtro de categorias
    const userCategories = getUserTopCategories(user)
    const categoryMatch = criteria.categories.some(cat => 
      userCategories.includes(cat)
    )
    if (!categoryMatch) return false
    
    // Filtro de recargas
    const rechargesPerMonth = user.recharges / user.monthsActive
    if (rechargesPerMonth < criteria.minRecharges) return false
    
    // Filtro de renda
    const estimatedIncome = estimateIncome(user)
    if (estimatedIncome < criteria.minIncome) return false
    
    return true
  })
  
  return {
    count: compatibleClients.length,
    conversionRate: 0.24, // 24% baseado em histórico
    expectedConversions: Math.round(compatibleClients.length * 0.24),
    estimatedRevenue: Math.round(compatibleClients.length * 0.24 * 498) // R$ 498 valor médio do produto
  }
}
```

---

#### 🎲 **Algoritmo de Compatibilidade**

O **diferencial competitivo** do FlowBank está neste algoritmo proprietário que calcula match entre cliente e campanha.

```javascript
function calculateCompatibilityScore(user, campaign) {
  let compatibility = 0
  
  // 1. SCORE DO CLIENTE (40% do peso)
  const scoreMatch = (user.score / 100) * 40
  compatibility += scoreMatch
  
  // 2. CATEGORIAS DE GASTO (30% do peso)
  const userCategories = getUserTopCategories(user, 3) // Top 3
  const categoryMatches = campaign.categories.filter(cat => 
    userCategories.includes(cat)
  ).length
  const categoryScore = (categoryMatches / campaign.categories.length) * 30
  compatibility += categoryScore
  
  // 3. FREQUÊNCIA DE RECARGAS (20% do peso)
  const rechargesPerMonth = user.recharges / user.monthsActive
  let rechargeScore = 0
  if (rechargesPerMonth >= campaign.minRecharges) {
    const excess = rechargesPerMonth - campaign.minRecharges
    rechargeScore = Math.min(20, 10 + (excess * 2))
  }
  compatibility += rechargeScore
  
  // 4. NÍVEL DE RENDA (10% do peso)
  const estimatedIncome = estimateIncome(user)
  let incomeScore = 0
  if (estimatedIncome >= campaign.minIncome) {
    const ratio = estimatedIncome / campaign.minIncome
    incomeScore = Math.min(10, ratio * 5)
  }
  compatibility += incomeScore
  
  // Normaliza para 0-100
  return Math.min(Math.max(Math.round(compatibility), 0), 100)
}
```

**Exemplo Real:**

```
Campanha: Cartão Platinum
- Score mínimo: 70
- Categorias: Lazer, Alimentação
- Recargas mínimas: 2/mês
- Renda mínima: R$ 2.500

Cliente: João Silva
- Score: 100
- Categorias top 3: Moradia, Lazer, Alimentação
- Recargas: 2.9/mês
- Renda estimada: R$ 3.200

Cálculo:
├─ Score: (100/100) × 40 = 40 pontos
├─ Categorias: (2/2) × 30 = 30 pontos
├─ Recargas: (2.9 ≥ 2) × 20 = 18 pontos
└─ Renda: (3200/2500) × 10 = 12.8 → 10 pontos

Compatibilidade: 40 + 30 + 18 + 10 = 98%
Ação: ENVIAR CAMPANHA (match excelente!)
```

---

#### 📊 **Lista de Prospects (Clientes Compatíveis)**

```
Tabela de Prospects para Campanha:

┌────────────┬────────┬──────────┬──────────────┬─────────────┬────────┐
│ Cliente    │ Score  │ Saldo    │ Categorias   │ Recargas/m  │ Match  │
├────────────┼────────┼──────────┼──────────────┼─────────────┼────────┤
│ João Silva │  100   │ R$ 1.6k  │ Lazer, Alim. │    2.9      │  98%   │
│ Ana Costa  │   78   │ R$ 1.1k  │ Lazer, Trans.│    2.5      │  85%   │
│ Camila R.  │   76   │ R$ 887   │ Alim., Saúde │    2.5      │  78%   │
│ Lucas M.   │   65   │ R$ 456   │ Lazer, Trans.│    1.8      │  62%   │
│ Pedro A.   │   62   │ R$ 134   │ Lazer, Alim. │    1.5      │  58%   │
└────────────┴────────┴──────────┴──────────────┴─────────────┴────────┘

Filtro de Corte: Mostrar apenas match ≥ 50%
Total: 42 prospects de 100 clientes (42%)
```

**Cores de Match:**
```css
90-100%: Verde escuro (Excelente)
70-89%:  Verde claro (Muito Bom)
50-69%:  Amarelo (Bom)
30-49%:  Laranja (Fraco - não mostrar)
0-29%:   Vermelho (Incompatível - não mostrar)
```

---

#### 📧 **Ações da Campanha**

```
Botões de Ação:

[📤 Enviar para Todos (42)]  [📋 Exportar Lista]  [📊 Relatório]

Enviar para Todos:
→ Dispara e-mail/notificação push para os 42 prospects
→ Registra envio no histórico
→ Inicia tracking de conversão

Exportar Lista:
→ Gera CSV com dados dos prospects
→ Campos: Nome, E-mail, CPF, Score, Match
→ Útil para campanhas externas (SMS, WhatsApp)

Relatório:
→ Análise completa da campanha
→ Taxa de abertura, cliques, conversões
→ ROI calculado
```

---

## 📈 Análise de Conversão

### Dashboard de Performance de Campanhas

```
┌─────────────────────────────────────────┐
│ CAMPANHA: Cartão Platinum               │
├─────────────────────────────────────────┤
│ Enviados: 42 clientes                   │
│ Abertos: 34 (81%)                       │
│ Cliques: 18 (43% dos abertos)           │
│ Conversões: 10 (24% dos enviados)       │
│                                         │
│ ROI:                                    │
│ Custo: R$ 420 (R$ 10/lead)             │
│ Receita: R$ 4.980 (10 × R$ 498)        │
│ Lucro: R$ 4.560                        │
│ ROI: 1.086% 🚀                         │
└─────────────────────────────────────────┘
```

**Comparação com Campanhas Tradicionais:**

```
Método Tradicional (Envio em Massa):
├─ Enviados: 100 clientes
├─ Conversões: 5 (5%)
├─ Custo: R$ 1.000
├─ Receita: R$ 2.490
├─ Lucro: R$ 1.490
└─ ROI: 149%

Método FlowBank (Segmentação Inteligente):
├─ Enviados: 42 clientes (58% menos)
├─ Conversões: 10 (24% - 380% mais eficiente!)
├─ Custo: R$ 420 (58% menos)
├─ Receita: R$ 4.980 (100% mais)
├─ Lucro: R$ 4.560 (206% mais)
└─ ROI: 1.086% (628% melhor!)

🎯 Resultado: 3x mais conversões gastando menos da metade
```

---

## 🛡️ Análise de Riscos

### Prevenção Proativa de Inadimplência

```
MATRIZ DE RISCO

Alto Score + Alto Saldo = ✅ CLIENTE IDEAL
├─ 45 clientes (45%)
├─ Risco: Muito Baixo
└─ Ação: Oferecer produtos premium

Alto Score + Baixo Saldo = ⚠️ OPORTUNIDADE
├─ 12 clientes (12%)
├─ Risco: Baixo
└─ Ação: Educar sobre reservas

Baixo Score + Alto Saldo = 🟡 DESENVOLVER
├─ 8 clientes (8%)
├─ Risco: Moderado
└─ Ação: Incentivar uso de produtos

Baixo Score + Baixo Saldo = 🔴 ALTO RISCO
├─ 20 clientes (20%)
├─ Risco: Alto
└─ Ação: Monitoramento intenso

Saldo Negativo = 🚨 CRÍTICO
├─ 15 clientes (15%)
├─ Risco: Muito Alto
└─ Ação: Negociação imediata
```

**Alertas Automáticos:**

```javascript
function generateRiskAlerts() {
  const alerts = []
  
  users.forEach(user => {
    // Alerta de saldo negativo
    if (user.balance < 0) {
      alerts.push({
        priority: 'high',
        client: user.name,
        type: 'Saldo Negativo',
        value: user.balance,
        action: 'Contatar para negociação',
        daysOverdue: calculateDaysOverdue(user)
      })
    }
    
    // Alerta de score em queda
    if (user.scoreHistory && isScoreDecreasing(user)) {
      alerts.push({
        priority: 'medium',
        client: user.name,
        type: 'Score em Queda',
        trend: getScoreTrend(user),
        action: 'Enviar dicas de melhoria'
      })
    }
    
    // Alerta de inatividade
    if (user.lastLogin && daysSinceLogin(user) > 30) {
      alerts.push({
        priority: 'low',
        client: user.name,
        type: 'Cliente Inativo',
        lastSeen: user.lastLogin,
        action: 'Campanha de reengajamento'
      })
    }
  })
  
  return alerts.sort((a, b) => 
    priorityValue(b.priority) - priorityValue(a.priority)
  )
}
```

---

## 📊 Relatórios e Exports

### Business Intelligence

```
Relatórios Disponíveis:

1. Relatório de Clientes
   ├─ Total de clientes por tier
   ├─ Evolução mensal
   ├─ Score médio por segmento
   └─ Export: CSV, PDF

2. Relatório de Campanhas
   ├─ Performance de cada campanha
   ├─ ROI comparativo
   ├─ Funil de conversão
   └─ Export: CSV, PDF

3. Relatório de Riscos
   ├─ Inadimplência por tier
   ├─ Evolução de saldo médio
   ├─ Clientes em risco
   └─ Export: CSV, PDF

4. Relatório Financeiro
   ├─ Receita por produto
   ├─ Custo de aquisição (CAC)
   ├─ Lifetime Value (LTV)
   └─ Export: CSV, Excel
```

---

## 🎯 Principais Vantagens Competitivas do Admin

### 1. **Segmentação com IA**
- Algoritmo proprietário de compatibilidade
- Reduz custos em 58%
- Aumenta conversão em 380%

### 2. **Insights Acionáveis**
- Recomendações personalizadas por cliente
- Identificação automática de oportunidades
- Alertas proativos de risco

### 3. **ROI Mensurável**
- Tracking completo de campanhas
- Comparação com métodos tradicionais
- Justificativa clara de investimentos

### 4. **Prevenção de Inadimplência**
- Matriz de risco em tempo real
- Alertas automáticos
- Ações preventivas sugeridas

### 5. **Visão 360° do Cliente**
- Histórico completo
- Comportamento preditivo
- Perfil de consumo detalhado

---

**Próximo:** [04-ALGORITMOS-SCORE.md](./04-ALGORITMOS-SCORE.md)
