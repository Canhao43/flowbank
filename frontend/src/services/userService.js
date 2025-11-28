import api from './api'

/**
 * Service para gerenciar dados do usuário
 * Única fonte de dados - consulta apenas o backend
 */
class UserService {
  /**
   * Obtém dados completos do dashboard do usuário
   * @param {string} userEmail - Email do usuário
   * @returns {Promise} Dados do dashboard
   */
  async getDashboardData(userEmail) {
    const response = await api.get('/user/dashboard', {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }

  /**
   * Obtém extrato completo com transações e insights
   * @param {string} userEmail - Email do usuário
   * @returns {Promise} Dados do extrato
   */
  async getExtrato(userEmail) {
    const response = await api.get('/transactions/extrato', {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }

  /**
   * Obtém perfil completo do usuário
   * @param {string} userEmail - Email do usuário
   * @returns {Promise} Perfil do usuário
   */
  async getUserProfile(userEmail) {
    const response = await api.get('/user/profile', {
      headers: { 'user-email': userEmail }
    })
    return response.data
  }

  /**
   * Obtém lista de usuários (admin)
   * @returns {Promise} Lista de usuários
   */
  async getAllUsers() {
    const response = await api.get('/admin/users')
    return response.data
  }

  /**
   * Atualiza score de um usuário (admin)
   * @param {string} userEmail - Email do usuário
   * @param {number} newScore - Novo score
   * @returns {Promise} Resultado da atualização
   */
  async updateUserScore(userEmail, newScore) {
    const response = await api.post('/admin/update-score', {
      email: userEmail,
      score: newScore
    })
    return response.data
  }
}

export default new UserService()
