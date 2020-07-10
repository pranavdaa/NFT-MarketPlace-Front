/* eslint no-param-reassign: 0 */
import getAxios from "~/plugins/axios"
import TokenModel from "~/components/model/token"

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
        let erc20Tokens = response.data.data.erc20Tokens
        const tokens = [];
        erc20Tokens.forEach(token => tokens.push(new TokenModel(token)))
        commit('erc20Tokens', tokens);
      }
    },

    async fetchBalances({ rootGetters, state, dispatch }, payload = { refresh: false }) {
      const tokens = state.erc20Tokens
      const networks = rootGetters['network/networks']

      for (let i = 0; i < tokens.length; i++) {
        await dispatch('trunk/loadTokenBalance', {
          token: tokens[i],
          refresh: payload.refresh,
          network: networks.main
        }, { root: true })
        await dispatch('trunk/loadTokenBalance', {
          token: tokens[i],
          refresh: payload.refresh,
          network: networks.matic
        }, { root: true })
      }
    },

    async reloadBalances({ dispatch }) {
      await dispatch("trunk/resetBalances", {}, { root: true });
      dispatch("fetchBalances");
    }
  }
}
