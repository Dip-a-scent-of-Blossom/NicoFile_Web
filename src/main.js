import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {createPinia} from 'pinia'
const app = createApp(App)
const pinia = createPinia()
library.add(fas)

app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
