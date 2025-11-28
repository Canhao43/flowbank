import { v4 as uuidv4 } from 'uuid'

// Gera transações realistas com perfil personalizado
function generateTransactions(userId, profile) {
  const categories = [
    { name: 'Alimentação', icon: 'mdi-food', types: ['Supermercado Extra', 'iFood', 'Restaurante Bom Prato', 'Padaria Central', 'Mercadão'] },
    { name: 'Transporte', icon: 'mdi-bus', types: ['Uber', 'Bilhete Único', 'Posto Shell', 'Aplicativo 99', 'Estacionamento'] },
    { name: 'Moradia', icon: 'mdi-home', types: ['Conta de Luz - Enel', 'Conta de Água - Sabesp', 'Condomínio', 'Internet - Claro'] },
    { name: 'Recarga Celular', icon: 'mdi-cellphone', types: ['Recarga Claro'] },
    { name: 'Lazer', icon: 'mdi-gamepad', types: ['Netflix', 'Spotify Premium', 'Cinema', 'Bar Taguá 326', 'Prime Video'] },
    { name: 'Saúde', icon: 'mdi-hospital', types: ['Farmácia Drogasil', 'Consulta Médica', 'Academia SmartFit'] },
    { name: 'Educação', icon: 'mdi-school', types: ['Curso Udemy', 'Livros Amazon', 'Material Escolar', "Faculdade FMU"] }
  ]

  const incomeTypes = [
    { description: 'Salário', icon: 'mdi-briefcase', category: 'Salário' },
    { description: 'Freelance - Design', icon: 'mdi-laptop', category: 'Freelance' },
    { description: 'Bico - Entrega', icon: 'mdi-motorbike', category: 'Freelance' },
    { description: 'Venda Online', icon: 'mdi-cart', category: 'Vendas' },
    { description: 'Cashback', icon: 'mdi-star', category: 'Cashback' }
  ]

  const transactions = []
  const now = new Date()
  const daysRange = profile.daysRange || 90
  const monthsCount = Math.ceil(daysRange / 30)

  // Gera salário mensal (se tiver)
  if (profile.hasSalary) {
    for (let i = 0; i < monthsCount; i++) {
      const salaryDate = new Date(now)
      salaryDate.setDate(5) // Dia 5 de cada mês
      salaryDate.setMonth(salaryDate.getMonth() - i)
      
      if (salaryDate <= now) {
        transactions.push({
          id: uuidv4(),
          userId,
          description: 'Salário',
          amount: profile.salaryAmount || 2500,
          category: 'Salário',
          icon: 'mdi-briefcase',
          date: salaryDate.toISOString(),
          type: 'credit',
          status: 'completed'
        })
      }
    }
  }

  // Gera receitas de freelance/bicos
  if (profile.freelanceJobs > 0) {
    for (let i = 0; i < profile.freelanceJobs; i++) {
      const daysAgo = Math.floor(Math.random() * daysRange)
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)
      
      const freelanceType = incomeTypes[Math.floor(Math.random() * 3) + 1]
      
      transactions.push({
        id: uuidv4(),
        userId,
        description: freelanceType.description,
        amount: Math.random() * 800 + 200,
        category: freelanceType.category,
        icon: freelanceType.icon,
        date: date.toISOString(),
        type: 'credit',
        status: 'completed'
      })
    }
  }

  // Gera recargas recorrentes
  for (let i = 0; i < profile.recharges; i++) {
    const daysAgo = i * (daysRange / profile.recharges) + Math.random() * 5
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    transactions.push({
      id: uuidv4(),
      userId,
      description: 'Recarga Claro',
      amount: -profile.rechargeValue,
      category: 'Recarga Celular',
      icon: 'mdi-cellphone',
      date: date.toISOString(),
      type: 'debit',
      status: 'completed'
    })
  }

  // Gera contas de moradia (NÃO É ALUGUEL - são contas de consumo)
  const billsTypes = ['Conta de Luz - Enel', 'Conta de Água - Sabesp', 'Internet - Claro', 'Gás - Comgás']
  for (let i = 0; i < profile.bills; i++) {
    const daysAgo = i * (daysRange / profile.bills) + Math.random() * 3
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    transactions.push({
      id: uuidv4(),
      userId,
      description: billsTypes[i % billsTypes.length],
      amount: -(Math.random() * 150 + 80),
      category: 'Moradia',
      icon: 'mdi-home',
      date: date.toISOString(),
      type: 'debit',
      status: 'completed'
    })
  }

  // Gera aluguel mensal (se o perfil indicar que paga aluguel)
  if (profile.paysRent) {
    const rentAmount = profile.rentAmount || (Math.random() * 2000 + 1000) // Entre R$ 1.000 e R$ 3.000
    for (let i = 0; i < monthsCount; i++) {
      const rentDate = new Date(now)
      rentDate.setMonth(rentDate.getMonth() - i)
      rentDate.setDate(5) // Aluguel sempre no dia 5
      
      transactions.push({
        id: uuidv4(),
        userId,
        description: 'Aluguel',
        amount: -rentAmount,
        category: 'Moradia',
        icon: 'mdi-home-city',
        date: rentDate.toISOString(),
        type: 'debit',
        status: 'completed'
      })
    }
  }

  // Gera assinaturas recorrentes mensais (AGORA VEM DO PERFIL - SEM ALEATORIEDADE!)
  if (profile.subscriptions && profile.subscriptions.length > 0) {
    profile.subscriptions.forEach(sub => {
      for (let i = 0; i < monthsCount; i++) {
        const subDate = new Date(now)
        subDate.setMonth(subDate.getMonth() - i)
        subDate.setDate(sub.dueDay || 15) // Dia fixo de cobrança
        
        transactions.push({
          id: uuidv4(),
          userId,
          description: sub.name,
          amount: -sub.amount,
          category: 'Lazer',
          icon: sub.icon,
          date: subDate.toISOString(),
          type: 'debit',
          status: 'completed'
        })
      }
    })
  }

  // Gera outras transações (MAIORIA DÉBITO)
  const remainingCount = profile.totalTransactions - profile.recharges - profile.bills
  for (let i = 0; i < remainingCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const type = category.types[Math.floor(Math.random() * category.types.length)]
    
    const daysAgo = Math.floor(Math.random() * daysRange)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    let amount
    if (category.name === 'Lazer') amount = Math.random() * profile.lazerSpending + 20
    else amount = Math.random() * 120 + 10

    transactions.push({
      id: uuidv4(),
      userId,
      description: type,
      amount: parseFloat((-amount).toFixed(2)),
      category: category.name,
      icon: category.icon,
      date: date.toISOString(),
      type: 'debit',
      status: 'completed'
    })
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Calcula score baseado em comportamento real
function calculateScore(transactions, monthsActive) {
  let score = 0 // Score começa em ZERO

  const recargaCelular = transactions.filter(t => t.category === 'Recarga Celular' && t.type === 'debit')
  const moradia = transactions.filter(t => t.category === 'Moradia' && t.type === 'debit')
  
  // Calcula saldo atual
  const balance = transactions.reduce((sum, t) => sum + t.amount, 0)
  
  // 🏦 SAÚDE DO SALDO (+25 pontos) - FATOR CRÍTICO
  if (balance >= 5000) score += 25       // Excelente reserva
  else if (balance >= 2000) score += 18  // Boa reserva
  else if (balance >= 500) score += 10   // Reserva moderada
  else if (balance >= 0) score += 3      // Positivo mas baixo
  else if (balance >= -1000) score -= 10 // Levemente negativo - PENALIDADE SEVERA
  else if (balance >= -3000) score -= 20 // Negativo moderado - PENALIDADE CRÍTICA
  else score -= 35                       // Muito negativo - PENALIDADE MÁXIMA
  
  // Tempo de conta (+15 pontos max) - REDUZIDO
  score += Math.min(monthsActive * 1, 15)

  // Recorrência de recargas (+25 pontos) - REDUZIDO
  const rechargesPerMonth = recargaCelular.length / monthsActive
  if (rechargesPerMonth >= 4) score += 25      // Excelente
  else if (rechargesPerMonth >= 3) score += 18  // Muito bom
  else if (rechargesPerMonth >= 2) score += 10  // Bom
  else if (rechargesPerMonth >= 1) score += 3   // Fraco

  // Pagamento de contas essenciais (+20 pontos) - REDUZIDO
  const billsPerMonth = moradia.length / monthsActive
  if (billsPerMonth >= 3) score += 20
  else if (billsPerMonth >= 2) score += 10
  else if (billsPerMonth >= 1) score += 3

  // Diversidade de categorias (+8 pontos)
  const uniqueCategories = [...new Set(transactions.map(t => t.category))]
  if (uniqueCategories.length >= 6) score += 8
  else if (uniqueCategories.length >= 5) score += 5
  else if (uniqueCategories.length >= 4) score += 2

  // Volume de transações (+7 pontos)
  const transactionsPerMonth = transactions.length / monthsActive
  if (transactionsPerMonth >= 30) score += 7
  else if (transactionsPerMonth >= 20) score += 4
  else if (transactionsPerMonth >= 10) score += 1

  // Consistência mensal (+5 pontos)
  const monthlyTransactions = {}
  transactions.forEach(t => {
    const monthKey = new Date(t.date).toISOString().slice(0, 7)
    monthlyTransactions[monthKey] = (monthlyTransactions[monthKey] || 0) + 1
  })
  const monthsWithActivity = Object.keys(monthlyTransactions).length
  const consistency = monthsWithActivity / monthsActive
  if (consistency >= 0.95) score += 5
  else if (consistency >= 0.8) score += 3
  else if (consistency >= 0.6) score += 1

  return Math.min(Math.max(score, 15), 100)
}

// ========================================
// GERAÇÃO AUTOMÁTICA DE 100 USUÁRIOS
// ========================================

const firstNames = [
  'Ana', 'Bruno', 'Carlos', 'Daniel', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 
  'Igor', 'Juliana', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Paulo',
  'Rafaela', 'Sergio', 'Tatiana', 'Vitor', 'Amanda', 'Beatriz', 'Camila', 'Diego',
  'Elisa', 'Felipe', 'Giovana', 'Henrique', 'Isabela', 'João', 'Kelly', 'Leonardo',
  'Monica', 'Nathan', 'Patricia', 'Rafael', 'Sandra', 'Thiago', 'Vanessa', 'Wagner',
  'Bianca', 'Caio', 'Daniela', 'Erick', 'Fabiana', 'Gustavo', 'Heloisa', 'Ivan',
  'Jessica', 'Kevin', 'Larissa', 'Marcelo', 'Natalia', 'Oscar', 'Priscila', 'Renato',
  'Sabrina', 'Tiago', 'Vitoria', 'Wesley', 'Alice', 'Bernardo', 'Cecilia', 'Douglas',
  'Emilia', 'Fernando', 'Giulia', 'Hugo', 'Ingrid', 'Jorge', 'Leticia', 'Miguel',
  'Nina', 'Otavio', 'Paula', 'Ricardo', 'Sofia', 'Tulio', 'Valeria', 'Yuri', 'Adriana',
  'Roberto', 'Silvia', 'Alexandre', 'Cristina', 'Rodrigo', 'Denise', 'Marcos', 'Luciana',
  'Andre', 'Claudia', 'Matheus', 'Simone', 'Jose', 'Angela', 'Luiz', 'Roberta', 'Antonio',
  'Carla', 'Francisco', 'Vera', 'Pedro'
]

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
  'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha',
  'Ribeiro', 'Alves', 'Monteiro', 'Mendes', 'Cardoso', 'Reis', 'Barbosa', 'Pinto',
  'Correia', 'Dias', 'Teixeira', 'Castro', 'Lopes', 'Moreira', 'Campos', 'Pereira',
  'Ramos', 'Nunes', 'Freitas', 'Soares', 'Melo', 'Azevedo', 'Cavalcanti', 'Duarte'
]

function generateCPF(index) {
  const num1 = 100 + (index * 7) % 900
  const num2 = 100 + (index * 11) % 900
  const num3 = 100 + (index * 13) % 900
  const num4 = 10 + (index * 3) % 90
  return `${num1}.${num2}.${num3}-${num4}`
}

function generatePhone(index) {
  const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '91', '92', '93']
  const ddd = ddds[index % ddds.length]
  const prefix = 9000 + (index * 47) % 9000
  const suffix = 1000 + (index * 73) % 9000
  return `(${ddd}) 9${String(prefix).padStart(4, '0')}-${String(suffix).padStart(4, '0')}`
}

// Gera 100 usuários automaticamente
export const users = []

// Primeiro, cria os 3 usuários principais para login
users.push({
  id: uuidv4(),
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123',
  type: 'PF',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  balance: 1647.50,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
  createdAt: new Date('2024-05-01').toISOString(),
  monthsActive: 18
})

users.push({
  id: uuidv4(),
  name: 'Maria Santos',
  email: 'maria@email.com',
  password: 'senha123',
  type: 'PF',
  cpf: '987.654.321-00',
  phone: '(11) 91234-5678',
  balance: 623.80,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  createdAt: new Date('2025-03-15').toISOString(),
  monthsActive: 8
})

users.push({
  id: uuidv4(),
  name: 'Carlos Oliveira',
  email: 'carlos@email.com',
  password: 'senha123',
  type: 'PF',
  cpf: '456.789.123-00',
  phone: '(11) 99876-5432',
  balance: 189.20,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  createdAt: new Date('2025-08-20').toISOString(),
  monthsActive: 3
})

// Gera os outros 97 usuários automaticamente
for (let i = 3; i < 100; i++) {
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[Math.floor(i / 2) % lastNames.length]
  const name = `${firstName} ${lastName}`
  const emailName = `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.toLowerCase()}`
  const email = i > 10 ? `${emailName}${i}@email.com` : `${emailName}@email.com`
  
  // Distribuição realista de scores
  const scoreCategory = Math.random()
  let monthsActive, balance, recharges, bills
  
  if (scoreCategory < 0.12) { // 12% - Score DIAMANTE (85-100)
    monthsActive = Math.floor(Math.random() * 12) + 18 // 18-30 meses
    balance = Math.random() * 10000 + 3000 // R$ 3k-13k
    recharges = Math.floor(Math.random() * 30) + 70 // 70-100 recargas
    bills = Math.floor(Math.random() * 20) + 50 // 50-70 contas
  } else if (scoreCategory < 0.28) { // 16% - Score OURO ALTO (70-84)
    monthsActive = Math.floor(Math.random() * 10) + 12 // 12-22 meses
    balance = Math.random() * 5000 + 1500 // R$ 1.5k-6.5k
    recharges = Math.floor(Math.random() * 25) + 50 // 50-75 recargas
    bills = Math.floor(Math.random() * 20) + 35 // 35-55 contas
  } else if (scoreCategory < 0.50) { // 22% - Score OURO (50-69)
    monthsActive = Math.floor(Math.random() * 8) + 8 // 8-16 meses
    balance = Math.random() * 2500 + 600 // R$ 600-3.1k
    recharges = Math.floor(Math.random() * 20) + 35 // 35-55 recargas
    bills = Math.floor(Math.random() * 15) + 25 // 25-40 contas
  } else if (scoreCategory < 0.72) { // 22% - Score PRATA (30-49)
    monthsActive = Math.floor(Math.random() * 6) + 5 // 5-11 meses
    balance = Math.random() * 1200 + 100 // R$ 100-1.3k
    recharges = Math.floor(Math.random() * 20) + 18 // 18-38 recargas
    bills = Math.floor(Math.random() * 12) + 12 // 12-24 contas
  } else if (scoreCategory < 0.88) { // 16% - Score BRONZE (20-29)
    monthsActive = Math.floor(Math.random() * 5) + 3 // 3-8 meses
    balance = Math.random() * 1500 - 500 // -R$ 500 a R$ 1k
    recharges = Math.floor(Math.random() * 15) + 8 // 8-23 recargas
    bills = Math.floor(Math.random() * 10) + 6 // 6-16 contas
  } else { // 12% - Score CRÍTICO (15-19)
    monthsActive = Math.floor(Math.random() * 4) + 1 // 1-5 meses
    balance = Math.random() * 3000 - 2000 // -R$ 2k a R$ 1k
    recharges = Math.floor(Math.random() * 10) + 2 // 2-12 recargas
    bills = Math.floor(Math.random() * 8) + 2 // 2-10 contas
  }
  
  const createdDate = new Date()
  createdDate.setMonth(createdDate.getMonth() - monthsActive)
  
  users.push({
    id: uuidv4(),
    name,
    email,
    password: 'senha123',
    type: 'PF',
    cpf: generateCPF(i),
    phone: generatePhone(i),
    balance: parseFloat(balance.toFixed(2)),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
    createdAt: createdDate.toISOString(),
    monthsActive,
    _profileData: { recharges, bills } // Dados temporários para gerar transações
  })
}

// Adiciona a empresa (PJ) como último usuário
users.push({
  id: uuidv4(),
  name: 'Tech Solutions LTDA',
  email: 'empresa@email.com',
  password: 'senha123',
  type: 'PJ',
  cnpj: '12.345.678/0001-90',
  phone: '(11) 3000-0000',
  balance: 15420.00,
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
  createdAt: new Date('2023-06-01').toISOString()
})

// Gera perfis automaticamente baseado nos dados do usuário
function generateProfileForUser(user) {
  const recharges = user._profileData?.recharges || 20
  const bills = user._profileData?.bills || 15
  const rechargesPerMonth = recharges / user.monthsActive
  const billsPerMonth = bills / user.monthsActive
  
  // Determina se tem salário baseado no saldo e tempo de conta
  const hasSalary = user.balance > 500 || user.monthsActive > 10
  const salaryAmount = hasSalary ? (user.balance / user.monthsActive * 3) + 1500 : 0
  
  return {
    totalTransactions: Math.floor((recharges + bills) * 1.8),
    recharges,
    rechargeValue: 20 + Math.floor(Math.random() * 40),
    bills,
    lazerSpending: Math.floor(Math.random() * 100) + 50,
    hasSalary,
    salaryAmount: parseFloat(salaryAmount.toFixed(2)),
    freelanceJobs: Math.floor(Math.random() * 10),
    daysRange: user.monthsActive * 30,
    paysRent: Math.random() > 0.5,
    rentAmount: Math.random() > 0.5 ? Math.random() * 2000 + 800 : 0,
    subscriptions: generateRandomSubscriptions()
  }
}

function generateRandomSubscriptions() {
  const allSubscriptions = [
    { name: 'Netflix', amount: 55.90, icon: 'mdi-netflix', dueDay: 10 },
    { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 },
    { name: 'Prime Video', amount: 14.90, icon: 'mdi-amazon', dueDay: 15 },
    { name: 'Disney+', amount: 43.90, icon: 'mdi-disney', dueDay: 8 },
    { name: 'YouTube Premium', amount: 28.90, icon: 'mdi-youtube', dueDay: 5 }
  ]
  
  const count = Math.floor(Math.random() * 3) // 0-2 assinaturas
  const subscriptions = []
  
  for (let i = 0; i < count; i++) {
    const randomSub = allSubscriptions[Math.floor(Math.random() * allSubscriptions.length)]
    if (!subscriptions.find(s => s.name === randomSub.name)) {
      subscriptions.push(randomSub)
    }
  }
  
  return subscriptions
}

// Perfis específicos para os 4 usuários principais
const profiles = {
  // === SCORE PERFEITO (95+) - 1 pessoa ===
  
  // Juliana - Cliente PERFEITO (24 meses) - Score ~96
  'Juliana Ferreira': {
    totalTransactions: 550,
    recharges: 100,          // 4.2 recargas/mês - EXCELENTE
    rechargeValue: 50,
    bills: 80,               // 3.3 contas/mês
    lazerSpending: 120,
    hasSalary: true,
    salaryAmount: 4500,
    freelanceJobs: 12,
    daysRange: 720,
    paysRent: true,
    rentAmount: 2800,        // R$ 2.800/mês
    subscriptions: [
      { name: 'Netflix', amount: 55.90, icon: 'mdi-netflix', dueDay: 10 },
      { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 },
      { name: 'Prime Video', amount: 14.90, icon: 'mdi-amazon', dueDay: 15 }
    ]
  },

  // === SCORE ALTO (75-85) - 3 pessoas ===
  
  // João - Cliente BOM (18 meses) - Score ~82
  'João Silva': {
    totalTransactions: 280,
    recharges: 52,           // 2.9 recargas/mês
    rechargeValue: 30,
    bills: 54,               // 3 contas/mês
    lazerSpending: 150,
    hasSalary: true,
    salaryAmount: 3200,
    freelanceJobs: 8,
    daysRange: 540,
    paysRent: true,
    rentAmount: 1800,        // R$ 1.800/mês
    subscriptions: [
      { name: 'Netflix', amount: 55.90, icon: 'mdi-netflix', dueDay: 10 },
      { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 }
    ]
  },

  // === SCORE PERFEITO (95+) - 1 pessoa ===
  
  // Juliana - Cliente PERFEITO (24 meses) - Score ~96
  'Juliana Ferreira': {
    totalTransactions: 550,
    recharges: 100,          // 4.2 recargas/mês - EXCELENTE
    rechargeValue: 50,
    bills: 80,               // 3.3 contas/mês
    lazerSpending: 120,
    hasSalary: true,
    salaryAmount: 4500,
    freelanceJobs: 12,
    daysRange: 720,
    paysRent: true,
    rentAmount: 2800,        // R$ 2.800/mês
    subscriptions: [
      { name: 'Netflix', amount: 55.90, icon: 'mdi-netflix', dueDay: 10 },
      { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 },
      { name: 'Prime Video', amount: 14.90, icon: 'mdi-amazon', dueDay: 15 }
    ]
  },

  // João - Cliente BOM (18 meses) - Score ~82
  'João Silva': {
    totalTransactions: 280,
    recharges: 52,           // 2.9 recargas/mês
    rechargeValue: 30,
    bills: 54,               // 3 contas/mês
    lazerSpending: 150,
    hasSalary: true,
    salaryAmount: 3200,
    freelanceJobs: 8,
    daysRange: 540,
    paysRent: true,
    rentAmount: 1800,
    subscriptions: [
      { name: 'Netflix', amount: 55.90, icon: 'mdi-netflix', dueDay: 10 },
      { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 }
    ]
  },

  // Maria - Cliente MÉDIO (8 meses) - Score ~68
  'Maria Santos': {
    totalTransactions: 110,
    recharges: 18,
    rechargeValue: 20,
    bills: 20,
    lazerSpending: 90,
    hasSalary: false,
    freelanceJobs: 15,
    daysRange: 240,
    paysRent: true,
    rentAmount: 1200,
    subscriptions: [
      { name: 'Spotify Premium', amount: 21.90, icon: 'mdi-spotify', dueDay: 12 }
    ]
  },

  // Carlos - Cliente INICIANTE (3 meses) - Score ~45
  'Carlos Oliveira': {
    totalTransactions: 32,
    recharges: 4,
    rechargeValue: 15,
    bills: 6,
    lazerSpending: 60,
    hasSalary: false,
    freelanceJobs: 5,
    daysRange: 90,
    subscriptions: []
  }
}

// Gera transações para cada usuário baseado no perfil
users.forEach(user => {
  if (user.type === 'PF') {
    // Usa perfil específico se existir, senão gera automaticamente
    const profile = profiles[user.name] || generateProfileForUser(user)
    
    user.transactions = generateTransactions(user.id, profile)
    user.subscriptions = profile.subscriptions || []
    const calculatedScore = calculateScore(user.transactions, user.monthsActive)
    user.score = calculatedScore
    
    // Calcula limite de crédito baseado no score
    if (calculatedScore >= 80) user.creditLimit = 50000        // Diamante
    else if (calculatedScore >= 50) user.creditLimit = 20000   // Ouro
    else if (calculatedScore >= 30) user.creditLimit = 8000    // Prata
    else user.creditLimit = 3000                                // Bronze
    
    user.futurePayments = []
    user.activeLoans = []
    
    // Remove dados temporários
    delete user._profileData
    
    console.log(`✅ ${user.name}: Score ${calculatedScore} | Limite R$ ${user.creditLimit.toLocaleString('pt-BR')}`)
  } else {
    // PJ não tem transações individuais
    user.transactions = []
    user.score = 0
    user.creditLimit = 0
    user.futurePayments = []
    user.activeLoans = []
  }
})

export default users
