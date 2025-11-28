/**
 * Services Layer - Única interface de comunicação com o backend
 * 
 * Todos os dados devem ser consumidos através destes services.
 * NUNCA calcule dados no frontend - sempre consulte o backend.
 */

import userService from './userService'
import transactionService from './transactionService'

export {
  userService,
  transactionService
}

// Export default para facilitar imports
export default {
  user: userService,
  transaction: transactionService
}
