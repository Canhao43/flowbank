// Script para gerar 100 usuários automaticamente
import { v4 as uuidv4 } from 'uuid'

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
  'Nina', 'Otavio', 'Paula', 'Ricardo', 'Sofia', 'Tulio', 'Valeria', 'Yuri'
]

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
  'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha',
  'Ribeiro', 'Alves', 'Monteiro', 'Mendes', 'Cardoso', 'Reis', 'Barbosa', 'Pinto',
  'Correia', 'Dias', 'Teixeira', 'Castro', 'Lopes', 'Moreira', 'Campos', 'Pereira'
]

function generateCPF() {
  const num1 = Math.floor(Math.random() * 900) + 100
  const num2 = Math.floor(Math.random() * 900) + 100
  const num3 = Math.floor(Math.random() * 900) + 100
  const num4 = Math.floor(Math.random() * 90) + 10
  return `${num1}.${num2}.${num3}-${num4}`
}

function generatePhone() {
  const ddd = Math.random() > 0.7 ? '11' : ['21', '31', '41', '51', '61', '71', '81', '85'][Math.floor(Math.random() * 8)]
  const prefix = Math.floor(Math.random() * 9000) + 1000
  const suffix = Math.floor(Math.random() * 9000) + 1000
  return `(${ddd}) 9${prefix}-${suffix}`
}

export function generateUsers(count = 100) {
  const users = []
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 0 ? i : ''}@email.com`
    
    // Distribuição de scores realista
    const scoreCategory = Math.random()
    let monthsActive, balance, recharges, bills, hasSalary, salaryAmount
    
    if (scoreCategory < 0.15) { // 15% - Score MUITO ALTO (80-100)
      monthsActive = Math.floor(Math.random() * 12) + 18 // 18-30 meses
      balance = Math.random() * 8000 + 2000 // R$ 2k-10k
      recharges = Math.floor(Math.random() * 20) + 60 // 60-80 recargas
      bills = Math.floor(Math.random() * 15) + 50 // 50-65 contas
      hasSalary = true
      salaryAmount = Math.random() * 3000 + 3000 // R$ 3k-6k
    } else if (scoreCategory < 0.35) { // 20% - Score ALTO (65-79)
      monthsActive = Math.floor(Math.random() * 10) + 10 // 10-20 meses
      balance = Math.random() * 3000 + 800 // R$ 800-3.8k
      recharges = Math.floor(Math.random() * 20) + 40 // 40-60 recargas
      bills = Math.floor(Math.random() * 15) + 30 // 30-45 contas
      hasSalary = Math.random() > 0.3
      salaryAmount = Math.random() * 2500 + 2200 // R$ 2.2k-4.7k
    } else if (scoreCategory < 0.60) { // 25% - Score MÉDIO (50-64)
      monthsActive = Math.floor(Math.random() * 8) + 6 // 6-14 meses
      balance = Math.random() * 1500 + 200 // R$ 200-1.7k
      recharges = Math.floor(Math.random() * 20) + 20 // 20-40 recargas
      bills = Math.floor(Math.random() * 15) + 15 // 15-30 contas
      hasSalary = Math.random() > 0.4
      salaryAmount = Math.random() * 1800 + 1500 // R$ 1.5k-3.3k
    } else if (scoreCategory < 0.80) { // 20% - Score BAIXO (35-49)
      monthsActive = Math.floor(Math.random() * 6) + 3 // 3-9 meses
      balance = Math.random() * 800 - 200 // -R$ 200 a R$ 600
      recharges = Math.floor(Math.random() * 15) + 10 // 10-25 recargas
      bills = Math.floor(Math.random() * 10) + 8 // 8-18 contas
      hasSalary = Math.random() > 0.6
      salaryAmount = Math.random() * 1500 + 1300 // R$ 1.3k-2.8k
    } else { // 20% - Score MUITO BAIXO (15-34)
      monthsActive = Math.floor(Math.random() * 4) + 1 // 1-5 meses
      balance = Math.random() * 2000 - 1500 // -R$ 1.5k a R$ 500
      recharges = Math.floor(Math.random() * 10) + 2 // 2-12 recargas
      bills = Math.floor(Math.random() * 8) + 2 // 2-10 contas
      hasSalary = Math.random() > 0.7
      salaryAmount = Math.random() * 1000 + 1320 // R$ 1.320k-2.320k (salário mínimo)
    }
    
    const createdDate = new Date()
    createdDate.setMonth(createdDate.getMonth() - monthsActive)
    
    const user = {
      id: uuidv4(),
      name,
      email,
      password: 'senha123',
      type: 'PF',
      cpf: generateCPF(),
      phone: generatePhone(),
      balance: parseFloat(balance.toFixed(2)),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
      createdAt: createdDate.toISOString(),
      monthsActive,
      profile: {
        totalTransactions: Math.floor((recharges + bills) * 1.5),
        recharges,
        rechargeValue: 20 + Math.floor(Math.random() * 40), // R$ 20-60
        bills,
        lazerSpending: Math.floor(Math.random() * 30) + 10,
        hasSalary,
        salaryAmount: hasSalary ? salaryAmount : 0,
        freelanceJobs: Math.floor(Math.random() * 8),
        daysRange: monthsActive * 30,
        paysRent: Math.random() > 0.5,
        rentAmount: Math.random() > 0.5 ? Math.random() * 2000 + 800 : 0
      }
    }
    
    users.push(user)
  }
  
  return users
}
