import express from 'express'
import users from '../data/users.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.json({
      success: false,
      message: 'Email ou senha inválidos'
    })
  }

  const token = uuidv4() // Token simples para MVP
  const { password: _, transactions, ...userWithoutSensitiveData } = user

  res.json({
    success: true,
    token,
    user: userWithoutSensitiveData
  })
})

// Verificar autenticação
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autenticado' })
  }

  // Para MVP, retorna o primeiro usuário (em produção validaria o token)
  const { password: _, transactions, ...userWithoutSensitiveData } = users[0]
  
  res.json({
    success: true,
    user: userWithoutSensitiveData
  })
})

export default router
