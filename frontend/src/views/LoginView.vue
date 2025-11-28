<template>
  <v-app>
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Lado Esquerdo - Branding -->
        <v-col cols="12" md="6" class="bg-gradient d-none d-md-flex align-center justify-center">
          <div class="text-center pa-8">
            <div class="logo-container mb-8">
              <v-icon size="80" color="white">mdi-wave</v-icon>
              <h1 class="text-h2 font-weight-bold text-white mt-4">FlowBank</h1>
            </div>
            
            <h2 class="text-h5 text-white font-weight-light mb-8">
              Seu dinheiro em movimento,<br>sua vida conectada
            </h2>

            <!-- Onboarding Slides -->
            <v-card class="pa-6 mt-12" color="rgba(255,255,255,0.1)" elevation="0">
              <v-window v-model="slide" show-arrows>
                <v-window-item v-for="(item, i) in slides" :key="i">
                  <div class="text-center py-4">
                    <v-icon size="64" color="white">{{ item.icon }}</v-icon>
                    <h3 class="text-h6 text-white mt-4">{{ item.title }}</h3>
                    <p class="text-white text-body-2 mt-2">{{ item.text }}</p>
                  </div>
                </v-window-item>
              </v-window>
              
              <div class="text-center mt-4">
                <v-btn
                  v-for="n in slides.length"
                  :key="n"
                  :color="slide === n - 1 ? 'white' : 'rgba(255,255,255,0.5)'"
                  size="x-small"
                  icon
                  class="mx-1"
                  @click="slide = n - 1"
                >
                  <v-icon>mdi-circle</v-icon>
                </v-btn>
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- Lado Direito - Login -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center">
          <v-card flat max-width="450" width="100%" class="pa-8">
            <!-- Logo Mobile -->
            <div class="text-center mb-8 d-md-none">
              <v-icon size="60" color="primary">mdi-wave</v-icon>
              <h1 class="text-h4 font-weight-bold text-primary mt-2">FlowBank</h1>
            </div>

            <h2 class="text-h4 font-weight-bold mb-2">Bem-vindo!</h2>
            <p class="text-body-1 text-medium-emphasis mb-8">
              Entre com suas credenciais para acessar
            </p>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                :error-messages="errors.email"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :error-messages="errors.password"
                class="mb-2"
                required
              />

              <div class="text-right mb-6">
                <a href="#" class="text-primary text-decoration-none text-body-2">
                  Esqueceu a senha?
                </a>
              </div>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                Entrar
              </v-btn>

              <v-divider class="my-6" />

              <!-- Usuários de Teste -->
              <div class="text-center">
                <p class="text-body-2 text-medium-emphasis mb-3">Usuários de teste:</p>
                <v-chip
                  v-for="user in testUsers"
                  :key="user.email"
                  size="small"
                  class="ma-1"
                  @click="fillCredentials(user.email)"
                  clickable
                >
                  {{ user.name }}
                </v-chip>
              </div>
            </v-form>

            <!-- Alerta de erro -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('senha123')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({})
const slide = ref(0)

const slides = [
  {
    icon: 'mdi-close-circle',
    title: 'Sem burocracia',
    text: 'Não precisa de carteira assinada ou comprovante de renda'
  },
  {
    icon: 'mdi-brain',
    title: 'Crédito inteligente',
    text: 'Baseado no seu comportamento digital do dia a dia'
  },
  {
    icon: 'mdi-connection',
    title: 'Sempre conectado',
    text: 'Seu dinheiro trabalhando junto com sua vida'
  }
]

const testUsers = [
  { name: 'João (PF)', email: 'joao@email.com' },
  { name: 'Maria (PF)', email: 'maria@email.com' },
  { name: 'Carlos (PF)', email: 'carlos@email.com' },
  { name: 'Empresa (PJ)', email: 'empresa@email.com' }
]

function fillCredentials(userEmail) {
  email.value = userEmail
  password.value = 'senha123'
}

async function handleLogin() {
  errors.value = {}
  errorMessage.value = ''

  if (!email.value) {
    errors.value.email = 'Email é obrigatório'
    return
  }

  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
    return
  }

  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      errorMessage.value = result.message || 'Erro ao fazer login'
    }
  } catch (error) {
    errorMessage.value = 'Erro ao conectar com o servidor'
  } finally {
    loading.value = false
  }
}

// Auto-slide
setInterval(() => {
  slide.value = (slide.value + 1) % slides.length
}, 4000)
</script>

<style scoped>
.logo-container {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>
