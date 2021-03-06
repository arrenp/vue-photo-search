import { createApp } from 'vue'
import App from './App.vue'
import VueNumberFormat from 'vue-number-format'
import lazyPlugin from 'vue3-lazy'
import loading from './assets/loading.jpg'

createApp(App).use(lazyPlugin, {
    loading: loading,
    error: 'error.png'
}).use(VueNumberFormat, {
    prefix: "",
    suffix: "",
    decimal: ".",
    thousand: ",",
    precision: 0,
    acceptNegative: false,
    isInteger: true,
  }).mount('#app')
