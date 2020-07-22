/* eslint no-param-reassign: 0 */
import Vue from "vue"
import BigNumber from "~/plugins/bignumber"
import {
  getBalance as getAccountBalancePromise,
  getContractCode
} from "~/plugins/helpers/transaction-utils"

// Zero balance
const ZeroBalance = new BigNumber(0)

export default {
  namespaced: true,

  state: () => {
    return {
      tokenBalance: {},
      contractObject: {},
      contractCode: {}
    }
  },

  mutations: {
    resetCache(state, { which, value = {} }) {
      state[which] = value
    },

    removeCache(state, { which, id }) {
      Vue.delete(state[which], id)
    },

    setCache(state, { which, id, value }) {
      Vue.set(state[which], id, value)
    }
  },

  getters: {
    tokenBalance(state, getters, rootState, rootGetters) {
      return (address, networkId) => {
        return (
          state.tokenBalance[`${networkId}:${address.toLowerCase()}`] ||
          ZeroBalance
        )
      }
    },

    contractCode(state, getters, rootState, rootGetters) {
      return (address, networkId) => {
        return state.contractCode[`${networkId}:${address.toLowerCase()}`]
      }
    },

    contractObject(state, getters, rootState, rootGetters) {
      return (address, networkId) => {
        return state.contractObject[`${networkId}:${address.toLowerCase()}`]
      }
    }
  },

  actions: {
    async networkChanged({ commit }) {
      commit("resetCache", { which: "accountBalance" })
      commit("resetCache", { which: "tokenBalance" })
      commit("resetCache", { which: "contractObject" })
      commit("resetCache", { which: "contractCode" })
    },

    async loadTokenBalance(
      { state, commit, rootGetters },
      { address, token, refresh = false, network }
    ) {
      if (!network) {
        return
      }

      const tokenAddress = token.getAddress(network.id)
      if (!tokenAddress) {
        return ZeroBalance
      }
      const cacheId = `${network.id}:${tokenAddress.toLowerCase()}`
      if (refresh) {
        // remove balance
        commit("resetCache", { which: "tokenBalance" })
        commit("resetCache", { which: "contractObject" })
      }

      let result = state.tokenBalance[cacheId]
      if (result) {
        return result
      }

      result = ZeroBalance
      try {
        const accountAddress = address || rootGetters["account/account"].address

        // Fetch balance
        let r = null
        // if (token.isEther && !network.isMatic || token.isMatic && network.isMatic) {
        if (token.isEther && !network.isMatic) {
          r = await getAccountBalancePromise(network, accountAddress)
        } else {
          const c = await token.getContract(network)
          r = await c.methods.balanceOf(accountAddress).call()
        }

        result = new BigNumber(r)
      } catch (e) {
        console.error("error::loadTokenBalance", e)
      }

      commit("setCache", {
        which: "tokenBalance",
        id: cacheId,
        value: result
      })

      return result
    },

    async fetchERC20ContractObject(
      { state, commit, rootGetters },
      { address, network }
    ) {
      const cacheId = `${network.id}:${address.toLowerCase()}`
      let result = state.contractObject[cacheId]
      if (result) {
        return result
      }

      const networkMeta = rootGetters['network/networkMeta']
      const web3 = network.web3
      result = new web3.eth.Contract(networkMeta.abi("ChildERC20"), address.toLowerCase())
      commit("setCache", {
        which: "contractObject",
        id: cacheId,
        value: result
      })
      return result
    },

    async resetBalances({ commit }) {
      commit("resetCache", { which: "accountBalance" })
      commit("resetCache", { which: "tokenBalance" })
      commit("resetCache", { which: "contractObject" })

    },

    async fetchContractCode(
      { state, commit, rootGetters },
      { address, network }
    ) {
      const cacheId = `${address.toLowerCase()}`
      let result = state.contractCode[cacheId]
      if (result) {
        return result
      }

      result = await getContractCode(network, address)
      commit("setCache", {
        which: "contractCode",
        id: cacheId,
        value: result
      })
      return result
    }
  }
}
