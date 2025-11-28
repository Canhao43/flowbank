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
            <v-icon color="primary" size="32" class="mr-2">mdi-gift</v-icon>
            Benefícios Exclusivos
          </h1>
          <p class="text-subtitle-1 text-grey">Quanto maior seu score, melhores os benefícios!</p>
        </div>

        <v-row>
          <!-- Score Card -->
          <v-col cols="12">
            <v-card class="mb-4" elevation="3">
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" md="3" class="text-center">
                    <div class="position-relative d-inline-block">
                      <v-progress-circular
                        :model-value="score"
                        :size="160"
                        :width="15"
                        :color="getScoreColor(score)"
                        class="mb-2"
                      >
                        <div class="text-center">
                          <div class="text-h3 font-weight-bold" :class="`text-${getScoreColor(score)}`">
                            {{ score }}
                          </div>
                          <div class="text-caption">seu score</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>
                  <v-col cols="12" md="9">
                    <h2 class="text-h5 font-weight-bold mb-3">{{ getScoreTier(score).name }}</h2>
                    <p class="text-body-1 mb-4">{{ getScoreTier(score).description }}</p>
                    <v-chip
                      :color="getScoreColor(score)"
                      size="large"
                      class="font-weight-bold px-4"
                    >
                      <v-icon start>mdi-trophy</v-icon>
                      {{ getScoreTier(score).benefits }} benefícios disponíveis
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Benefícios -->
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-star-circle</v-icon>
                Seus Benefícios
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="benefit in availableBenefits"
                    :key="benefit.id"
                    cols="12"
                    md="6"
                    lg="4"
                  >
                    <v-card
                      :color="benefit.available ? 'white' : 'grey-lighten-3'"
                      :class="benefit.available ? 'elevation-4' : 'elevation-1'"
                      height="100%"
                    >
                      <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-4">
                          <v-avatar
                            :color="benefit.available ? benefit.color : 'grey'"
                            size="56"
                            class="mr-3"
                          >
                            <v-icon color="white" size="32">{{ benefit.icon }}</v-icon>
                          </v-avatar>
                          <div>
                            <h3 class="text-h6 font-weight-bold">{{ benefit.title }}</h3>
                            <v-chip
                              :color="benefit.available ? 'success' : 'grey'"
                              size="x-small"
                              class="mt-1"
                            >
                              {{ benefit.available ? 'Disponível' : 'Bloqueado' }}
                            </v-chip>
                          </div>
                        </div>
                        <p class="text-body-2 mb-4" :class="benefit.available ? '' : 'text-grey'">
                          {{ benefit.description }}
                        </p>
                        <v-divider class="my-3"></v-divider>
                        <div class="d-flex align-center justify-space-between">
                          <div>
                            <div class="text-caption text-grey">Score mínimo</div>
                            <div class="text-h6 font-weight-bold" :class="benefit.available ? `text-${benefit.color}` : 'text-grey'">
                              {{ benefit.minScore }}
                            </div>
                          </div>
                          <v-btn
                            v-if="benefit.available && !benefit.activated"
                            :color="benefit.color"
                            variant="flat"
                            @click="activateBenefit(benefit)"
                          >
                            Ativar
                          </v-btn>
                          <v-btn
                            v-else-if="benefit.available && benefit.activated"
                            color="success"
                            variant="tonal"
                            disabled
                          >
                            <v-icon start>mdi-check-circle</v-icon>
                            Ativado
                          </v-btn>
                          <v-tooltip v-else location="top">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                color="grey"
                                variant="outlined"
                                disabled
                              >
                                <v-icon>mdi-lock</v-icon>
                              </v-btn>
                            </template>
                            <span>Aumente seu score para {{ benefit.minScore }}+</span>
                          </v-tooltip>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Como Aumentar Score -->
          <v-col cols="12">
            <v-card color="primary" dark elevation="4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-lightbulb-on</v-icon>
                Como aumentar seu score
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="3" class="text-center">
                    <v-icon size="48" class="mb-2">mdi-cellphone</v-icon>
                    <h4 class="font-weight-bold mb-2">Recargas Regulares</h4>
                    <p class="text-caption">Faça recargas Claro mensalmente</p>
                  </v-col>
                  <v-col cols="12" md="3" class="text-center">
                    <v-icon size="48" class="mb-2">mdi-receipt-text</v-icon>
                    <h4 class="font-weight-bold mb-2">Pague Contas</h4>
                    <p class="text-caption">Mantenha contas em dia</p>
                  </v-col>
                  <v-col cols="12" md="3" class="text-center">
                    <v-icon size="48" class="mb-2">mdi-chart-line</v-icon>
                    <h4 class="font-weight-bold mb-2">Use Regularmente</h4>
                    <p class="text-caption">Faça transações consistentes</p>
                  </v-col>
                  <v-col cols="12" md="3" class="text-center">
                    <v-icon size="48" class="mb-2">mdi-calendar-check</v-icon>
                    <h4 class="font-weight-bold mb-2">Tempo de Conta</h4>
                    <p class="text-caption">Quanto mais tempo, melhor</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
        <v-btn color="white" variant="text" @click="snackbar = false">
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
import { userService } from '@/services'

const authStore = useAuthStore()
const router = useRouter()

const drawer = ref(true)
const score = ref(0)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
const activatedBenefits = ref([]) // Array de IDs dos benefícios ativados

// Benefícios organizados por nível de score
// Bronze: < 30 | Prata: 30-49 | Ouro: 50-79 | Diamante: 80+
const benefits = [
  // NÍVEL PRATA (30-49)
  {
    id: 1,
    title: 'Cashback em Recargas',
    description: 'Ganhe 2% de cashback em todas as recargas Claro',
    icon: 'mdi-cash-refund',
    color: 'grey-darken-1',
    minScore: 30,
    tier: 'Prata',
    value: '2%'
  },
  {
    id: 2,
    title: 'Desconto Básico',
    description: 'Até 5% de desconto no pagamento de contas essenciais',
    icon: 'mdi-percent',
    color: 'grey-darken-1',
    minScore: 30,
    tier: 'Prata',
    value: '5%'
  },
  // NÍVEL OURO (50-79)
  {
    id: 3,
    title: 'Cashback Premium',
    description: 'Ganhe 5% de cashback em todas as recargas Claro',
    icon: 'mdi-cash-refund',
    color: 'orange-darken-2',
    minScore: 50,
    tier: 'Ouro',
    value: '5%'
  },
  {
    id: 4,
    title: 'Desconto em Contas',
    description: 'Até 10% de desconto no pagamento de contas essenciais',
    icon: 'mdi-percent',
    color: 'orange-darken-2',
    minScore: 50,
    tier: 'Ouro',
    value: '10%'
  },
  {
    id: 5,
    title: 'Juros Reduzidos',
    description: 'Taxa de juros especial de 2% a.m. em empréstimos',
    icon: 'mdi-hand-coin',
    color: 'orange-darken-2',
    minScore: 50,
    tier: 'Ouro',
    value: '2% a.m.'
  },
  // NÍVEL DIAMANTE (80+)
  {
    id: 6,
    title: 'Cashback Máximo',
    description: 'Ganhe 10% de cashback em todas as recargas Claro',
    icon: 'mdi-cash-refund',
    color: 'cyan-darken-2',
    minScore: 80,
    tier: 'Diamante',
    value: '10%'
  },
  {
    id: 7,
    title: 'Isenção Total de Taxas',
    description: 'Zero tarifas em PIX, TED e pagamento de contas',
    icon: 'mdi-bank-transfer',
    color: 'cyan-darken-2',
    minScore: 80,
    tier: 'Diamante',
    value: 'R$ 0'
  },
  {
    id: 8,
    title: 'Empréstimo VIP',
    description: 'Taxa de juros exclusiva de 1.5% a.m. em empréstimos',
    icon: 'mdi-hand-coin',
    color: 'cyan-darken-2',
    minScore: 80,
    tier: 'Diamante',
    value: '1.5% a.m.'
  },
  {
    id: 9,
    title: 'Streaming Premium',
    description: '3 meses grátis de Spotify ou Netflix à sua escolha',
    icon: 'mdi-play-circle',
    color: 'cyan-darken-2',
    minScore: 80,
    tier: 'Diamante',
    value: '3 meses'
  },
  {
    id: 10,
    title: 'Limite Extra',
    description: 'Limite de crédito ampliado em até 50%',
    icon: 'mdi-cash-plus',
    color: 'cyan-darken-2',
    minScore: 80,
    tier: 'Diamante',
    value: '+50%'
  }
]

const availableBenefits = computed(() => {
  return benefits.map(benefit => ({
    ...benefit,
    available: score.value >= benefit.minScore,
    activated: activatedBenefits.value.includes(benefit.id)
  }))
})

const getScoreColor = (scoreValue) => {
  if (scoreValue >= 80) return 'cyan-darken-2'      // Diamante
  if (scoreValue >= 50) return 'orange-darken-2'    // Ouro
  if (scoreValue >= 30) return 'grey-darken-1'      // Prata
  return 'brown'                                     // Bronze
}

const getScoreTier = (scoreValue) => {
  if (scoreValue >= 80) {
    return {
      name: 'Nível Diamante 💎',
      description: 'Parabéns! Você alcançou o nível máximo com acesso a todos os benefícios exclusivos premium.',
      benefits: benefits.filter(b => b.minScore <= scoreValue).length
    }
  } else if (scoreValue >= 50) {
    return {
      name: 'Nível Ouro 🏆',
      description: 'Excelente! Você tem acesso a benefícios especiais. Continue para alcançar o Diamante!',
      benefits: benefits.filter(b => b.minScore <= scoreValue).length
    }
  } else if (scoreValue >= 30) {
    return {
      name: 'Nível Prata ⭐',
      description: 'Muito bom! Continue mantendo bons hábitos financeiros para desbloquear mais benefícios.',
      benefits: benefits.filter(b => b.minScore <= scoreValue).length
    }
  } else {
    return {
      name: 'Nível Bronze 🥉',
      description: 'Bem-vindo! Faça recargas regulares e pague contas em dia para alcançar o nível Prata.',
      benefits: 0
    }
  }
}

const activateBenefit = (benefit) => {
  if (!activatedBenefits.value.includes(benefit.id)) {
    activatedBenefits.value.push(benefit.id)
    // Salva no localStorage para persistir entre sessões
    localStorage.setItem('activatedBenefits', JSON.stringify(activatedBenefits.value))
    snackbarMessage.value = `Benefício "${benefit.title}" ativado com sucesso!`
    snackbarColor.value = 'success'
    snackbar.value = true
  }
}

const fetchUserData = async () => {
  try {
    const response = await userService.getDashboardData(authStore.user.email)
    
    if (response.success) {
      score.value = response.data.score
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Recupera benefícios ativados do localStorage
  const saved = localStorage.getItem('activatedBenefits')
  if (saved) {
    activatedBenefits.value = JSON.parse(saved)
  }
  fetchUserData()
})
</script>
