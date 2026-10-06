import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n/index'
import App from './App.vue'
import './styles/main.css'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource-variable/noto-serif-sc'
import '@fontsource/zcool-kuaile/400.css'
import '@fontsource/zcool-qingke-huangyou/400.css'
import '@fontsource/ma-shan-zheng/400.css'
import './styles/fonts.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
