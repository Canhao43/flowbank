<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" elevation="1">
      <v-app-bar-nav-icon @click="$router.push('/admin')" />
      
      <v-app-bar-title class="d-flex align-center">
        <v-icon color="primary" size="32" class="mr-2">mdi-wave</v-icon>
        <span class="text-primary font-weight-bold">FlowBank</span>
        <v-chip size="small" color="primary" class="ml-3">Admin</v-chip>
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

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            <v-icon color="primary" size="32" class="mr-2">mdi-bullhorn</v-icon>
            Campanhas de Vendas
          </h1>
          <p class="text-subtitle-1 text-grey">
            Gerencie campanhas e identifique clientes propensos a cada oferta
          </p>
        </div>

        <!-- Campanhas Grid -->
        <v-row v-if="!selectedCampaign">
          <v-col
            v-for="campaign in campaigns"
            :key="campaign.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              elevation="3"
              hover
              @click="selectCampaign(campaign)"
              class="h-100 cursor-pointer"
            >
              <v-card-title class="d-flex align-center" :class="`bg-${campaign.color}-lighten-4`">
                <v-icon :color="campaign.color" size="32" class="mr-2">
                  {{ campaign.icon }}
                </v-icon>
                <div>
                  <div class="text-h6">{{ campaign.name }}</div>
                  <v-chip :color="campaign.color" size="x-small" class="mt-1">
                    {{ campaign.category }}
                  </v-chip>
                </div>
              </v-card-title>

              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">{{ campaign.description }}</p>

                <!-- Preço -->
                <div class="mb-3">
                  <div class="d-flex align-center">
                    <span class="text-h5 font-weight-bold text-primary">
                      {{ formatCurrency(campaign.campaignPrice) }}
                    </span>
                    <span class="text-caption text-grey text-decoration-line-through ml-2">
                      {{ formatCurrency(campaign.originalPrice) }}
                    </span>
                  </div>
                  <v-chip :color="campaign.color" size="small" class="mt-2">
                    {{ campaign.discount }}
                  </v-chip>
                </div>

                <!-- Benefício -->
                <v-alert type="info" variant="tonal" density="compact" class="mb-3">
                  <div class="text-caption">
                    <strong>Benefício:</strong> {{ campaign.benefit }}
                  </div>
                </v-alert>

                <!-- Período -->
                <div class="text-caption text-grey mb-2">
                  <v-icon size="small">mdi-calendar-range</v-icon>
                  {{ formatDate(campaign.startDate) }} até {{ formatDate(campaign.endDate) }}
                </div>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  :color="campaign.color"
                  variant="flat"
                  block
                  prepend-icon="mdi-account-group"
                >
                  Ver Clientes Propensos
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Detalhes da Campanha + Clientes Propensos -->
        <div v-else>
          <!-- Voltar -->
          <v-btn
            variant="text"
            prepend-icon="mdi-arrow-left"
            class="mb-4"
            @click="selectedCampaign = null"
          >
            Voltar para Campanhas
          </v-btn>

          <v-row>
            <!-- Card da Campanha -->
            <v-col cols="12" md="4">
              <v-card elevation="3" class="sticky-card">
                <v-card-title :class="`bg-${selectedCampaign.color}-lighten-4`">
                  <v-icon :color="selectedCampaign.color" size="40" class="mr-2">
                    {{ selectedCampaign.icon }}
                  </v-icon>
                  <div>
                    <div class="text-h5">{{ selectedCampaign.name }}</div>
                    <v-chip :color="selectedCampaign.color" size="small" class="mt-1">
                      {{ selectedCampaign.category }}
                    </v-chip>
                  </div>
                </v-card-title>

                <v-card-text class="pa-4">
                  <!-- Preço -->
                  <div class="text-center mb-4 pa-4 bg-grey-lighten-4 rounded">
                    <div class="text-caption text-grey mb-1">De</div>
                    <div class="text-h6 text-decoration-line-through text-grey">
                      {{ formatCurrency(selectedCampaign.originalPrice) }}
                    </div>
                    <div class="text-caption text-grey mb-1">Por</div>
                    <div class="text-h4 font-weight-bold text-primary">
                      {{ formatCurrency(selectedCampaign.campaignPrice) }}
                    </div>
                    <v-chip :color="selectedCampaign.color" class="mt-2">
                      {{ selectedCampaign.discount }}
                    </v-chip>
                  </div>

                  <v-divider class="my-4" />

                  <!-- Descrição -->
                  <div class="mb-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2">Descrição</div>
                    <p class="text-body-2">{{ selectedCampaign.description }}</p>
                  </div>

                  <!-- Benefício -->
                  <div class="mb-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2">Benefício</div>
                    <v-alert type="success" variant="tonal" density="compact">
                      {{ selectedCampaign.benefit }}
                    </v-alert>
                  </div>

                  <!-- Argumento de Venda -->
                  <div class="mb-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                      <v-icon size="small" class="mr-1">mdi-lightbulb</v-icon>
                      Por que vale a pena?
                    </div>
                    <p class="text-body-2 text-grey-darken-2">
                      {{ selectedCampaign.salesPitch }}
                    </p>
                  </div>

                  <!-- Insights -->
                  <v-divider class="my-4" />
                  <div v-if="campaignInsights">
                    <div class="text-subtitle-2 font-weight-bold mb-3">Insights da Campanha</div>
                    <v-row dense>
                      <v-col cols="6">
                        <v-card variant="tonal" color="primary">
                          <v-card-text class="text-center pa-2">
                            <div class="text-h6 font-weight-bold">{{ campaignInsights.totalProspects }}</div>
                            <div class="text-caption">Total de Clientes</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="tonal" color="success">
                          <v-card-text class="text-center pa-2">
                            <div class="text-h6 font-weight-bold">{{ campaignInsights.highCompatibility }}</div>
                            <div class="text-caption">Alta Compat.</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="tonal" color="orange">
                          <v-card-text class="text-center pa-2">
                            <div class="text-h6 font-weight-bold">{{ campaignInsights.canAffordCount }}</div>
                            <div class="text-caption">Podem Pagar</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="tonal" color="purple">
                          <v-card-text class="text-center pa-2">
                            <div class="text-h6 font-weight-bold">{{ campaignInsights.conversionEstimate }}%</div>
                            <div class="text-caption">Conversão Est.</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Lista de Clientes Propensos -->
            <v-col cols="12" md="8">
              <v-card elevation="2">
                <v-card-title>
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  Clientes Propensos
                </v-card-title>

                <!-- Filtros e Controles -->
                <v-card-subtitle class="pb-0">
                  <v-row align="center" class="mt-2">
                    <v-col cols="12" sm="6" md="5">
                      <!-- Filtro de Ordenação -->
                      <v-select
                        v-model="sortBy"
                        :items="sortOptions"
                        label="Ordenar por"
                        density="comfortable"
                        variant="outlined"
                        hide-details
                        @update:modelValue="loadProspects"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon size="small">mdi-sort</v-icon>
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="7" class="d-flex align-center">
                      <!-- Toggle Considerar Renda -->
                      <v-card
                        variant="outlined"
                        class="pa-2 flex-grow-1"
                        :class="includeIncome ? 'bg-primary-lighten-5' : ''"
                      >
                        <v-switch
                          v-model="includeIncome"
                          color="primary"
                          hide-details
                          density="comfortable"
                          @update:modelValue="loadProspects"
                          class="ml-2"
                        >
                          <template v-slot:label>
                            <span class="font-weight-medium">
                              <v-icon size="small" class="mr-1">mdi-cash</v-icon>
                              Priorizar Clientes com Maior Renda
                            </span>
                          </template>
                        </v-switch>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-subtitle>

                <v-card-text class="pa-0">
                  <v-list v-if="prospects.length > 0">
                    <v-list-item
                      v-for="(prospect, index) in prospects"
                      :key="prospect.id"
                      class="border-b"
                    >
                      <template v-slot:prepend>
                        <v-avatar :image="prospect.avatar" size="48" class="mr-3" />
                      </template>

                      <v-list-item-title class="font-weight-bold">
                        {{ prospect.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        <div class="d-flex align-center gap-2 mt-1 flex-wrap">
                          <!-- Compatibilidade -->
                          <v-chip
                            :color="getCompatibilityColor(prospect.compatibility)"
                            size="small"
                            variant="flat"
                          >
                            <v-icon start size="small">mdi-chart-line</v-icon>
                            {{ prospect.compatibility }}% Match
                          </v-chip>

                          <!-- Score -->
                          <v-chip size="small" variant="tonal">
                            Score: {{ prospect.score }}
                          </v-chip>

                          <!-- Renda Estimada -->
                          <v-chip
                            :color="prospect.canAfford ? 'success' : 'orange'"
                            size="small"
                            variant="tonal"
                          >
                            <v-icon start size="small">
                              {{ prospect.canAfford ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                            </v-icon>
                            {{ formatCurrency(prospect.estimatedIncome) }}/mês
                          </v-chip>

                          <!-- Economia -->
                          <v-chip color="green" size="small" variant="tonal">
                            <v-icon start size="small">mdi-cash-plus</v-icon>
                            Economiza {{ formatCurrency(prospect.savingsPerMonth) }}/mês
                          </v-chip>
                        </div>
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="text-right">
                          <div class="text-h6 font-weight-bold text-primary mb-1">
                            #{{ index + 1 }}
                          </div>
                          <v-btn
                            :color="selectedCampaign.color"
                            size="small"
                            variant="tonal"
                            @click="showProspectDetails(prospect)"
                          >
                            Detalhes
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>

                  <div v-else class="pa-8 text-center text-grey">
                    <v-icon size="64" class="mb-4">mdi-account-search</v-icon>
                    <p>Nenhum cliente encontrado para esta campanha</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>

    <!-- Dialog de Detalhes do Cliente -->
    <v-dialog v-model="prospectDialog" max-width="600">
      <v-card v-if="selectedProspect">
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-avatar :image="selectedProspect.avatar" size="40" class="mr-3" />
          <div>
            <div class="text-h6">{{ selectedProspect.name }}</div>
            <div class="text-caption">{{ selectedProspect.email }}</div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Compatibilidade Score -->
          <div class="text-center mb-4">
            <v-progress-circular
              :model-value="selectedProspect.compatibility"
              :size="120"
              :width="12"
              :color="getCompatibilityColor(selectedProspect.compatibility)"
              class="mb-2"
            >
              <div class="text-center">
                <div class="text-h4 font-weight-bold">{{ selectedProspect.compatibility }}%</div>
                <div class="text-caption">Compatibilidade</div>
              </div>
            </v-progress-circular>
          </div>

          <v-divider class="my-4" />

          <!-- Informações Financeiras -->
          <v-row dense class="mb-4">
            <v-col cols="6">
              <div class="text-caption text-grey">Renda Estimada</div>
              <div class="text-h6 font-weight-bold">
                {{ formatCurrency(selectedProspect.estimatedIncome) }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-grey">Score FlowBank</div>
              <div class="text-h6 font-weight-bold">
                {{ selectedProspect.score }}/100
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-grey">Tempo de Cliente</div>
              <div class="text-h6 font-weight-bold">
                {{ selectedProspect.monthsActive }} meses
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-grey">Economia Mensal</div>
              <div class="text-h6 font-weight-bold text-success">
                {{ formatCurrency(selectedProspect.savingsPerMonth) }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Razões de Compatibilidade -->
          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">Por que é um bom prospect?</div>
            <v-list density="compact">
              <v-list-item
                v-for="(reason, idx) in selectedProspect.reasons"
                :key="idx"
                class="px-0"
              >
                <div class="text-body-2">{{ reason }}</div>
              </v-list-item>
            </v-list>
          </div>

          <!-- Status de Pagamento -->
          <v-alert
            :type="selectedProspect.canAfford ? 'success' : 'warning'"
            variant="tonal"
            density="compact"
          >
            <div class="text-body-2">
              <strong v-if="selectedProspect.canAfford">
                ✅ Cliente TEM capacidade de pagamento
              </strong>
              <strong v-else>
                ⚠️ Verificar capacidade de pagamento
              </strong>
            </div>
            <div class="text-caption mt-1">
              Renda mínima sugerida: {{ formatCurrency(selectedCampaign.targetProfile.preferredIncome || 0) }}
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="prospectDialog = false">Fechar</v-btn>
          <v-btn
            :color="selectedCampaign.color"
            variant="flat"
            prepend-icon="mdi-phone"
          >
            Entrar em Contato
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const authStore = useAuthStore()
const router = useRouter()

const campaigns = ref([])
const selectedCampaign = ref(null)
const prospects = ref([])
const campaignInsights = ref(null)
const selectedProspect = ref(null)
const prospectDialog = ref(false)
const sortBy = ref('compatibility')
const includeIncome = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const sortOptions = [
  { title: 'Melhor Compatibilidade', value: 'compatibility' },
  { title: 'Maior Renda', value: 'income' }
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getCompatibilityColor = (score) => {
  if (score >= 70) return 'success'
  if (score >= 50) return 'orange'
  return 'grey'
}

const loadCampaigns = async () => {
  try {
    const response = await api.get('/admin/campaigns')
    if (response.data.success) {
      campaigns.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar campanhas:', error)
    snackbarMessage.value = 'Erro ao carregar campanhas'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const selectCampaign = (campaign) => {
  selectedCampaign.value = campaign
  loadProspects()
}

const loadProspects = async () => {
  if (!selectedCampaign.value) return

  try {
    const response = await api.get(
      `/admin/campaigns/${selectedCampaign.value.id}/prospects`,
      {
        params: {
          sortBy: sortBy.value,
          includeIncome: includeIncome.value
        }
      }
    )
    
    if (response.data.success) {
      prospects.value = response.data.data.prospects
      campaignInsights.value = response.data.data.insights
    }
  } catch (error) {
    console.error('Erro ao carregar prospects:', error)
    snackbarMessage.value = 'Erro ao carregar clientes propensos'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const showProspectDetails = (prospect) => {
  selectedProspect.value = prospect
  prospectDialog.value = true
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadCampaigns()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.sticky-card {
  position: sticky;
  top: 24px;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
