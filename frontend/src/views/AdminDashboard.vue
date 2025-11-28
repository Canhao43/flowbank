<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      
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
    <v-navigation-drawer
      v-model="drawer"
      app
      color="white"
      width="280"
    >
      <v-list nav density="compact" class="pa-2">
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Painel Principal
        </v-list-subheader>

        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :active="currentView === 'dashboard'"
          @click="currentView = 'dashboard'"
          rounded="lg"
        />

        <v-list-item
          prepend-icon="mdi-account-multiple"
          title="Clientes"
          value="clientes"
          :active="currentView === 'clientes'"
          @click="currentView = 'clientes'"
          rounded="lg"
        />

        <v-divider class="my-2" />

        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Vendas & Marketing
        </v-list-subheader>

        <v-list-item
          prepend-icon="mdi-bullhorn"
          title="Campanhas"
          value="campanhas"
          @click="router.push('/admin/campanhas')"
          rounded="lg"
        />

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Análise de Conversão"
          value="conversao"
          :active="currentView === 'conversao'"
          @click="currentView = 'conversao'"
          rounded="lg"
        />

        <v-divider class="my-2" />

        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Gestão de Risco
        </v-list-subheader>

        <v-list-item
          prepend-icon="mdi-alert-circle"
          title="Riscos & Inadimplência"
          value="riscos"
          :active="currentView === 'riscos'"
          @click="currentView = 'riscos'"
          rounded="lg"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon color="primary" class="mr-2">mdi-view-dashboard</v-icon>
              Dashboard
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Visão geral dos clientes FlowBank
            </p>
          </div>

          <!-- KPIs -->
          <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="48" class="mr-3">
                    <v-icon color="white">mdi-account-group</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Total de Clientes</div>
                    <div class="text-h5 font-weight-bold">
                      {{ adminData?.summary?.totalCustomers || 0 }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="success" size="48" class="mr-3">
                    <v-icon color="white">mdi-account-check</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Clientes Ativos</div>
                    <div class="text-h5 font-weight-bold">
                      {{ adminData?.summary?.activeCustomers || 0 }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="warning" size="48" class="mr-3">
                    <v-icon color="white">mdi-star</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Score Médio</div>
                    <div class="text-h5 font-weight-bold">
                      {{ adminData?.summary?.averageScore || 0 }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="error" size="48" class="mr-3">
                    <v-icon color="white">mdi-cellphone</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Receita Recargas</div>
                    <div class="text-h6 font-weight-bold">
                      {{ formatCurrency(adminData?.summary?.totalRevenueFromRecharges || 0) }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Resumo Executivo -->
        <v-row class="mb-4">
          <v-col cols="12" md="8">
            <v-card elevation="2">
              <v-card-title>
                <v-icon class="mr-2">mdi-chart-box</v-icon>
                Visão Executiva
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="pa-4 rounded bg-success-lighten-5 mb-3">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium">Taxa de Adimplência</span>
                        <v-chip color="success" size="small">Excelente</v-chip>
                      </div>
                      <div class="text-h4 font-weight-bold text-success">100%</div>
                      <v-progress-linear :model-value="100" color="success" class="mt-2" />
                    </div>

                    <div class="pa-4 rounded bg-primary-lighten-5">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium">Clientes Premium (Score 60+)</span>
                        <v-chip color="primary" size="small">{{ Math.round((clientInsights.propensos / (adminData?.summary?.totalCustomers || 1)) * 100) }}%</v-chip>
                      </div>
                      <div class="text-h4 font-weight-bold text-primary">{{ clientInsights.propensos }}</div>
                      <v-progress-linear 
                        :model-value="(clientInsights.propensos / (adminData?.summary?.totalCustomers || 1)) * 100" 
                        color="primary" 
                        class="mt-2" 
                      />
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="pa-4 rounded bg-orange-lighten-5 mb-3">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium">Potencial de Conversão</span>
                        <v-chip color="orange" size="small">38%</v-chip>
                      </div>
                      <div class="text-h6 font-weight-bold text-orange">
                        {{ formatCurrency(conversionStats.potentialRevenue) }}
                      </div>
                      <div class="text-caption text-grey">Em campanhas ativas</div>
                    </div>

                    <div class="pa-4 rounded bg-purple-lighten-5">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium">Engajamento Alto</span>
                        <v-chip color="purple" size="small">{{ clientInsights.highEngagement }}%</v-chip>
                      </div>
                      <div class="text-body-2">
                        Clientes com 3+ recargas/mês
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="2" class="h-100" color="info-lighten-5">
              <v-card-title class="text-info">
                <v-icon class="mr-2">mdi-trophy</v-icon>
                Destaques
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-list density="compact" bg-color="transparent">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="cyan" size="small">mdi-diamond-stone</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <strong>{{ clientInsights.diamante }}</strong> clientes Diamante
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Alto potencial de receita
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success" size="small">mdi-trending-up</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <strong>{{ clientInsights.upsellPotential }}</strong> oportunidades de upsell
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Clientes Ouro/Prata ativos
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="orange" size="small">mdi-bullhorn</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <strong>6</strong> campanhas ativas
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Segmentação comportamental
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="error" size="small">mdi-shield-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <strong>0</strong> inadimplentes
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Scoring alternativo eficaz
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Ações Rápidas -->
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="primary"
                  prepend-icon="mdi-bullhorn"
                  @click="router.push('/admin/campanhas')"
                >
                  Ver Campanhas
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="success"
                  prepend-icon="mdi-account-multiple"
                  @click="currentView = 'clientes'"
                >
                  Gerenciar Clientes
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="orange"
                  prepend-icon="mdi-chart-line"
                  @click="currentView = 'conversao'"
                >
                  Análise de Conversão
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="error"
                  prepend-icon="mdi-alert-circle"
                  @click="currentView = 'riscos'"
                >
                  Análise de Riscos
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        </div>

        <!-- Clientes View -->
        <div v-else-if="currentView === 'clientes'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon color="primary" class="mr-2">mdi-account-multiple</v-icon>
              Gestão de Clientes
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Visualização detalhada da base de clientes
            </p>
          </div>

          <!-- Insights Cards -->
          <v-row class="mb-4">
            <v-col cols="12" md="3">
              <v-card elevation="2" color="primary-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="primary" size="48" class="mr-3">
                      <v-icon color="white">mdi-diamond-stone</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Clientes Diamante</div>
                      <div class="text-h5 font-weight-bold text-primary">
                        {{ clientInsights.diamante }}
                      </div>
                      <div class="text-caption text-success">
                        Maior potencial de conversão
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="orange-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="orange" size="48" class="mr-3">
                      <v-icon color="white">mdi-trophy</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Clientes Ouro</div>
                      <div class="text-h5 font-weight-bold text-orange">
                        {{ clientInsights.ouro }}
                      </div>
                      <div class="text-caption text-grey">
                        Bom histórico de pagamento
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="success-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="success" size="48" class="mr-3">
                      <v-icon color="white">mdi-chart-line</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Receita Média/Cliente</div>
                      <div class="text-h6 font-weight-bold text-success">
                        {{ formatCurrency(clientInsights.avgRevenue) }}
                      </div>
                      <div class="text-caption text-grey">
                        Últimos 30 dias
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="purple-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="purple" size="48" class="mr-3">
                      <v-icon color="white">mdi-bullhorn</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Propensos a Ofertas</div>
                      <div class="text-h5 font-weight-bold text-purple">
                        {{ clientInsights.propensos }}
                      </div>
                      <div class="text-caption text-grey">
                        Score 60+ e ativos
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Insights Estratégicos -->
          <v-card elevation="2" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="info">mdi-lightbulb</v-icon>
              Insights da Base de Clientes
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        <strong>{{ clientInsights.highEngagement }}%</strong> dos clientes têm alta frequência de recargas
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="info" size="small">mdi-information</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        Score médio da base: <strong>{{ clientInsights.avgScore }}</strong> pontos
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="warning" size="small">mdi-trending-up</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        Potencial de upsell em <strong>{{ clientInsights.upsellPotential }}</strong> clientes
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6">
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="purple" size="small">mdi-cash-multiple</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        Receita total (recargas): <strong>{{ formatCurrency(clientInsights.totalRevenue) }}</strong>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="orange" size="small">mdi-account-star</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        <strong>{{ clientInsights.premiumReady }}</strong> clientes prontos para planos premium
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="success" size="small">mdi-shield-check</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        Taxa de inadimplência: <strong>0.0%</strong> (scoring eficaz)
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Filtros -->
          <v-card elevation="2" class="mb-4">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Buscar cliente"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="scoreFilter"
                    :items="scoreFilterOptions"
                    label="Filtrar por Score"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    label="Ordenar por"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    color="primary"
                    block
                    prepend-icon="mdi-download"
                    @click="exportData"
                  >
                    Exportar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Tabela de Clientes -->
          <v-card elevation="2">
            <v-card-title>
              <v-icon class="mr-2">mdi-account-multiple</v-icon>
              Base de Clientes ({{ filteredCustomers.length }})
            </v-card-title>
            <v-divider />
            
            <v-data-table
              :headers="headers"
              :items="filteredCustomers"
              :search="search"
              :items-per-page="10"
              class="elevation-0"
            >
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar size="36" class="mr-3">
                    <v-img :src="item.avatar" />
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <template v-slot:item.phone="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-2">mdi-phone</v-icon>
                  {{ item.phone }}
                </div>
              </template>

              <template v-slot:item.score="{ item }">
                <v-chip :color="getScoreColor(item.score)" size="small">
                  <v-icon size="small" class="mr-1">mdi-star</v-icon>
                  {{ item.score }}
                </v-chip>
              </template>

              <template v-slot:item.balance="{ item }">
                <span class="font-weight-medium">
                  {{ formatCurrency(item.balance) }}
                </span>
              </template>

              <template v-slot:item.stats.rechargeCount="{ item }">
                <div style="text-align: center;">
                  <div class="font-weight-bold text-primary">
                    {{ item.stats.rechargeCount }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatCurrency(item.stats.totalRecharges) }}
                  </div>
                </div>
              </template>

              <template v-slot:item.stats.totalSpent="{ item }">
                <span class="font-weight-medium">
                  {{ formatCurrency(item.stats.totalSpent) }}
                </span>
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="viewCustomer(item)"
                />
              </template>
            </v-data-table>
          </v-card>
        </div>

        <!-- Análise de Conversão View -->
        <div v-else-if="currentView === 'conversao'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
              Análise de Conversão
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Acompanhe o desempenho das campanhas e projeções de receita
            </p>
          </div>

          <!-- KPIs de Conversão -->
          <v-row class="mb-4">
            <v-col cols="12" md="3">
              <v-card elevation="2" color="success-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="success" size="48" class="mr-3">
                      <v-icon color="white">mdi-trending-up</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Taxa de Conversão</div>
                      <div class="text-h5 font-weight-bold text-success">
                        {{ conversionStats.avgConversionRate }}%
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="primary-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="primary" size="48" class="mr-3">
                      <v-icon color="white">mdi-account-check</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Clientes Propensos</div>
                      <div class="text-h5 font-weight-bold text-primary">
                        {{ conversionStats.totalProspects }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="orange-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="orange" size="48" class="mr-3">
                      <v-icon color="white">mdi-cash-multiple</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Receita Potencial</div>
                      <div class="text-h6 font-weight-bold text-orange">
                        {{ formatCurrency(conversionStats.potentialRevenue) }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="purple-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="purple" size="48" class="mr-3">
                      <v-icon color="white">mdi-bullhorn</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Campanhas Ativas</div>
                      <div class="text-h5 font-weight-bold text-purple">
                        6
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Desempenho por Campanha -->
          <v-card elevation="2" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-chart-bar</v-icon>
              Desempenho por Campanha
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" v-for="campaign in campaignPerformance" :key="campaign.name">
                  <v-card variant="outlined">
                    <v-card-title class="text-h6">
                      <v-icon :color="campaign.color" class="mr-2">{{ campaign.icon }}</v-icon>
                      {{ campaign.name }}
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="6">
                          <div class="text-center pa-2">
                            <div class="text-caption text-grey">Prospectos</div>
                            <div class="text-h5 font-weight-bold">{{ campaign.prospects }}</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-center pa-2">
                            <div class="text-caption text-grey">Conversão Est.</div>
                            <div class="text-h5 font-weight-bold text-success">{{ campaign.conversion }}%</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-center pa-2">
                            <div class="text-caption text-grey">Podem Pagar</div>
                            <div class="text-h6 font-weight-bold text-orange">{{ campaign.canAfford }}</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-center pa-2">
                            <div class="text-caption text-grey">Receita Potencial</div>
                            <div class="text-h6 font-weight-bold text-primary">{{ formatCurrency(campaign.revenue) }}</div>
                          </div>
                        </v-col>
                      </v-row>
                      <v-progress-linear
                        :model-value="campaign.conversion"
                        :color="campaign.color"
                        height="8"
                        rounded
                        class="mt-2"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Insights Estratégicos -->
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="purple">mdi-lightbulb</v-icon>
              Insights Estratégicos
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    Clientes Diamante têm 85% de taxa de conversão em planos premium
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Priorize ofertas de alto valor para este segmento
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="info">mdi-information</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    45% dos clientes Prata podem ser convertidos para planos intermediários
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Oportunidade de upsell com benefícios escalonados
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="warning">mdi-alert</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    Clientes com score abaixo de 30 têm baixa adesão a novas ofertas
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Recomenda-se focar em retenção e engajamento primeiro
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-cash-check</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    ROI médio de 320% nas campanhas baseadas em scoring comportamental
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Segmentação por hábitos de consumo supera métodos tradicionais
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <!-- Análise de Riscos View -->
        <div v-else-if="currentView === 'riscos'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
              Análise de Riscos & Inadimplência
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Monitoramento de scoring e prevenção de inadimplência
            </p>
          </div>

          <!-- KPIs de Risco -->
          <v-row class="mb-4">
            <v-col cols="12" md="3">
              <v-card elevation="2" color="error-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="error" size="48" class="mr-3">
                      <v-icon color="white">mdi-alert-octagon</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Alto Risco</div>
                      <div class="text-h5 font-weight-bold text-error">
                        {{ riskStats.highRisk }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="warning-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="warning" size="48" class="mr-3">
                      <v-icon color="white">mdi-alert</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Risco Médio</div>
                      <div class="text-h5 font-weight-bold text-warning">
                        {{ riskStats.mediumRisk }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="success-lighten-5">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="success" size="48" class="mr-3">
                      <v-icon color="white">mdi-shield-check</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Baixo Risco</div>
                      <div class="text-h5 font-weight-bold text-success">
                        {{ riskStats.lowRisk }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card elevation="2" color="grey-lighten-3">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar color="grey-darken-2" size="48" class="mr-3">
                      <v-icon color="white">mdi-percent</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Taxa de Inadimplência</div>
                      <div class="text-h5 font-weight-bold">
                        0.0%
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Distribuição por Score -->
          <v-row class="mb-4">
            <v-col cols="12" md="8">
              <v-card elevation="2">
                <v-card-title>
                  <v-icon class="mr-2">mdi-chart-donut</v-icon>
                  Distribuição de Clientes por Score
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row>
                    <v-col cols="6" md="3" v-for="tier in scoreTiers" :key="tier.name">
                      <div class="text-center pa-4 rounded" :class="`bg-${tier.color}-lighten-5`">
                        <v-icon :color="tier.color" size="40">{{ tier.icon }}</v-icon>
                        <div class="text-h4 font-weight-bold mt-2" :class="`text-${tier.color}`">
                          {{ tier.count }}
                        </div>
                        <div class="text-caption font-weight-bold text-uppercase">{{ tier.name }}</div>
                        <div class="text-caption text-grey">{{ tier.range }}</div>
                        <v-chip size="x-small" :color="tier.color" class="mt-2">
                          {{ tier.percentage }}%
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card elevation="2" color="info-lighten-5" class="h-100">
                <v-card-title class="text-info">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Metodologia de Scoring
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <p class="text-body-2 mb-3">
                    <strong>O FlowBank utiliza scoring alternativo</strong> baseado em comportamento de pagamentos e transações.
                  </p>
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small" color="primary">mdi-check</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Histórico de recargas</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small" color="primary">mdi-check</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Frequência de transações</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small" color="primary">mdi-check</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Categorias de gastos</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small" color="primary">mdi-check</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Tempo de relacionamento</v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-alert type="success" density="compact" variant="tonal" class="mt-3">
                    <div class="text-caption">
                      <strong>100% de adimplência</strong> em clientes com score acima de 60
                    </div>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Clientes em Risco -->
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="error">mdi-account-alert</v-icon>
              Clientes Requerendo Atenção
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-alert type="info" variant="tonal" class="mb-4">
                Sistema identifica automaticamente clientes com padrões de risco baseado em queda de score, redução de atividade ou aumento de tempo entre transações.
              </v-alert>

              <v-list>
                <v-list-item
                  v-for="customer in riskCustomers"
                  :key="customer.id"
                  class="border rounded mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar :image="customer.avatar" size="48" class="mr-3" />
                  </template>

                  <v-list-item-title class="font-weight-bold">
                    {{ customer.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ customer.email }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex align-center gap-2">
                      <v-chip :color="getScoreColor(customer.score)" size="small">
                        Score: {{ customer.score }}
                      </v-chip>
                      <v-chip :color="customer.riskLevel === 'high' ? 'error' : 'warning'" size="small">
                        {{ customer.riskReason }}
                      </v-chip>
                      <v-btn
                        icon="mdi-eye"
                        size="small"
                        variant="text"
                        @click="viewCustomer(customer)"
                      />
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <div v-else-if="currentView === 'segmentacao'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-target</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Segmentação de Clientes</h2>
          <p class="text-grey">Crie segmentos personalizados baseados em comportamento e perfil</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>

        <div v-else-if="currentView === 'receitas'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-finance</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Análise de Receitas</h2>
          <p class="text-grey">Visualize receitas por categoria, período e canal</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>

        <div v-else-if="currentView === 'credito'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-account-cash</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Gestão de Crédito</h2>
          <p class="text-grey">Monitore limites de crédito, empréstimos ativos e histórico de pagamentos</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>

        <div v-else-if="currentView === 'riscos'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-alert-circle</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Análise de Riscos</h2>
          <p class="text-grey">Identifique clientes em risco de inadimplência e tendências de score</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>

        <div v-else-if="currentView === 'relatorios'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-file-chart</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Relatórios Gerenciais</h2>
          <p class="text-grey">Gere relatórios customizados para análise executiva</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>

        <div v-else-if="currentView === 'exportar'" class="text-center pa-10">
          <v-icon size="100" color="grey-lighten-1">mdi-download</v-icon>
          <h2 class="text-h4 mt-4 mb-2">Exportação de Dados</h2>
          <p class="text-grey">Exporte dados em diversos formatos (CSV, Excel, PDF)</p>
          <v-chip class="mt-4" color="orange">Em Desenvolvimento</v-chip>
        </div>
      </v-container>
    </v-main>

    <!-- Dialog de Detalhes do Cliente com Insights -->
    <v-dialog v-model="customerDialog" max-width="900">
      <v-card v-if="selectedCustomer">
        <v-card-title class="bg-primary text-white d-flex align-center">
          <v-avatar size="48" class="mr-3">
            <v-img :src="selectedCustomer.avatar" />
          </v-avatar>
          <div>
            <div class="text-h6">{{ selectedCustomer.name }}</div>
            <div class="text-caption">{{ selectedCustomer.email }}</div>
          </div>
          <v-spacer />
          <v-chip :color="getScoreColor(selectedCustomer.score)" size="large" class="text-white">
            <v-icon class="mr-1">mdi-star</v-icon>
            {{ selectedCustomer.score }}
          </v-chip>
        </v-card-title>

        <v-card-text class="pa-0">
          <!-- Insights do Cliente -->
          <v-container class="bg-grey-lighten-4 pa-4">
            <div class="text-h6 mb-3">
              <v-icon class="mr-2" color="primary">mdi-lightbulb</v-icon>
              Insights do Cliente
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-card elevation="0" class="pa-3 mb-2" :color="getClientInsightColor(selectedCustomer).bg">
                  <div class="d-flex align-center">
                    <v-icon :color="getClientInsightColor(selectedCustomer).icon" class="mr-2" size="large">
                      {{ getClientInsightColor(selectedCustomer).iconName }}
                    </v-icon>
                    <div>
                      <div class="text-caption">Classificação</div>
                      <div class="text-h6 font-weight-bold">{{ getClientTier(selectedCustomer.score) }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="0" class="pa-3 mb-2" color="success-lighten-5">
                  <div class="d-flex align-center">
                    <v-icon color="success" class="mr-2" size="large">mdi-trending-up</v-icon>
                    <div>
                      <div class="text-caption">Nível de Engajamento</div>
                      <div class="text-h6 font-weight-bold">{{ getEngagementLevel(selectedCustomer) }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="0" class="pa-3 mb-2" color="orange-lighten-5">
                  <div class="d-flex align-center">
                    <v-icon color="orange" class="mr-2" size="large">mdi-target</v-icon>
                    <div>
                      <div class="text-caption">Potencial de Conversão</div>
                      <div class="text-h6 font-weight-bold">{{ getConversionPotential(selectedCustomer) }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="0" class="pa-3 mb-2" color="purple-lighten-5">
                  <div class="d-flex align-center">
                    <v-icon color="purple" class="mr-2" size="large">mdi-cash-multiple</v-icon>
                    <div>
                      <div class="text-caption">Receita Média/Recarga</div>
                      <div class="text-h6 font-weight-bold">
                        {{ formatCurrency((selectedCustomer.stats?.totalRecharges || 0) / Math.max((selectedCustomer.stats?.rechargeCount || 1), 1)) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Recomendações -->
            <v-alert
              :color="getRecommendationColor(selectedCustomer)"
              variant="tonal"
              class="mt-3"
              prominent
            >
              <template v-slot:prepend>
                <v-icon size="large">{{ getRecommendationIcon(selectedCustomer) }}</v-icon>
              </template>
              <div class="text-body-2">
                <strong>Recomendação Estratégica:</strong><br>
                {{ getRecommendation(selectedCustomer) }}
              </div>
            </v-alert>
          </v-container>

          <!-- Dados Detalhados -->
          <v-container class="pa-4">
            <div class="text-h6 mb-3">
              <v-icon class="mr-2" color="primary">mdi-information</v-icon>
              Dados Detalhados
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-phone</v-icon>
                    </template>
                    <v-list-item-title>{{ selectedCustomer.phone }}</v-list-item-title>
                    <v-list-item-subtitle>Telefone</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="grey">mdi-card-account-details</v-icon>
                    </template>
                    <v-list-item-title>{{ selectedCustomer.cpf }}</v-list-item-title>
                    <v-list-item-subtitle>CPF</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-wallet</v-icon>
                    </template>
                    <v-list-item-title>{{ formatCurrency(selectedCustomer.balance) }}</v-list-item-title>
                    <v-list-item-subtitle>Saldo Atual</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="info">mdi-cash</v-icon>
                    </template>
                    <v-list-item-title>{{ formatCurrency(selectedCustomer.creditLimit) }}</v-list-item-title>
                    <v-list-item-subtitle>Limite de Crédito</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="orange">mdi-cellphone</v-icon>
                    </template>
                    <v-list-item-title>{{ selectedCustomer.stats?.rechargeCount || 0 }} recargas</v-list-item-title>
                    <v-list-item-subtitle>Frequência de Recargas</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="purple">mdi-cash-check</v-icon>
                    </template>
                    <v-list-item-title>{{ formatCurrency(selectedCustomer.stats?.totalRecharges || 0) }}</v-list-item-title>
                    <v-list-item-subtitle>Total em Recargas</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="error">mdi-shopping</v-icon>
                    </template>
                    <v-list-item-title>{{ formatCurrency(selectedCustomer.stats?.totalSpent || 0) }}</v-list-item-title>
                    <v-list-item-subtitle>Gastos 30 dias</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="blue">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>{{ formatDate(selectedCustomer.createdAt) }}</v-list-item-title>
                    <v-list-item-subtitle>Cliente desde</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-row>
              <v-col cols="6" md="3">
                <div class="text-center pa-3 bg-grey-lighten-4 rounded">
                  <div class="text-h5 font-weight-bold text-primary">
                    {{ selectedCustomer.stats.rechargeCount }}
                  </div>
                  <div class="text-caption">Recargas</div>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="text-center pa-3 bg-grey-lighten-4 rounded">
                  <div class="text-h6 font-weight-bold text-success">
                    {{ formatCurrency(selectedCustomer.stats.totalRecharges) }}
                  </div>
                  <div class="text-caption">Total Recargas</div>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="text-center pa-3 bg-grey-lighten-4 rounded">
                  <div class="text-h6 font-weight-bold text-error">
                    {{ formatCurrency(selectedCustomer.stats.totalSpent) }}
                  </div>
                  <div class="text-caption">Gastos 30d</div>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="text-center pa-3 bg-grey-lighten-4 rounded">
                  <div class="text-h5 font-weight-bold">
                    {{ selectedCustomer.stats.totalTransactions }}
                  </div>
                  <div class="text-caption">Transações</div>
                </div>
              </v-col>
            </v-row>

            <v-alert
              v-if="selectedCustomer.stats.lastRecharge"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              Última recarga: {{ formatDate(selectedCustomer.stats.lastRecharge) }}
            </v-alert>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-bullhorn"
            @click="viewCampaignsForCustomer(selectedCustomer)"
          >
            Ver Campanhas Compatíveis
          </v-btn>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="customerDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const adminData = ref(null)
const search = ref('')
const scoreFilter = ref('all')
const sortBy = ref('name')
const customerDialog = ref(false)
const selectedCustomer = ref(null)
const drawer = ref(true)
const currentView = ref('dashboard')

const user = computed(() => authStore.user)

const headers = [
  { title: 'Cliente', key: 'name', sortable: true },
  { title: 'Telefone', key: 'phone', sortable: false },
  { title: 'Score', key: 'score', sortable: true },
  { title: 'Saldo', key: 'balance', sortable: true },
  { title: 'Recargas', key: 'stats.rechargeCount', sortable: true, align: 'center' },
  { title: 'Gastos 30d', key: 'stats.totalSpent', sortable: true },
  { title: 'Desde', key: 'createdAt', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const scoreFilterOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Score Alto (80+)', value: 'high' },
  { title: 'Score Médio (60-79)', value: 'medium' },
  { title: 'Score Baixo (<60)', value: 'low' }
]

const sortOptions = [
  { title: 'Nome', value: 'name' },
  { title: 'Score', value: 'score' },
  { title: 'Saldo', value: 'balance' },
  { title: 'Recargas', value: 'recharges' }
]

const filteredCustomers = computed(() => {
  if (!adminData.value?.customers) return []

  let filtered = [...adminData.value.customers]

  // Filtro por score
  if (scoreFilter.value !== 'all') {
    filtered = filtered.filter(c => {
      if (scoreFilter.value === 'high') return c.score >= 80
      if (scoreFilter.value === 'medium') return c.score >= 60 && c.score < 80
      if (scoreFilter.value === 'low') return c.score < 60
      return true
    })
  }

  // Ordenação
  filtered.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'score') return b.score - a.score
    if (sortBy.value === 'balance') return b.balance - a.balance
    if (sortBy.value === 'recharges') return b.stats.rechargeCount - a.stats.rechargeCount
    return 0
  })

  return filtered
})

// Insights da base de clientes
const clientInsights = computed(() => {
  const customers = adminData.value?.customers || []
  const total = customers.length || 1
  
  const diamante = customers.filter(c => c.score >= 80).length
  const ouro = customers.filter(c => c.score >= 50 && c.score < 80).length
  const propensos = customers.filter(c => c.score >= 60).length
  
  const totalRevenue = customers.reduce((sum, c) => sum + (c.stats?.totalRecharges || 0), 0)
  const avgRevenue = totalRevenue / total
  
  const highEngagement = Math.round((customers.filter(c => 
    (c.stats?.rechargeCount || 0) >= 3
  ).length / total) * 100)
  
  const avgScore = Math.round(customers.reduce((sum, c) => sum + c.score, 0) / total)
  
  const upsellPotential = customers.filter(c => 
    c.score >= 50 && c.score < 80 && (c.stats?.rechargeCount || 0) >= 2
  ).length
  
  const premiumReady = customers.filter(c => 
    c.score >= 80
  ).length
  
  return {
    diamante,
    ouro,
    propensos,
    avgRevenue,
    highEngagement,
    avgScore,
    upsellPotential,
    premiumReady,
    totalRevenue
  }
})

// Dados para Análise de Conversão
const conversionStats = computed(() => {
  const customers = adminData.value?.customers || []
  const totalProspects = customers.length
  const avgConversion = 38 // Média simulada
  const avgPrice = 65 // Preço médio das campanhas
  
  return {
    totalProspects,
    avgConversionRate: avgConversion,
    potentialRevenue: totalProspects * avgPrice * (avgConversion / 100) * 6 // 6 campanhas
  }
})

const campaignPerformance = computed(() => [
  {
    name: 'Claro Controle Cartão',
    icon: 'mdi-cellphone',
    color: 'red',
    prospects: 7,
    conversion: 45,
    canAfford: 6,
    revenue: 7 * 41.93 * 0.45
  },
  {
    name: 'Claro Internet 500MB',
    icon: 'mdi-wifi',
    color: 'blue',
    prospects: 5,
    conversion: 35,
    canAfford: 4,
    revenue: 5 * 74.93 * 0.35
  },
  {
    name: 'Combo Total',
    icon: 'mdi-package-variant',
    color: 'purple',
    prospects: 4,
    conversion: 50,
    canAfford: 3,
    revenue: 4 * 119.94 * 0.50
  },
  {
    name: 'Pós-Pago 50GB',
    icon: 'mdi-star',
    color: 'orange',
    prospects: 2,
    conversion: 60,
    canAfford: 2,
    revenue: 2 * 95.92 * 0.60
  },
  {
    name: 'Controle Light',
    icon: 'mdi-leaf',
    color: 'green',
    prospects: 6,
    conversion: 40,
    canAfford: 5,
    revenue: 6 * 25.94 * 0.40
  },
  {
    name: 'Streaming Combo',
    icon: 'mdi-play-circle',
    color: 'cyan',
    prospects: 8,
    conversion: 42,
    canAfford: 7,
    revenue: 8 * 46.35 * 0.42
  }
])

// Dados para Análise de Riscos
const riskStats = computed(() => {
  const customers = adminData.value?.customers || []
  return {
    highRisk: customers.filter(c => c.score < 30).length,
    mediumRisk: customers.filter(c => c.score >= 30 && c.score < 60).length,
    lowRisk: customers.filter(c => c.score >= 60).length
  }
})

const scoreTiers = computed(() => {
  const customers = adminData.value?.customers || []
  const total = customers.length || 1
  
  const bronze = customers.filter(c => c.score < 30).length
  const prata = customers.filter(c => c.score >= 30 && c.score < 50).length
  const ouro = customers.filter(c => c.score >= 50 && c.score < 80).length
  const diamante = customers.filter(c => c.score >= 80).length
  
  return [
    {
      name: 'Bronze',
      icon: 'mdi-medal',
      color: 'brown',
      range: '0-29',
      count: bronze,
      percentage: Math.round((bronze / total) * 100)
    },
    {
      name: 'Prata',
      icon: 'mdi-shield',
      color: 'grey-darken-1',
      range: '30-49',
      count: prata,
      percentage: Math.round((prata / total) * 100)
    },
    {
      name: 'Ouro',
      icon: 'mdi-trophy',
      color: 'orange-darken-2',
      range: '50-79',
      count: ouro,
      percentage: Math.round((ouro / total) * 100)
    },
    {
      name: 'Diamante',
      icon: 'mdi-diamond-stone',
      color: 'cyan-darken-2',
      range: '80-100',
      count: diamante,
      percentage: Math.round((diamante / total) * 100)
    }
  ]
})

const riskCustomers = computed(() => {
  const customers = adminData.value?.customers || []
  return customers
    .filter(c => c.score < 60)
    .map(c => ({
      ...c,
      riskLevel: c.score < 30 ? 'high' : 'medium',
      riskReason: c.score < 30 ? 'Score Muito Baixo' : 'Score Médio/Baixo'
    }))
    .slice(0, 5) // Top 5 em risco
})

onMounted(async () => {
  // Verifica se é usuário PJ
  if (authStore.user?.type !== 'PJ') {
    router.push('/dashboard')
    return
  }
  
  await loadAdminData()
})

async function loadAdminData() {
  try {
    const response = await api.get('/admin/customers', {
      headers: {
        'user-email': authStore.user.email
      }
    })
    
    if (response.data.success) {
      adminData.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar dados administrativos:', error)
  }
}

function viewCustomer(customer) {
  selectedCustomer.value = customer
  customerDialog.value = true
}

function getScoreColor(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function exportData() {
  // Simples export CSV
  const csv = [
    ['Nome', 'Email', 'Telefone', 'Score', 'Saldo', 'Recargas', 'Total Recargas'].join(','),
    ...filteredCustomers.value.map(c => 
      [c.name, c.email, c.phone, c.score, c.balance, c.stats.rechargeCount, c.stats.totalRecharges].join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `clientes-flowbank-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

function logout() {
  authStore.logout()
  router.push('/login')
}

// Funções para insights do cliente
function getClientTier(score) {
  if (score >= 80) return 'Diamante'
  if (score >= 60) return 'Ouro'
  if (score >= 40) return 'Prata'
  return 'Bronze'
}

function getClientInsightColor(customer) {
  const score = customer.score
  if (score >= 80) return { bg: 'cyan-lighten-5', icon: 'cyan-darken-2', iconName: 'mdi-diamond-stone' }
  if (score >= 60) return { bg: 'orange-lighten-5', icon: 'orange-darken-2', iconName: 'mdi-medal' }
  if (score >= 40) return { bg: 'grey-lighten-3', icon: 'grey-darken-2', iconName: 'mdi-shield' }
  return { bg: 'brown-lighten-4', icon: 'brown-darken-2', iconName: 'mdi-trophy-variant' }
}

function getEngagementLevel(customer) {
  const recharges = customer.stats?.rechargeCount || 0
  if (recharges >= 5) return 'Muito Alto'
  if (recharges >= 3) return 'Alto'
  if (recharges >= 1) return 'Médio'
  return 'Baixo'
}

function getConversionPotential(customer) {
  const score = customer.score
  const recharges = customer.stats?.rechargeCount || 0
  
  if (score >= 80 && recharges >= 3) return 'Muito Alto'
  if (score >= 60 && recharges >= 2) return 'Alto'
  if (score >= 40) return 'Médio'
  return 'Baixo'
}

function getRecommendation(customer) {
  const score = customer.score
  const recharges = customer.stats?.rechargeCount || 0
  const totalRecharges = customer.stats?.totalRecharges || 0
  
  if (score >= 80 && recharges >= 3) {
    return 'Cliente premium! Ofereça planos Pós-Pago e Combo Total com vantagens exclusivas.'
  }
  if (score >= 60 && recharges >= 2) {
    return 'Bom potencial! Sugira upgrade para Controle Cartão ou Internet 500MB.'
  }
  if (score >= 40 && totalRecharges > 100) {
    return 'Cliente ativo com score médio. Incentive com promoções de fidelidade.'
  }
  if (recharges >= 3) {
    return 'Alto engajamento mas score baixo. Ofereça produtos Light com cashback.'
  }
  return 'Baixo engajamento. Mantenha relacionamento com ofertas de entrada (Light).'
}

function getRecommendationColor(customer) {
  const potential = getConversionPotential(customer)
  if (potential === 'Muito Alto') return 'success'
  if (potential === 'Alto') return 'primary'
  if (potential === 'Médio') return 'warning'
  return 'grey'
}

function getRecommendationIcon(customer) {
  const potential = getConversionPotential(customer)
  if (potential === 'Muito Alto') return 'mdi-star'
  if (potential === 'Alto') return 'mdi-bullseye-arrow'
  if (potential === 'Médio') return 'mdi-information'
  return 'mdi-alert-circle'
}

function viewCampaignsForCustomer(customer) {
  customerDialog.value = false
  router.push('/admin/campanhas')
}
</script>
