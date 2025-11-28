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
            <v-icon color="primary" size="32" class="mr-2">mdi-cash-multiple</v-icon>
            Pagamentos
          </h1>
          <p class="text-subtitle-1 text-grey">Pague com PIX, Boleto ou Cartão de Crédito</p>
        </div>

        <!-- Saldo disponível -->
        <v-card class="mb-6" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Saldo disponível</div>
                <div class="text-h4 font-weight-bold text-primary">
                  {{ formatCurrency(balance) }}
                </div>
              </div>
              <v-icon size="48" color="primary">mdi-wallet</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <v-row>
          <!-- Coluna Principal - Formulário de Pagamento -->
          <v-col cols="12" md="8">
            <!-- Seleção de Método de Pagamento -->
            <v-card elevation="2" class="mb-4">
              <v-card-title class="bg-grey-lighten-4">
                <v-icon class="mr-2" color="primary">mdi-credit-card-outline</v-icon>
                Escolha a forma de pagamento
              </v-card-title>
              <v-card-text class="pa-4">
                <v-btn-toggle
                  v-model="paymentMethod"
                  mandatory
                  color="primary"
                  variant="outlined"
                  divided
                  class="w-100"
                >
                  <v-btn value="pix" class="flex-grow-1" size="large">
                    <v-icon start>mdi-qrcode</v-icon>
                    PIX
                  </v-btn>
                  <v-btn value="boleto" class="flex-grow-1" size="large">
                    <v-icon start>mdi-barcode</v-icon>
                    Boleto
                  </v-btn>
                  <v-btn value="cartao" class="flex-grow-1" size="large">
                    <v-icon start>mdi-credit-card</v-icon>
                    Cartão
                  </v-btn>
                </v-btn-toggle>
              </v-card-text>
            </v-card>

            <!-- Formulário PIX -->
            <v-card v-if="paymentMethod === 'pix'" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-qrcode</v-icon>
                Pagar com PIX
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form @submit.prevent="processPixPayment">
                  <v-select
                    v-model="pixForm.keyType"
                    :items="pixKeyTypes"
                    label="Tipo de Chave PIX"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-key"
                  />

                  <v-text-field
                    v-model="pixForm.key"
                    :label="getPixKeyLabel"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="getPixKeyRules"
                    :maxlength="getPixKeyMaxLength"
                    @input="formatPixKey"
                  />

                  <v-text-field
                    v-model="pixForm.amount"
                    label="Valor"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-currency-brl"
                    :rules="[v => !!v || 'Campo obrigatório']"
                    @input="formatPixAmount"
                    placeholder="0,00"
                  />

                  <v-textarea
                    v-model="pixForm.description"
                    label="Descrição (opcional)"
                    outlined
                    dense
                    rows="2"
                    class="mb-4"
                    prepend-inner-icon="mdi-text"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="font-weight-bold"
                  >
                    <v-icon start>mdi-send</v-icon>
                    Pagar {{ pixForm.amount ? 'R$ ' + pixForm.amount : 'R$ 0,00' }}
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Formulário Boleto -->
            <v-card v-if="paymentMethod === 'boleto'" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-barcode</v-icon>
                Pagar Boleto
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form @submit.prevent="processBoletoPayment">
                  <v-text-field
                    v-model="boletoForm.code"
                    label="Código de Barras ou Linha Digitável"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-barcode-scan"
                    :rules="[v => !!v || 'Campo obrigatório', v => v.length >= 44 || 'Código inválido']"
                    counter
                  />

                  <v-alert
                    v-if="boletoInfo"
                    type="info"
                    variant="tonal"
                    class="mb-4"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-bold mb-1">{{ boletoInfo.beneficiary }}</div>
                        <div class="text-caption">Vencimento: {{ boletoInfo.dueDate }}</div>
                      </div>
                      <div class="text-h6 font-weight-bold">
                        {{ formatCurrency(boletoInfo.amount) }}
                      </div>
                    </div>
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="font-weight-bold"
                  >
                    <v-icon start>mdi-check</v-icon>
                    Confirmar Pagamento
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Formulário Cartão de Crédito -->
            <v-card v-if="paymentMethod === 'cartao'" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-credit-card</v-icon>
                Pagar com Cartão de Crédito
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form @submit.prevent="processCardPayment">
                  <v-text-field
                    v-model="cardForm.number"
                    label="Número do Cartão"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-credit-card-outline"
                    :rules="[v => !!v || 'Campo obrigatório']"
                    maxlength="19"
                    @input="formatCardNumber"
                  />

                  <v-text-field
                    v-model="cardForm.name"
                    label="Nome no Cartão"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[v => !!v || 'Campo obrigatório']"
                  />

                  <v-row dense class="mb-4">
                    <v-col cols="6">
                      <v-text-field
                        v-model="cardForm.expiry"
                        label="Validade (MM/AA)"
                        outlined
                        dense
                        prepend-inner-icon="mdi-calendar"
                        maxlength="5"
                        :rules="[v => !!v || 'Campo obrigatório']"
                        @input="formatExpiry"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="cardForm.cvv"
                        label="CVV"
                        outlined
                        dense
                        type="password"
                        prepend-inner-icon="mdi-lock"
                        maxlength="4"
                        :rules="[v => !!v || 'Campo obrigatório']"
                      />
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="cardForm.amount"
                    label="Valor"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-currency-brl"
                    :rules="[v => !!v || 'Campo obrigatório']"
                    @input="formatCardAmount"
                    placeholder="0,00"
                  />

                  <v-select
                    v-model="cardForm.installments"
                    :items="installmentOptions"
                    label="Parcelas"
                    outlined
                    dense
                    class="mb-4"
                    prepend-inner-icon="mdi-calendar-multiple"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="font-weight-bold"
                  >
                    <v-icon start>mdi-credit-card-check</v-icon>
                    Pagar {{ getTotalCardAmount() }}
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Coluna Lateral - Histórico e Dicas -->
          <v-col cols="12" md="4">
            <!-- Pagamentos Recentes -->
            <v-card elevation="2" class="mb-4">
              <v-card-title>
                <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                Pagamentos Recentes
              </v-card-title>
              <v-list lines="two">
                <v-list-item
                  v-for="payment in recentPayments"
                  :key="payment.id"
                  class="border-b"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="payment.color" size="40">
                      <v-icon color="white">{{ payment.icon }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ payment.description }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    {{ formatDate(payment.date) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="text-right">
                      <div class="font-weight-bold text-error">
                        - {{ formatCurrency(payment.amount) }}
                      </div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Dicas de Segurança -->
            <v-card elevation="2">
              <v-card-title>
                <v-icon class="mr-2" color="warning">mdi-shield-alert</v-icon>
                Dicas de Segurança
              </v-card-title>
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success" size="small">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Verifique os dados antes de confirmar
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success" size="small">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Nunca compartilhe seu CVV
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success" size="small">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Confira o saldo antes de pagar
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success" size="small">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    PIX tem limite de R$ 1.000 por transação
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog de Confirmação -->
        <v-dialog v-model="confirmDialog" max-width="500">
          <v-card>
            <v-card-title class="bg-success text-white">
              <v-icon class="mr-2" color="white">mdi-check-circle</v-icon>
              Pagamento Realizado!
            </v-card-title>
            <v-card-text class="pa-6 text-center">
              <v-icon size="80" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
              <h3 class="text-h5 mb-2">Sucesso!</h3>
              <p class="text-body-1 mb-4">
                Seu pagamento de <strong>{{ formatCurrency(lastPaymentAmount) }}</strong> foi processado com sucesso.
              </p>
              <v-chip color="success" variant="tonal" class="mb-2">
                {{ paymentMethodLabel }}
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" variant="text" @click="confirmDialog = false">
                Fechar
              </v-btn>
              <v-btn color="primary" @click="viewReceipt">
                Ver Comprovante
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de Comprovante -->
        <v-dialog v-model="receiptDialog" max-width="500">
          <v-card>
            <v-card-title class="d-flex align-center bg-success pa-4">
              <v-icon size="32" class="mr-2">mdi-check-circle</v-icon>
              <span class="text-h6">Comprovante de Pagamento</span>
            </v-card-title>
            
            <v-card-text class="pa-6" v-if="receiptData">
              <!-- Status -->
              <div class="text-center mb-6">
                <v-chip color="success" size="large" variant="flat">
                  <v-icon start>mdi-check</v-icon>
                  Pagamento Aprovado
                </v-chip>
              </div>

              <!-- Valor -->
              <div class="text-center mb-6">
                <div class="text-caption text-grey mb-1">Valor</div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ formatCurrency(receiptData.amount) }}
                </div>
              </div>

              <v-divider class="mb-4" />

              <!-- Detalhes -->
              <v-list density="compact" class="bg-transparent">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>{{ receiptData.type === 'PIX' ? 'mdi-qrcode' : receiptData.type === 'Boleto' ? 'mdi-barcode' : 'mdi-credit-card' }}</v-icon>
                  </template>
                  <v-list-item-title class="text-caption text-grey">Tipo de Pagamento</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ receiptData.type }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>{{ receiptData.type === 'PIX' ? 'mdi-key' : 'mdi-account' }}</v-icon>
                  </template>
                  <v-list-item-title class="text-caption text-grey">{{ receiptData.keyType }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ receiptData.key }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title class="text-caption text-grey">Data e Hora</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ receiptData.date.toLocaleString('pt-BR') }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-identifier</v-icon>
                  </template>
                  <v-list-item-title class="text-caption text-grey">ID da Transação</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ receiptData.id }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="receiptData.description && receiptData.description !== '-'">
                  <template v-slot:prepend>
                    <v-icon>mdi-text</v-icon>
                  </template>
                  <v-list-item-title class="text-caption text-grey">Descrição</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ receiptData.description }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" />

              <!-- Informações do Banco -->
              <div class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-icon color="primary" size="24" class="mr-2">mdi-wave</v-icon>
                  <span class="text-h6 text-primary font-weight-bold">FlowBank</span>
                </div>
                <div class="text-caption text-grey">
                  Banco Digital - CNPJ: 12.345.678/0001-90
                </div>
                <div class="text-caption text-grey">
                  Central de Atendimento: 0800 123 4567
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                variant="tonal"
                color="primary"
                @click="downloadReceipt"
              >
                <v-icon start>mdi-download</v-icon>
                Baixar
              </v-btn>
              <v-btn
                variant="tonal"
                color="primary"
                @click="shareReceipt"
              >
                <v-icon start>mdi-share-variant</v-icon>
                Compartilhar
              </v-btn>
              <v-spacer />
              <v-btn
                color="primary"
                @click="receiptDialog = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <!-- Snackbar para mensagens -->
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
const paymentMethod = ref('pix')
const loading = ref(false)
const balance = ref(0)
const confirmDialog = ref(false)
const lastPaymentAmount = ref(0)
const recentPayments = ref([])
const boletoInfo = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('error')
const receiptDialog = ref(false)
const receiptData = ref(null)

// Formulários
const pixForm = ref({
  keyType: 'CPF',
  key: '',
  amount: '',
  description: ''
})

const boletoForm = ref({
  code: ''
})

const cardForm = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  amount: '',
  installments: 1
})

const pixKeyTypes = [
  { title: 'CPF/CNPJ', value: 'CPF' },
  { title: 'E-mail', value: 'EMAIL' },
  { title: 'Telefone', value: 'PHONE' },
  { title: 'Chave Aleatória', value: 'RANDOM' }
]

const installmentOptions = computed(() => {
  if (!cardForm.value.amount) return [{ title: '1x sem juros', value: 1 }]
  
  // Converte valor formatado para número
  const amount = parseFloat(cardForm.value.amount.replace(/\./g, '').replace(',', '.'))
  const options = []
  
  // Taxa de juros: 2.99% ao mês
  const monthlyInterestRate = 0.0299
  
  for (let i = 1; i <= 12; i++) {
    let installmentValue
    let totalWithInterest
    
    if (i === 1) {
      // 1x sem juros
      installmentValue = amount
      totalWithInterest = amount
      options.push({
        title: `1x de ${formatCurrency(installmentValue)} sem juros`,
        value: 1,
        total: totalWithInterest
      })
    } else {
      // Com juros compostos
      const interestFactor = Math.pow(1 + monthlyInterestRate, i)
      totalWithInterest = amount * interestFactor
      installmentValue = totalWithInterest / i
      
      options.push({
        title: `${i}x de ${formatCurrency(installmentValue)} (total: ${formatCurrency(totalWithInterest)})`,
        value: i,
        total: totalWithInterest
      })
    }
  }
  
  return options
})

const getPixKeyLabel = computed(() => {
  const labels = {
    'CPF': 'CPF/CNPJ',
    'EMAIL': 'E-mail',
    'PHONE': 'Telefone',
    'RANDOM': 'Chave Aleatória'
  }
  return labels[pixForm.value.keyType] || 'Chave PIX'
})

const formatPixKey = (event) => {
  let value = pixForm.value.key.replace(/\D/g, '')
  
  if (pixForm.value.keyType === 'CPF') {
    // CPF: 000.000.000-00 (11 dígitos)
    // CNPJ: 00.000.000/0000-00 (14 dígitos)
    if (value.length <= 11) {
      // Formata CPF
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else {
      // Formata CNPJ
      value = value.slice(0, 14)
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    }
  } else if (pixForm.value.keyType === 'PHONE') {
    // Telefone: (00) 00000-0000
    value = value.slice(0, 11)
    value = value.replace(/^(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
  }
  
  pixForm.value.key = value
}

const formatPixAmount = (event) => {
  let value = pixForm.value.amount.replace(/\D/g, '')
  
  if (value === '') {
    pixForm.value.amount = ''
    return
  }
  
  // Converte para número e formata
  const numberValue = parseInt(value) / 100
  pixForm.value.amount = numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatCardAmount = (event) => {
  let value = cardForm.value.amount.replace(/\D/g, '')
  
  if (value === '') {
    cardForm.value.amount = ''
    return
  }
  
  // Converte para número e formata
  const numberValue = parseInt(value) / 100
  cardForm.value.amount = numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getPixKeyMaxLength = computed(() => {
  if (pixForm.value.keyType === 'CPF') {
    return 18 // CPF: 14 caracteres, CNPJ: 18 caracteres
  } else if (pixForm.value.keyType === 'PHONE') {
    return 15 // (00) 00000-0000
  }
  return undefined
})

const getPixKeyRules = computed(() => {
  const rules = [v => !!v || 'Campo obrigatório']
  
  if (pixForm.value.keyType === 'CPF') {
    rules.push(v => {
      const digits = v.replace(/\D/g, '')
      return (digits.length === 11 || digits.length === 14) || 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'
    })
  } else if (pixForm.value.keyType === 'EMAIL') {
    rules.push(v => v.includes('@') || 'E-mail deve conter @')
    rules.push(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido')
  } else if (pixForm.value.keyType === 'PHONE') {
    rules.push(v => {
      const digits = v.replace(/\D/g, '')
      return digits.length === 11 || 'Telefone deve ter 11 dígitos'
    })
  }
  
  return rules
})

const paymentMethodLabel = computed(() => {
  const labels = {
    'pix': 'PIX',
    'boleto': 'Boleto',
    'cartao': 'Cartão de Crédito'
  }
  return labels[paymentMethod.value]
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getTotalCardAmount = () => {
  if (!cardForm.value.amount) return 'R$ 0,00'
  
  const amount = parseFloat(cardForm.value.amount.replace(/\./g, '').replace(',', '.'))
  
  if (cardForm.value.installments === 1) {
    return formatCurrency(amount)
  }
  
  // Calcula com juros
  const monthlyInterestRate = 0.0299
  const interestFactor = Math.pow(1 + monthlyInterestRate, cardForm.value.installments)
  const totalWithInterest = amount * interestFactor
  
  return formatCurrency(totalWithInterest)
}

const formatCardNumber = (event) => {
  let value = cardForm.value.number.replace(/\s/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardForm.value.number = formattedValue
}

const formatExpiry = (event) => {
  let value = cardForm.value.expiry.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  cardForm.value.expiry = value
}

const processPixPayment = async () => {
  loading.value = true
  
  try {
    // Converte valor formatado para número
    const amountValue = parseFloat(pixForm.value.amount.replace(/\./g, '').replace(',', '.'))
    
    // Valida saldo
    if (amountValue > balance.value) {
      alert(`Saldo insuficiente! Você tem ${formatCurrency(balance.value)} disponível.`)
      loading.value = false
      return
    }
    
    const result = await transactionService.makePayment(authStore.user.email, {
      description: `PIX para ${pixForm.value.key}${pixForm.value.description ? ' - ' + pixForm.value.description : ''}`,
      amount: amountValue,
      category: 'Transferência',
      paymentMethod: 'pix'
    })
    
    if (result.success) {
      lastPaymentAmount.value = amountValue
      balance.value = result.data.newBalance
      
      // Prepara dados do comprovante
      receiptData.value = {
        id: result.data.transaction.id,
        type: 'PIX',
        key: pixForm.value.key,
        keyType: pixForm.value.keyType,
        amount: amountValue,
        description: pixForm.value.description || '-',
        date: new Date(),
        status: 'approved'
      }
      
      // Adiciona ao histórico local
      recentPayments.value.unshift({
        id: result.data.transaction.id,
        description: result.data.transaction.description,
        amount: Math.abs(result.data.transaction.amount),
        date: result.data.transaction.date,
        icon: 'mdi-qrcode',
        color: 'primary'
      })
      
      if (recentPayments.value.length > 5) {
        recentPayments.value = recentPayments.value.slice(0, 5)
      }
      
      confirmDialog.value = true
      
      // Limpa formulário
      pixForm.value = {
        keyType: 'CPF',
        key: '',
        amount: '',
        description: ''
      }
    } else {
      snackbarMessage.value = result.message || 'Erro ao processar pagamento'
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  } catch (error) {
    console.error('Erro ao processar PIX:', error)
    snackbarMessage.value = 'Erro ao processar pagamento. Tente novamente.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const processBoletoPayment = async () => {
  loading.value = true
  
  try {
    // Simula leitura do boleto
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock de informações do boleto
    boletoInfo.value = {
      beneficiary: 'Empresa XYZ LTDA',
      dueDate: '30/11/2025',
      amount: 450.00
    }
    
    // Valida saldo
    if (boletoInfo.value.amount > balance.value) {
      snackbarMessage.value = `Saldo insuficiente! Você tem ${formatCurrency(balance.value)} disponível.`
      snackbarColor.value = 'error'
      snackbar.value = true
      loading.value = false
      boletoForm.value.code = ''
      boletoInfo.value = null
      return
    }
    
    const result = await transactionService.makePayment(authStore.user.email, {
      description: `Boleto - ${boletoInfo.value.beneficiary}`,
      amount: boletoInfo.value.amount,
      category: 'Contas',
      paymentMethod: 'boleto'
    })
    
    if (result.success) {
      lastPaymentAmount.value = boletoInfo.value.amount
      balance.value = result.data.newBalance
      
      // Prepara dados do comprovante
      receiptData.value = {
        id: result.data.transaction.id,
        type: 'Boleto',
        key: boletoInfo.value.beneficiary,
        keyType: 'Beneficiário',
        amount: boletoInfo.value.amount,
        description: `Vencimento: ${boletoInfo.value.dueDate}`,
        date: new Date(),
        status: 'approved'
      }
      
      recentPayments.value.unshift({
        id: result.data.transaction.id,
        description: result.data.transaction.description,
        amount: Math.abs(result.data.transaction.amount),
        date: result.data.transaction.date,
        icon: 'mdi-barcode',
        color: 'orange'
      })
      
      if (recentPayments.value.length > 5) {
        recentPayments.value = recentPayments.value.slice(0, 5)
      }
      
      confirmDialog.value = true
      
      boletoForm.value.code = ''
      boletoInfo.value = null
    } else {
      snackbarMessage.value = result.message || 'Erro ao processar pagamento'
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  } catch (error) {
    console.error('Erro ao processar Boleto:', error)
    snackbarMessage.value = 'Erro ao processar pagamento. Tente novamente.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const processCardPayment = async () => {
  loading.value = true
  
  try {
    // Converte valor formatado para número
    const amountValue = parseFloat(cardForm.value.amount.replace(/\./g, '').replace(',', '.'))
    
    // Calcula valor total com juros
    const monthlyInterestRate = 0.0299
    let totalAmount = amountValue
    
    if (cardForm.value.installments > 1) {
      const interestFactor = Math.pow(1 + monthlyInterestRate, cardForm.value.installments)
      totalAmount = amountValue * interestFactor
    }
    
    // Valida saldo
    if (totalAmount > balance.value) {
      snackbarMessage.value = `Saldo insuficiente! Você tem ${formatCurrency(balance.value)} disponível.`
      snackbarColor.value = 'error'
      snackbar.value = true
      loading.value = false
      return
    }
    
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
        'user-email': authStore.user.email
      },
      body: JSON.stringify({
        description: `Cartão Final ${cardForm.value.number.slice(-4)} - ${cardForm.value.installments}x`,
        amount: totalAmount,
        category: 'Compras',
        paymentMethod: 'card',
        installments: cardForm.value.installments,
        monthlyPayment: totalAmount / cardForm.value.installments,
        totalAmount: totalAmount
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      const installmentValue = totalAmount / cardForm.value.installments
      
      lastPaymentAmount.value = totalAmount
      balance.value = result.data.newBalance
      
      // Prepara dados do comprovante
      receiptData.value = {
        id: result.data.transaction.id,
        type: 'Cartão de Crédito',
        key: `**** **** **** ${cardForm.value.number.slice(-4)}`,
        keyType: 'Cartão',
        amount: totalAmount,
        description: cardForm.value.installments === 1 
          ? '1x sem juros' 
          : `${cardForm.value.installments}x de ${formatCurrency(installmentValue)} (total: ${formatCurrency(totalAmount)})`,
        date: new Date(),
        status: 'approved'
      }
      
      recentPayments.value.unshift({
        id: result.data.transaction.id,
        description: result.data.transaction.description,
        amount: Math.abs(result.data.transaction.amount),
        date: result.data.transaction.date,
        icon: 'mdi-credit-card',
        color: 'purple'
      })
      
      if (recentPayments.value.length > 5) {
        recentPayments.value = recentPayments.value.slice(0, 5)
      }
      
      confirmDialog.value = true
      
      cardForm.value = {
        number: '',
        name: '',
        expiry: '',
        cvv: '',
        amount: '',
        installments: 1
      }
    } else {
      snackbarMessage.value = result.message || 'Erro ao processar pagamento'
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  } catch (error) {
    console.error('Erro ao processar Cartão:', error)
    snackbarMessage.value = 'Erro ao processar pagamento. Tente novamente.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const viewReceipt = () => {
  confirmDialog.value = false
  receiptDialog.value = true
}

const downloadReceipt = () => {
  // Simula download do comprovante
  snackbarMessage.value = 'Comprovante baixado com sucesso!'
  snackbarColor.value = 'success'
  snackbar.value = true
}

const shareReceipt = () => {
  // Simula compartilhamento
  snackbarMessage.value = 'Link de compartilhamento copiado!'
  snackbarColor.value = 'success'
  snackbar.value = true
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchUserData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/user/dashboard', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'user-email': authStore.user.email
      }
    })
    
    const result = await response.json()
    if (result.success) {
      balance.value = result.data.balance
      
      // Pega últimas transações de pagamento
      recentPayments.value = result.data.recentTransactions
        .filter(t => t.type === 'debit')
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          description: t.description,
          amount: Math.abs(t.amount),
          date: t.date,
          icon: t.icon,
          color: 'primary'
        }))
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
