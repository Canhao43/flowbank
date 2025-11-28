import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import transactionRoutes from './routes/transaction.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/admin', adminRoutes)

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FlowBank API rodando!' })
})

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 FlowBank Backend rodando em http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
