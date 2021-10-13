import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // english
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN' // chinese
import enLocale from './en'
import zhCNLocale from './cn'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  cn: {
    ...zhCNLocale,
    ...elementZhCNLocale
  }
}

const i18n = new VueI18n({
  locale: localStorage.getItem('language_market') || 'en', // set locale
  messages // set locale messages
})

export default i18n
