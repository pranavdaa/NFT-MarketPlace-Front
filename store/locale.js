/* eslint no-param-reassign: 0 */

export default {
  namespaced: true,

  state: () => {
    return {
      locales: ['en'],
      locale: 'en',
    }
  },

  mutations: {
    set(state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
      }
    },
  },

  getters: {
    current(state) {
      return state.locale
    },
  },
}
