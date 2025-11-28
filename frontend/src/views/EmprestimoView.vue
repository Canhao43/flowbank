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
            <v-icon color="primary" size="32" class="mr-2">mdi-hand-coin</v-icon>
            Empréstimo
          </h1>
          <p class="text-subtitle-1 text-grey">Crédito baseado no seu score alternativo</p>
        </div>

        <v-row>
          <!-- Coluna Principal - Simulação -->
          <v-col cols="12" md="8">
            <!-- Card de Limite Disponível -->
            <v-card class="mb-6" elevation="2" color="primary">
              <v-card-text class="pa-6">
                <div class="text-white">
                  <div class="text-subtitle-2 mb-2">Limite Disponível para Empréstimo</div>
                  <div class="text-h3 font-weight-bold mb-4">
                    {{ formatCurrency(creditLimit) }}
                  </div>
                  <div class="d-flex align-center">
                    <v-icon color="white" class="mr-2">mdi-shield-check</v-icon>
                    <span class="text-body-2">Baseado no seu score: {{ score }}/100</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Simulador de Empréstimo -->
            <v-card elevation="2">
              <v-card-title class="d-flex align-center bg-grey-lighten-4">
                <v-icon class="mr-2" color="primary">mdi-calculator</v-icon>
                Simule seu Empréstimo
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form @submit.prevent="simulateLoan">
                  <!-- Valor do Empréstimo -->
                  <div class="mb-6">
                    <div class="d-flex justify-space-between mb-2">
                      <label class="text-subtitle-2 font-weight-medium">Quanto você precisa?</label>
                      <span class="text-h6 text-primary font-weight-bold">{{ formatCurrency(loanAmount) }}</span>
                    </div>
                    <v-slider
                      v-model="loanAmount"
                      :min="100"
                      :max="creditLimit"
                      :step="100"
                      color="primary"
                      track-color="grey-lighten-2"
                      thumb-label
                    >
                      <template v-slot:thumb-label="{ modelValue }">
                        {{ formatCurrency(modelValue) }}
                      </template>
                    </v-slider>
                  </div>

                  <!-- Prazo -->
                  <div class="mb-6">
                    <div class="d-flex justify-space-between mb-2">
                      <label class="text-subtitle-2 font-weight-medium">Em quantos meses?</label>
                      <span class="text-h6 text-primary font-weight-bold">{{ loanMonths }} meses</span>
                    </div>
                    <v-slider
                      v-model="loanMonths"
                      :min="3"
                      :max="24"
                      :step="1"
                      color="primary"
                      track-color="grey-lighten-2"
                      thumb-label
                    />
                  </div>

                  <!-- Resumo da Simulação -->
                  <v-card variant="outlined" class="mb-6 bg-blue-lighten-5">
                    <v-card-text class="pa-4">
                      <div class="text-h6 font-weight-bold mb-4 text-center">Resumo do Empréstimo</div>
                      
                      <v-row dense>
                        <v-col cols="6">
                          <div class="text-caption text-grey">Taxa de Juros</div>
                          <div class="text-h6 font-weight-bold">{{ interestRate }}% a.m.</div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-caption text-grey">Parcela Mensal</div>
                          <div class="text-h6 font-weight-bold text-primary">{{ formatCurrency(monthlyPayment) }}</div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-caption text-grey">Total de Juros</div>
                          <div class="text-h6 font-weight-bold">{{ formatCurrency(totalInterest) }}</div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-caption text-grey">Total a Pagar</div>
                          <div class="text-h6 font-weight-bold text-error">{{ formatCurrency(totalAmount) }}</div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <!-- Botão Solicitar -->
                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    :loading="loading"
                    class="font-weight-bold"
                  >
                    <v-icon start>mdi-check-circle</v-icon>
                    Solicitar Empréstimo
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Coluna Lateral - Informações -->
          <v-col cols="12" md="4">
            <!-- Vantagens -->
            <v-card elevation="2" class="mb-4">
              <v-card-title>
                <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                Vantagens
              </v-card-title>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-lightning-bolt</v-icon>
                  </template>
                  <v-list-item-title>Aprovação rápida</v-list-item-title>
                  <v-list-item-subtitle>Em até 5 minutos</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-percent</v-icon>
                  </template>
                  <v-list-item-title>Juros reduzidos</v-list-item-title>
                  <v-list-item-subtitle>A partir de {{ interestRate }}% a.m.</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-clock-outline</v-icon>
                  </template>
                  <v-list-item-title>Prazo flexível</v-list-item-title>
                  <v-list-item-subtitle>De 3 a 24 meses</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-cash-fast</v-icon>
                  </template>
                  <v-list-item-title>Dinheiro na hora</v-list-item-title>
                  <v-list-item-subtitle>Crédito em conta imediato</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Como Funciona -->
            <v-card elevation="2">
              <v-card-title>
                <v-icon class="mr-2" color="info">mdi-information</v-icon>
                Como Funciona
              </v-card-title>
              <v-card-text>
                <v-timeline density="compact" side="end" align="start">
                  <v-timeline-item dot-color="primary" size="small">
                    <div class="text-subtitle-2 font-weight-bold">1. Simule</div>
                    <div class="text-caption">Escolha o valor e prazo</div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="primary" size="small">
                    <div class="text-subtitle-2 font-weight-bold">2. Solicite</div>
                    <div class="text-caption">Clique em solicitar empréstimo</div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="primary" size="small">
                    <div class="text-subtitle-2 font-weight-bold">3. Análise</div>
                    <div class="text-caption">Aprovação automática baseada no score</div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="primary" size="small">
                    <div class="text-subtitle-2 font-weight-bold">4. Receba</div>
                    <div class="text-caption">Dinheiro cai na conta na hora</div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog de Confirmação -->
        <v-dialog v-model="confirmDialog" max-width="500">
          <v-card>
            <v-card-title class="d-flex align-center bg-success pa-4">
              <v-icon size="32" class="mr-2">mdi-check-circle</v-icon>
              <span class="text-h6">Empréstimo Aprovado!</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <div class="text-center mb-4">
                <v-icon size="80" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
                <h3 class="text-h5 mb-2">Parabéns!</h3>
                <p class="text-body-1">
                  Seu empréstimo de <strong>{{ formatCurrency(loanAmount) }}</strong> foi aprovado!
                </p>
              </div>

              <v-divider class="my-4" />

              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-grey">Valor do Empréstimo</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold">
                    {{ formatCurrency(loanAmount) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-grey">Parcelas</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold">
                    {{ loanMonths }}x de {{ formatCurrency(monthlyPayment) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-grey">Total a Pagar</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold">
                    {{ formatCurrency(totalAmount) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-alert type="info" variant="tonal" class="mt-4">
                <div class="text-caption">
                  O valor será creditado em sua conta em até 5 minutos.
                </div>
              </v-alert>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                color="primary"
                @click="confirmDialog = false; $router.push('/dashboard')"
              >
                Ir para Dashboard
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="4000"
      location="top"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { transactionService, userService } from '@/services'

const authStore = useAuthStore()
const router = useRouter()

const drawer = ref(true)
const loading = ref(false)
const score = ref(0)
const creditLimit = ref(0)
const loanAmount = ref(1000)
const loanMonths = ref(12)
const confirmDialog = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Taxa de juros baseada no score (4 níveis)
// Bronze: < 30 | Prata: 30-49 | Ouro: 50-79 | Diamante: 80+
const interestRate = computed(() => {
  if (score.value >= 80) return 1.5   // Diamante: 1.5% a.m.
  if (score.value >= 50) return 2.0   // Ouro: 2.0% a.m.
  if (score.value >= 30) return 2.5   // Prata: 2.5% a.m.
  return 3.5                           // Bronze: 3.5% a.m.
})

// Cálculo da parcela mensal (juros compostos)
const monthlyPayment = computed(() => {
  const rate = interestRate.value / 100
  const factor = Math.pow(1 + rate, loanMonths.value)
  const payment = loanAmount.value * (rate * factor) / (factor - 1)
  return payment
})

// Total de juros
const totalInterest = computed(() => {
  return (monthlyPayment.value * loanMonths.value) - loanAmount.value
})

// Total a pagar
const totalAmount = computed(() => {
  return monthlyPayment.value * loanMonths.value
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const simulateLoan = async () => {
  loading.value = true
  
  try {
    const result = await transactionService.confirmLoan(authStore.user.email, {
      description: `Empréstimo - ${loanMonths.value}x de ${formatCurrency(monthlyPayment.value)}`,
      amount: loanAmount.value,
      category: 'Empréstimo',
      paymentMethod: 'loan',
      installments: loanMonths.value,
      monthlyPayment: monthlyPayment.value,
      totalAmount: totalAmount.value
    })
    
    if (result.success) {
      confirmDialog.value = true
    } else {
      snackbarMessage.value = result.message || 'Erro ao processar empréstimo'
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  } catch (error) {
    console.error('Erro ao processar empréstimo:', error)
    snackbarMessage.value = 'Erro ao processar empréstimo. Tente novamente.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const fetchUserData = async () => {
  try {
    const response = await userService.getDashboardData(authStore.user.email)
    if (response.success) {
      score.value = response.data.score
      
      // Usa o limite calculado pelo backend que já considera:
      // - Score do usuário
      // - Tempo de banco (meses ativos)
      // - Renda estimada baseada em transações
      // - Empréstimos ativos (já descontado)
      creditLimit.value = response.data.creditLimit || 0
      loanAmount.value = Math.min(1000, creditLimit.value)
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchUserData()
})
</script>
