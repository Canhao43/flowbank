import api from './api'

/**
 * Service para gerenciar transações
 * Única fonte de dados - consulta apenas o backend
 */
class TransactionService {
  /**
   * Cria uma nova transação (pagamento, empréstimo, etc)
   * @param {Object} transactionData - Dados da transação
   * @returns {Promise} Resultado da criação
   */
  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData)
    return response.data
  }

  /**
   * Obtém histórico de transações
   * @param {string} userEmail - Email do usuário
   * @param {Object} filters - Filtros opcionais (período, categoria, tipo)
   * @returns {Promise} Lista de transações
   */
  async getTransactions(userEmail, filters = {}) {
    const response = await api.get('/transactions', {
      headers: { 'user-email': userEmail },
      params: filters
    })
    return response.data
  }

  /**
   * Obtém gastos futuros (empréstimos, parcelas, assinaturas)
   * @param {string} userEmail - Email do usuário
   * @param {number} days - Período em dias (padrão 30)
   * @returns {Promise} Lista de gastos futuros
   */
  async getFuturePayments(userEmail, days = 30) {
    const response = await api.get('/transactions/future', {
      headers: { 'user-email': userEmail },
      params: { days }
    })
    return response.data
  }

  /**
   * Simula um empréstimo e retorna detalhes
   * @param {string} userEmail - Email do usuário
   * @param {number} amount - Valor solicitado
   * @param {number} installments - Número de parcelas
   * @returns {Promise} Simulação do empréstimo
   */
  async simulateLoan(userEmail, amount, installments) {
    const response = await api.post('/transactions/simulate-loan', {
      amount,
      installments
    }, {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }

  /**
   * Confirma um empréstimo
   * @param {string} userEmail - Email do usuário
   * @param {Object} loanData - Dados do empréstimo
   * @returns {Promise} Resultado da confirmação
   */
  async confirmLoan(userEmail, loanData) {
    const response = await api.post('/transactions', {
      ...loanData,
      isLoan: true
    }, {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }

  /**
   * Realiza um pagamento (PIX, Boleto, Cartão)
   * @param {string} userEmail - Email do usuário
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise} Resultado do pagamento
   */
  async makePayment(userEmail, paymentData) {
    const response = await api.post('/transactions', paymentData, {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }
}

export default new TransactionService()
