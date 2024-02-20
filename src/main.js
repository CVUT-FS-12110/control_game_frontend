/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// vuex store
import { stateStore } from '@/logic/stateStore'

const app = createApp(App)

registerPlugins(app)

app.use(stateStore)
app.mount('#app')

