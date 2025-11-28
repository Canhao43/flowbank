<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" elevation="1">
      <v-app-bar-nav-icon 
        @click="drawer = !drawer" 
        class="d-lg-none" 
      />
      
      <v-app-bar-title class="d-flex align-center">
        <v-icon color="primary" :size="isMobile ? 28 : 32" class="mr-2">mdi-wave</v-icon>
        <span class="text-primary font-weight-bold" :class="isMobile ? 'text-h6' : ''">FlowBank</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn icon="mdi-bell-outline" variant="text" :size="isMobile ? 'small' : 'default'" />
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" class="ml-2" :size="isMobile ? 'small' : 'default'">
            <v-avatar :size="isMobile ? 32 : 36" class="mr-2">
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
    <v-navigation-drawer 
      v-model="drawer" 
      :permanent="!isMobile" 
      :temporary="isMobile"
      color="background"
    >
      <v-list nav density="comfortable">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/dashboard"
          active-class="text-primary bg-red-lighten-5"
          @click="isMobile ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-receipt-text"
          title="Extrato"
          value="extrato"
          to="/extrato"
          active-class="text-primary bg-red-lighten-5"
          @click="isMobile ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-cash-multiple"
          title="Pagamentos"
          value="pagamentos"
          to="/pagamentos"
          active-class="text-primary bg-red-lighten-5"
          @click="isMobile ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-hand-coin"
          title="Empréstimo"
          value="emprestimo"
          to="/emprestimo"
          active-class="text-primary bg-red-lighten-5"
          @click="isMobile ? drawer = false : null"
        />
        <v-list-item
          prepend-icon="mdi-gift"
          title="Benefícios"
          value="beneficios"
          to="/beneficios"
          active-class="text-primary bg-red-lighten-5"
          @click="isMobile ? drawer = false : null"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid :class="isMobile ? 'pa-3' : 'pa-6'">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDisplay } from 'vuetify'

const router = useRouter()
const authStore = useAuthStore()
const { mobile, mdAndDown } = useDisplay()

const drawer = ref(true)
const isMobile = computed(() => mdAndDown.value)

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
