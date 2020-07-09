export default {
  namespaced: true,

  state: () => {
    return {
      account: null
    }
  },

  getters: {
    account(state) {
      return state.account
    }
  },

  mutations: {
    account(state, account) {
      state.account = account
    }
  }
}
