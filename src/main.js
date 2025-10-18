import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'

// --- Styles PrimeVue (Obligatoires) ---

// 🚨 CORRIGÉ : L'importation '@primevue/themes/aura/theme.css' qui causait une erreur de résolution a été supprimée.
// Nous conservons votre importation de thème locale (primevue-aura.css) et les autres styles.
import './assets/primevue-aura.css'; // Votre thème local PrimeVue 4.x
import 'primeicons/primeicons.css'     // Icônes PrimeIcons
import 'primeflex/primeflex.css'       // Utilitaires CSS PrimeFlex
import './assets/main.css'             // Votre CSS personnel/global

// --- Importation des Composants Globaux ---
import Menubar from 'primevue/menubar'


const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, { ripple: true })
app.use(router)

// Enregistrement global des composants
app.component('MenubarDashboard', Menubar)



app.mount('#app')
