import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const flowbankTheme = {
  dark: false,
  colors: {
    primary: '#E30613',      // Vermelho FlowBank (Claro)
    secondary: '#1A1A1A',    // Preto elegante
    accent: '#FF4757',       // Vermelho claro
    success: '#2ECC71',      // Verde
    warning: '#F39C12',      // Laranja
    error: '#E74C3C',        // Vermelho erro
    info: '#3498DB',         // Azul
    background: '#F8F9FA',   // Cinza claro
    surface: '#FFFFFF',      // Branco
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'flowbankTheme',
    themes: {
      flowbankTheme
    }
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; font-weight: 500;',
      rounded: 'lg'
    },
    VCard: {
      rounded: 'lg',
      elevation: 2
    },
    VTextField: {
      variant: 'outlined',
      color: 'primary'
    }
  }
})
