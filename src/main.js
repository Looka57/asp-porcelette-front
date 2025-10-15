import { createApp } from 'vue'
import './assets/main.css' // <-- Importation unique de Tailwind/Styles locaux
import './assets/primevue-aura.css';
import 'primeicons/primeicons.css'; // <-- Icônes PrimeVue
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'

// --- Styles PrimeVue (Obligatoires) ---

// Importation du fichier de thème téléchargé localement dans src/assets
import './assets/primevue-aura.css';

// PrimeIcons : Obligatoire pour les icônes
import 'primeicons/primeicons.css';

// L'ancienne importation en double './assets/main.css' a été supprimée ici.

// --- Importation des Composants Globaux (Ajoutez les vôtres ici) ---
// import Button from 'primevue/button';
import Menubar from 'primevue/menubar';

const app = createApp(App)
// const pinia = createPinia()

app.use(createPinia())
app.use(PrimeVue, { ripple: true });
app.use(router)

// app.component('Button', Button);
app.component('MenubarDashboard', Menubar);


app.mount('#app')
