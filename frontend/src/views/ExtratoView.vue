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
              <v-img :src="authStore.user?.avatar" />
            </v-avatar>
            <span class="d-none d-sm-inline">{{ authStore.user?.name }}</span>
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
          prepend-icon="mdi-hand-coin"
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
      <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            <v-icon color="primary" size="32" class="mr-2">mdi-receipt-text</v-icon>
            Extrato Inteligente
          </h1>
          <p class="text-subtitle-1 text-grey">Análise completa dos seus gastos com insights personalizados</p>
        </div>

    <v-row>
      <!-- Coluna Principal - Transações -->
      <v-col cols="12" md="8">
        <!-- Filtros -->
        <v-card class="mb-4">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filterPeriod"
                  :items="periodOptions"
                  label="Período"
                  dense
                  outlined
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filterCategory"
                  :items="categoryOptions"
                  label="Categoria"
                  dense
                  outlined
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filterType"
                  :items="typeOptions"
                  label="Tipo"
                  dense
                  outlined
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Gráfico de Evolução de Gastos -->
        <v-card class="mb-4" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
            Evolução de Gastos
          </v-card-title>
          <v-card-text>
            <canvas ref="chartCanvas" height="80"></canvas>
          </v-card-text>
        </v-card>

        <!-- Gastos Futuros -->
        <v-card v-if="filteredFuturePayments.length > 0" elevation="2" class="mb-4">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-calendar-clock</v-icon>
              Gastos Futuros
            </div>
            <v-select
              v-model="futurePeriodFilter"
              :items="futurePeriodOptions"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
          </v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="payment in filteredFuturePayments"
                :key="payment.id"
                class="border-l-4 border-l-warning my-1"
              >
                <template v-slot:prepend>
                  <v-avatar :color="payment.type === 'subscription' ? 'purple' : 'orange'" class="mr-3">
                    <v-icon color="white">{{ payment.icon }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ payment.description }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :color="payment.type === 'subscription' ? 'purple' : payment.paymentType === 'loan' ? 'orange' : 'blue'"
                    size="small"
                    class="mr-2"
                  >
                    {{ payment.type === 'subscription' ? 'Assinatura' : payment.paymentType === 'loan' ? 'Empréstimo' : 'Cartão' }}
                  </v-chip>
                  Vencimento: {{ formatDate(payment.dueDate) }}
                  <span v-if="payment.installment">
                    • Parcela {{ payment.installment }}/{{ payment.totalInstallments }}
                  </span>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="text-right">
                    <div class="text-h6 text-error font-weight-bold">
                      {{ formatCurrency(payment.amount) }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <!-- Resumo de Gastos Futuros -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between px-4">
              <div class="text-body-1 font-weight-medium">Total Projetado ({{ futurePeriodOptions.find(o => o.value === futurePeriodFilter)?.title }})</div>
              <div class="text-h6 text-error font-weight-bold">
                {{ formatCurrency(filteredFuturePayments.reduce((sum, p) => sum + p.amount, 0)) }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Lista de Transações por Mês (Accordion) -->
        <div v-if="!loading">
          <v-expansion-panels v-model="expandedMonth" variant="accordion">
            <v-expansion-panel
              v-for="(month, key) in sortedMonths"
              :key="key"
              :value="key"
              elevation="2"
              class="mb-3"
            >
              <v-expansion-panel-title class="pa-4">
                <div class="d-flex justify-space-between align-center w-100">
                  <div class="d-flex align-center">
                    <v-icon class="mr-3" color="primary" size="large">mdi-calendar-month</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">{{ formatMonth(key) }}</div>
                      <div class="text-caption text-grey">{{ month.transactions.length }} transações</div>
                    </div>
                  </div>
                  <div class="text-right mr-8">
                    <div class="text-body-2 text-success mb-1">
                      <v-icon size="small" color="success">mdi-arrow-down-circle</v-icon>
                      {{ formatCurrency(month.income) }}
                    </div>
                    <div class="text-body-2 text-error">
                      <v-icon size="small" color="error">mdi-arrow-up-circle</v-icon>
                      {{ formatCurrency(month.expenses) }}
                    </div>
                  </div>
                </div>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text>
                <v-list lines="two" class="py-0">
                  <v-list-item
                    v-for="transaction in month.transactions"
                    :key="transaction.id"
                    :class="transaction.type === 'debit' ? 'border-l-error' : 'border-l-success'"
                    class="border-l-4 my-1"
                  >
                    <template v-slot:prepend>
                      <v-avatar 
                        :color="transaction.type === 'debit' ? 'error' : 'success'" 
                        size="48"
                        class="elevation-2"
                      >
                        <v-icon color="white" size="24">{{ transaction.icon }}</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold text-body-1">
                      {{ transaction.description }}
                    </v-list-item-title>
                    
                    <v-list-item-subtitle class="mt-1">
                      <v-chip size="small" class="mr-2" variant="tonal" :color="getCategoryColor(transaction.category)">
                        <v-icon start size="small">{{ transaction.icon }}</v-icon>
                        {{ transaction.category }}
                      </v-chip>
                      <span class="text-grey">{{ formatDate(transaction.date) }}</span>
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="text-right">
                        <div 
                          class="text-h6 font-weight-bold mb-1"
                          :class="transaction.type === 'debit' ? 'text-error' : 'text-success'"
                        >
                          {{ transaction.type === 'debit' ? '-' : '+' }}
                          {{ formatCurrency(Math.abs(transaction.amount)) }}
                        </div>
                        <v-chip 
                          size="x-small" 
                          :color="transaction.status === 'completed' ? 'success' : 'warning'"
                          variant="flat"
                        >
                          {{ transaction.status === 'completed' ? 'Concluído' : 'Pendente' }}
                        </v-chip>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <div v-else class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>
      </v-col>

      <!-- Coluna Lateral - Insights e Análises -->
      <v-col cols="12" md="4">
        <!-- Gráfico de Categorias -->
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon class="mr-2" color="primary">mdi-chart-donut</v-icon>
            Gastos por Categoria
          </v-card-title>
          <v-card-text>
            <div v-for="(cat, index) in topCategories" :key="index" class="mb-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2 font-weight-medium">{{ cat.name }}</span>
                <span class="text-body-2 font-weight-bold">{{ formatCurrency(cat.total) }}</span>
              </div>
              <v-progress-linear
                :model-value="cat.percentage"
                :color="getCategoryColor(cat.name)"
                height="10"
                rounded
                class="mb-1"
              />
              <div class="text-caption text-grey">{{ cat.percentage.toFixed(1) }}% do total</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Insights Inteligentes -->
        <v-card v-if="insights.length > 0" class="mb-4" elevation="2">
          <v-card-title>
            <v-icon class="mr-2" color="primary">mdi-lightbulb-on</v-icon>
            Insights para você
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(insight, index) in insights"
              :key="index"
              :prepend-icon="getInsightIcon(insight.type)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                {{ insight.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap mt-1">
                {{ insight.message }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Resumo Mensal -->
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2" color="primary">mdi-calculator</v-icon>
            Resumo do Período
          </v-card-title>
          <v-card-text>
            <div class="mb-4 pa-3 rounded" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
              <div class="text-caption text-grey-darken-1 mb-1">Total de Entradas</div>
              <div class="text-h5 text-success font-weight-bold">
                + {{ formatCurrency(totalIncome) }}
              </div>
            </div>
            <div class="mb-4 pa-3 rounded" style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);">
              <div class="text-caption text-grey-darken-1 mb-1">Total de Saídas</div>
              <div class="text-h5 text-error font-weight-bold">
                - {{ formatCurrency(totalExpenses) }}
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="pa-3 rounded" :style="balance >= 0 ? 'background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);' : 'background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);'">
              <div class="text-caption text-grey-darken-1 mb-1">Saldo do Período</div>
              <div 
                class="text-h5 font-weight-bold"
                :class="balance >= 0 ? 'text-success' : 'text-error'"
              >
                {{ balance >= 0 ? '+' : '-' }} {{ formatCurrency(Math.abs(balance)) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { userService } from '@/services'

const authStore = useAuthStore()
const router = useRouter()

const drawer = ref(true)
const loading = ref(true)
const extratoData = ref(null)
const futurePayments = ref([])
const futurePeriodFilter = ref(30) // Padrão 30 dias
const filterPeriod = ref('all')
const filterCategory = ref(null)
const filterType = ref(null)
const expandedMonth = ref(null)
const chartCanvas = ref(null)
let chartInstance = null

const futurePeriodOptions = [
  { title: 'Próximos 30 dias', value: 30 },
  { title: 'Próximos 60 dias', value: 60 },
  { title: 'Próximos 90 dias', value: 90 },
  { title: 'Próximos 6 meses', value: 180 },
  { title: 'Próximo ano', value: 365 }
]

const periodOptions = [
  { title: 'Todos os períodos', value: 'all' },
  { title: 'Últimos 30 dias', value: '30' },
  { title: 'Últimos 60 dias', value: '60' },
  { title: 'Últimos 90 dias', value: '90' }
]

// Categorias dinâmicas - apenas as que existem no extrato
const categoryOptions = computed(() => {
  if (!extratoData.value) return []
  
  const categories = new Set()
  
  Object.values(extratoData.value.byMonth).forEach(monthData => {
    monthData.transactions.forEach(transaction => {
      if (transaction.category) {
        categories.add(transaction.category)
      }
    })
  })
  
  return Array.from(categories).sort()
})

const typeOptions = [
  { title: 'Entradas', value: 'credit' },
  { title: 'Saídas', value: 'debit' }
]

// Função para formatar moeda no padrão brasileiro
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Filtra gastos futuros baseado no período selecionado
const filteredFuturePayments = computed(() => {
  if (!futurePayments.value.length) return []
  
  const now = new Date()
  const cutoffDate = new Date(now.getTime() + futurePeriodFilter.value * 24 * 60 * 60 * 1000)
  
  return futurePayments.value
    .filter(payment => {
      const dueDate = new Date(payment.dueDate)
      return dueDate >= now && dueDate <= cutoffDate
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
})

const filteredByMonth = computed(() => {
  if (!extratoData.value) return {}
  
  const now = new Date()
  const cutoffDate = filterPeriod.value === 'all' 
    ? new Date(0) 
    : new Date(now.getTime() - parseInt(filterPeriod.value) * 24 * 60 * 60 * 1000)
  
  const filtered = {}
  
  Object.entries(extratoData.value.byMonth).forEach(([monthKey, monthData]) => {
    const filteredTransactions = monthData.transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const matchesPeriod = transactionDate >= cutoffDate
      const matchesCategory = !filterCategory.value || t.category === filterCategory.value
      const matchesType = !filterType.value || t.type === filterType.value
      
      return matchesPeriod && matchesCategory && matchesType
    })
    
    if (filteredTransactions.length > 0) {
      const income = filteredTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = filteredTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      filtered[monthKey] = {
        transactions: filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
        income,
        expenses
      }
    }
  })
  
  return filtered
})

// Ordena meses do mais recente para o mais antigo
const sortedMonths = computed(() => {
  const months = Object.entries(filteredByMonth.value)
    .sort((a, b) => b[0].localeCompare(a[0]))
  
  // Define o mês atual como expandido por padrão
  if (months.length > 0 && expandedMonth.value === null) {
    nextTick(() => {
      expandedMonth.value = months[0][0]
    })
  }
  
  return Object.fromEntries(months)
})

const topCategories = computed(() => {
  if (!extratoData.value) return []
  
  const categoryTotals = {}
  let totalExpenses = 0
  
  Object.values(filteredByMonth.value).forEach(month => {
    month.transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
        totalExpenses += Math.abs(t.amount)
      })
  })
  
  return Object.entries(categoryTotals)
    .map(([name, total]) => ({
      name,
      total,
      percentage: (total / totalExpenses) * 100
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const insights = computed(() => extratoData.value?.insights || [])

const totalIncome = computed(() => {
  return Object.values(filteredByMonth.value)
    .reduce((sum, month) => sum + month.income, 0)
})

const totalExpenses = computed(() => {
  return Object.values(filteredByMonth.value)
    .reduce((sum, month) => sum + month.expenses, 0)
})

const balance = computed(() => totalIncome.value - totalExpenses.value)

const formatMonth = (monthKey) => {
  const [year, month] = monthKey.split('-')
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${months[parseInt(month) - 1]} ${year}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getCategoryColor = (category) => {
  const colors = {
    'Alimentação': 'orange',
    'Transporte': 'blue',
    'Moradia': 'purple',
    'Recarga Celular': 'red',
    'Lazer': 'pink',
    'Saúde': 'green',
    'Educação': 'indigo'
  }
  return colors[category] || 'grey'
}

const getInsightIcon = (type) => {
  const icons = {
    warning: 'mdi-alert-circle',
    info: 'mdi-information',
    success: 'mdi-check-circle'
  }
  return icons[type] || 'mdi-lightbulb'
}

const createChart = async () => {
  if (!chartCanvas.value || !extratoData.value) return
  
  // Importa Chart.js dinamicamente
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  // Destroi chart anterior se existir
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Prepara dados para o gráfico - Cálculo diário, agrupamento mensal para visualização
  const allMonthsData = Object.entries(filteredByMonth.value)
    .sort((a, b) => a[0].localeCompare(b[0]))
  
  // Se tiver menos de 3 meses, preenche com zeros para não ficar linha reta
  let monthsData = allMonthsData.slice(-6) // Últimos 6 meses
  
  // Se tiver apenas 1 ou 2 meses, adiciona meses vazios antes para criar curva
  if (monthsData.length < 3) {
    const firstMonth = monthsData[0]?.[0]
    if (firstMonth) {
      const [year, month] = firstMonth.split('-')
      const emptyMonths = []
      
      for (let i = 3 - monthsData.length; i > 0; i--) {
        const prevMonth = new Date(parseInt(year), parseInt(month) - i, 1)
        const prevKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth()).padStart(2, '0')}`
        emptyMonths.push([prevKey, { expenses: 0, income: 0, transactions: [] }])
      }
      
      monthsData = [...emptyMonths, ...monthsData]
    }
  }
  
  const labels = monthsData.map(([key]) => {
    const [year, month] = key.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[parseInt(month) - 1]}/${year.slice(2)}`
  })
  
  // Calcula média diária para cada mês
  const expensesData = monthsData.map(([monthKey, data]) => {
    if (data.expenses === 0) return 0 // Mês vazio
    const [year, month] = monthKey.split('-')
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
    return data.expenses / daysInMonth // Média diária
  })
  
  const incomeData = monthsData.map(([monthKey, data]) => {
    if (data.income === 0) return 0 // Mês vazio
    const [year, month] = monthKey.split('-')
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
    return data.income / daysInMonth // Média diária
  })
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Gastos',
          data: expensesData,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#F44336',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Receitas',
          data: incomeData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              return context.dataset.label + ' (média/dia): ' + formatCurrency(context.parsed.y)
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toLocaleString('pt-BR')
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const fetchExtrato = async () => {
  try {
    loading.value = true
    const response = await userService.getExtrato(authStore.user.email)
    
    if (response.success) {
      extratoData.value = response.data
      // Carrega todos os gastos futuros (filtro aplicado no computed)
      futurePayments.value = response.data.futurePayments || []
      await nextTick()
      createChart()
    }
  } catch (error) {
    console.error('Erro ao buscar extrato:', error)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Recria gráfico quando filtros mudam
watch([filterPeriod, filterCategory, filterType], () => {
  nextTick(() => createChart())
})

onMounted(() => {
  fetchExtrato()
})
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}

.border-l-error {
  border-left-color: rgb(var(--v-theme-error)) !important;
}

.border-l-success {
  border-left-color: rgb(var(--v-theme-success)) !important;
}
</style>
