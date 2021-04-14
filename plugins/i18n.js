import Vue from 'vue'
import VueI18n from 'vue-i18n'

// vue i18n mixin
Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    // eslint-disable-line no-param-reassign
    locale: store.getters['locale/current'],
    fallbackLocale: 'en',
    messages: {
      en: require('~/locales/en.json'), // eslint-disable-line global-require
    },
  })
}
