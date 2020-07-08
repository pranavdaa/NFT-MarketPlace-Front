/* eslint no-param-reassign: 0 */
import getAxios from "~/plugins/axios"

export default {
  namespaced: true,

  state: () => {
    return {
      erc20Tokens: []
    }
  },

  mutations: {
    erc20Tokens(state, tokens) {
      state.erc20Tokens = tokens
    },

  },

  getters: {
    erc20Tokens(state) {
      return state.erc20Tokens
    },
  },
  actions: {
    async fetchERC20Tokens({ commit }) {
      const response = await getAxios().get('erc20tokens/')
      if (response.status === 200 && response.data.data.erc20Tokens) {
        commit('erc20Tokens', response.data.data.erc20Tokens);
      }
    }
  }
}
