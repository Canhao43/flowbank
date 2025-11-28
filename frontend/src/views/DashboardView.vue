<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none" />
      
      <v-app-bar-title class="d-flex align-center">
        <v-icon color="primary" :size="$vuetify.display.xs ? 24 : 32" class="mr-2">mdi-wave</v-icon>
        <span class="text-primary font-weight-bold" :class="$vuetify.display.xs ? 'text-body-1' : ''">FlowBank</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn icon="mdi-bell-outline" variant="text" />
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" class="ml-2">
            <v-avatar size="36" class="mr-2">
              <v-img :src="user?.avatar" />
            </v-avatar>
            <span class="d-none d-sm-inline">{{ user?.name }}</span>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.lgAndUp" :temporary="$vuetify.display.mdAndDown" color="background">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/dashboard"
          active-class="text-primary bg-red-lighten-5"
          @click="$vuetify.display.mdAndDown ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-receipt-text"
          title="Extrato"
          value="extrato"
          to="/extrato"
          active-class="text-primary bg-red-lighten-5"
          @click="$vuetify.display.mdAndDown ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-cash-multiple"
          title="Pagamentos"
          value="pagamentos"
          to="/pagamentos"
          active-class="text-primary bg-red-lighten-5"
          @click="$vuetify.display.mdAndDown ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-cash-multiple"
          title="Empréstimo"
          value="emprestimo"
          to="/emprestimo"
          active-class="text-primary bg-red-lighten-5"
          @click="$vuetify.display.mdAndDown ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-gift"
          title="Benefícios"
          value="beneficios"
          to="/beneficios"
          active-class="text-primary bg-red-lighten-5"
          @click="$vuetify.display.mdAndDown ? drawer = false : null"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <!-- Alert de Desconexão -->
        <v-alert
          v-if="dashboardData?.alert"
          :type="dashboardData.alert.type === 'disconnection_risk' ? 'warning' : 'info'"
          variant="tonal"
          closable
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon>{{ dashboardData.alert.icon }}</v-icon>
          </template>
          <v-alert-title>{{ dashboardData.alert.title }}</v-alert-title>
          <div>{{ dashboardData.alert.message }}</div>
          <template v-slot:append>
            <v-btn
              color="warning"
              variant="elevated"
              size="small"
              @click="$router.push('/emprestimo')"
            >
              {{ dashboardData.alert.action }}
            </v-btn>
          </template>
        </v-alert>

        <!-- Header -->
        <v-row class="mb-2">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold">
              Olá, {{ user?.name?.split(' ')[0] }}! 👋
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              {{ getCurrentGreeting() }}
            </p>
          </v-col>
        </v-row>

        <!-- Cards Principais -->
        <v-row>
          <!-- Card de Saldo e Resumo -->
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="2" height="100%">
              <div class="d-flex justify-space-between align-center mb-3">
                <div>
                  <p class="text-grey-darken-2 text-body-2 mb-1">Saldo disponível</p>
                  <h2 class="text-h3 font-weight-bold text-grey-darken-4">
                    {{ showBalance ? formatCurrency(dashboardData?.balance || 0) : 'R$ •••••' }}
                  </h2>
                </div>
                <v-btn
                  :icon="showBalance ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  variant="text"
                  color="grey-darken-2"
                  size="large"
                  @click="toggleBalance"
                />
              </div>

              <v-divider class="my-4" />

              <!-- Resumo Mensal Inline -->
              <v-row dense>
                <v-col cols="6">
                  <div class="pa-3 rounded" style="background: rgba(76, 175, 80, 0.15); border-left: 4px solid #4CAF50;">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="success" size="20" class="mr-2">mdi-arrow-down-circle</v-icon>
                      <span class="text-caption font-weight-medium text-grey-darken-2">Entradas</span>
                    </div>
                    <div class="text-h6 font-weight-bold text-success">
                      {{ showBalance ? formatCurrency(dashboardData?.income || 0) : 'R$ •••••' }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="pa-3 rounded" style="background: rgba(244, 67, 54, 0.15); border-left: 4px solid #F44336;">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="error" size="20" class="mr-2">mdi-arrow-up-circle</v-icon>
                      <span class="text-caption font-weight-medium text-grey-darken-2">Saídas</span>
                    </div>
                    <div class="text-h6 font-weight-bold text-error">
                      {{ showBalance ? formatCurrency(dashboardData?.expenses || 0) : 'R$ •••••' }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- Score de Saúde Financeira -->
          <v-col cols="12" md="3">
            <v-card class="pa-6 h-100" elevation="2">
              <div class="text-center">
                <h3 class="text-subtitle-1 font-weight-bold mb-3">Score de Saúde</h3>
                <v-progress-circular
                  :model-value="dashboardData?.score || 0"
                  :color="getScoreColor(dashboardData?.score || 0)"
                  size="140"
                  width="14"
                >
                  <div class="text-center">
                    <div class="text-h3 font-weight-bold">
                      {{ dashboardData?.score || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      pontos
                    </div>
                  </div>
                </v-progress-circular>
                <p class="text-caption text-medium-emphasis mt-3 px-2">
                  {{ getScoreMessage(dashboardData?.score || 0) }}
                </p>
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="showScoreDetails = true"
                >
                  Como funciona?
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Crédito Disponível -->
          <v-col cols="12" md="3">
            <v-card class="pa-6 h-100" elevation="2" color="success-lighten-5">
              <div class="text-center">
                <v-icon size="48" color="success" class="mb-2">mdi-cash-multiple</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Crédito Disponível</h3>
                <h2 class="text-h4 font-weight-bold text-success mb-2">
                  {{ showBalance ? formatCurrency(dashboardData?.creditLimit || 0) : 'R$ •••••' }}
                </h2>
                <p class="text-caption text-medium-emphasis mb-3">
                  Baseado no seu score
                </p>
                <v-btn
                  color="success"
                  variant="flat"
                  block
                  @click="$router.push('/emprestimo')"
                >
                  Simular Empréstimo
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Gastos por Categoria e Transações Recentes -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card elevation="2" class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
                Gastos por Categoria
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-0">
                <v-list v-if="dashboardData?.categories?.length">
                  <v-list-item
                    v-for="category in dashboardData.categories.slice(0, 5)"
                    :key="category.name"
                    class="px-4 py-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getCategoryColor(category.name)" size="40">
                        <v-icon color="white" size="20">{{ category.icon }}</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">{{ category.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ category.count }} transações • {{ category.percentage }}%
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="font-weight-bold">
                        {{ showBalance ? formatCurrency(category.total) : 'R$ •••' }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2">mdi-chart-box-outline</v-icon>
                  <p class="text-body-2 text-medium-emphasis mt-2">
                    Nenhum gasto registrado este mês
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card elevation="2" class="h-100">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                  Transações Recentes
                </div>
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  @click="$router.push('/extrato')"
                >
                  Ver todas
                </v-btn>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-0">
                <v-list v-if="dashboardData?.recentTransactions?.length">
                  <v-list-item
                    v-for="transaction in dashboardData.recentTransactions.slice(0, 5)"
                    :key="transaction.id"
                    class="px-4 py-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="transaction.type === 'credit' ? 'success' : 'grey-lighten-2'" size="40">
                        <v-icon :color="transaction.type === 'credit' ? 'white' : 'grey-darken-2'" size="20">
                          {{ transaction.icon }}
                        </v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">{{ transaction.description }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ formatDate(transaction.date) }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div :class="transaction.type === 'credit' ? 'text-success' : 'text-error'" class="font-weight-bold">
                        {{ showBalance ? (transaction.type === 'credit' ? '+' : '-') + formatCurrency(Math.abs(transaction.amount)) : 'R$ •••' }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2">mdi-history</v-icon>
                  <p class="text-body-2 text-medium-emphasis mt-2">
                    Nenhuma transação recente
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Dialog de Detalhes do Score -->
    <v-dialog v-model="showScoreDetails" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center pa-6" style="background: linear-gradient(135deg, #E30613 0%, #B8050F 100%);">
          <v-icon size="32" class="mr-3" color="white">mdi-information-outline</v-icon>
          <div>
            <div class="text-h5 font-weight-bold text-white">Como funciona o Score?</div>
            <div class="text-caption text-white opacity-90">Entenda como calculamos sua pontuação</div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-6 text-medium-emphasis">
            Seu <strong>Score de Saúde Financeira</strong> é calculado com base em 4 pilares fundamentais:
          </p>
          
          <v-row>
            <v-col cols="12" sm="6" v-for="(item, index) in scoreFactors" :key="index">
              <v-card variant="tonal" :color="item.color" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-avatar :color="item.color" size="48" class="mr-3">
                    <v-icon color="white" size="24">{{ item.icon }}</v-icon>
                  </v-avatar>
                  <div class="text-subtitle-2 font-weight-bold">{{ item.title }}</div>
                </div>
                <p class="text-caption text-medium-emphasis mb-0">{{ item.description }}</p>
              </v-card>
            </v-col>
          </v-row>

          <v-alert 
            type="info" 
            variant="tonal" 
            color="red"
            class="mt-6"
            prominent
          >
            <template v-slot:prepend>
              <v-icon size="32">mdi-trophy</v-icon>
            </template>
            <div class="text-subtitle-2 font-weight-bold mb-1">Dica importante!</div>
            <div class="text-body-2">
              Quanto <strong>maior seu score</strong>, maior será seu <strong>limite de crédito disponível</strong> e melhores benefícios você desbloqueia!
            </div>
          </v-alert>
        </v-card-text>
        
        <v-divider />
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn 
            color="red" 
            variant="flat"
            size="large"
            @click="showScoreDetails = false"
          >
            Entendi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onActivated, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services'

const router = useRouter()
const authStore = useAuthStore()

const drawer = ref(true)
const dashboardData = ref(null)
const showScoreDetails = ref(false)
const loading = ref(true)
const showBalance = ref(true)

const user = computed(() => authStore.user)

const scoreFactors = [
  {
    icon: 'mdi-wallet',
    title: 'Saúde do Saldo',
    description: 'Mantenha seu saldo positivo e com reservas',
    color: 'primary'
  },
  {
    icon: 'mdi-calendar-check',
    title: 'Recorrência de Pagamentos',
    description: 'Pague suas contas essenciais regularmente',
    color: 'blue'
  },
  {
    icon: 'mdi-clock-check',
    title: 'Pontualidade',
    description: 'Mantenha suas recargas e contas em dia',
    color: 'green'
  },
  {
    icon: 'mdi-chart-line',
    title: 'Consistência Mensal',
    description: 'Mantenha um padrão constante de uso',
    color: 'purple'
  }
]

const loadDashboardData = async () => {
  loading.value = true
  try {
    const response = await userService.getDashboardData(authStore.user.email)
    
    if (response.success) {
      dashboardData.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboardData()
})

// Atualiza dados sempre que voltar para a tela
onActivated(async () => {
  await loadDashboardData()
})

function getCurrentGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia! Como vão suas finanças hoje?'
  if (hour < 18) return 'Boa tarde! Vamos gerenciar seu dinheiro?'
  return 'Boa noite! Confira seus gastos de hoje!'
}

function getScoreColor(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}

function getScoreMessage(score) {
  if (score >= 80) return 'Excelente! Você é um ótimo gestor financeiro 🎉'
  if (score >= 60) return 'Bom! Continue melhorando seus hábitos 👍'
  return 'Em construção! Vamos melhorar juntos 💪'
}

function getCategoryColor(category) {
  const colors = {
    'Alimentação': '#FF6B6B',
    'Transporte': '#4ECDC4',
    'Moradia': '#45B7D1',
    'Recarga Celular': '#E30613',
    'Lazer': '#A29BFE',
    'Saúde': '#00B894',
    'Educação': '#FDCB6E'
  }
  return colors[category] || '#95A5A6'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function toggleBalance() {
  showBalance.value = !showBalance.value
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(to right, #858e96, #60696b);
}

.opacity-90 {
  opacity: 0.9;
}
</style>
