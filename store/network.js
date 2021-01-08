/* eslint no-param-reassign: 0 */
import Web3 from "web3"

// import ENS from "~/plugins/helpers/ens"
import { config as configStore } from "~/plugins/localstore"
import NetworkModel from "~/components/model/network"

const uiconfig = JSON.parse(process.env.uiconfig)

// Default symbol
const DefaultSymbol = "ETH"

export default {
  namespaced: true,

  state: () => {
    return {
      networks: null,
      selectedNetworkKey: null,
      networkMeta: null,
    }
  },

  mutations: {
    networks(state, networks) {
      state.networks = networks
    },
    selectedNetworkKey(state, selectedNetworkKey) {
      configStore.set("selectedNetworkKey", selectedNetworkKey)
      state.selectedNetworkKey = selectedNetworkKey
    },
    networkMeta(state, networkMeta) {
      state.networkMeta = networkMeta
    }

  },

  getters: {
    selectedNetwork(state) {
      return state.networks[
        state.selectedNetworkKey ||
        configStore.get("selectedNetworkKey") ||
        "matic"
      ]
    },

    selectedNetworkKey(state) {
      return (
        state.selectedNetworkKey ||
        configStore.get("selectedNetworkKey") ||
        "matic"
      )
    },

    rootChainNetwork(state) {
      return state.networks[
        state.selectedNetworkKey ||
        configStore.get("selectedNetworkKey") ||
        "main"
      ]
    },

    networks(state) {
      return state.networks
    },

    networkMeta(state) {
      return state.networkMeta
    }


  },

  actions: {
    async setNetworks({ commit }, networks) {
      if (!networks.main || !networks.matic) {
        return
      }

      const main = new NetworkModel(networks.main)
      const matic = new NetworkModel(networks.matic)

      // commit networks
      commit("networks", {
        main,
        matic
      })
    },

    async setSelectedNetworkKey({ commit }, networkKey) {
      commit("selectedNetworkKey", networkKey)

      return Promise.all([
        // send action to other storage
        // dispatch("trunk/networkChanged", network, { root: true })
      ])
    },

    async setSelectedNetwork({ dispatch }, network) {
      return dispatch("setSelectedNetworkKey", network.key)
    },



    async setProviders(
      { state, dispatch },
      providers,
      selectedNetworkKey
    ) {
      // set main web3
      state.networks.main.web3 = new Web3(providers.main)
      state.networks.main.provider = providers.main

      // set matic web3
      state.networks.matic.web3 = new Web3(providers.matic)
      state.networks.matic.provider = providers.matic

      // Extends web3 eth
      state.networks.main.web3.eth.extend({
        methods: [
          {
            name: "signTypedDataLegacy",
            call: "eth_signTypedDataLegacy",
            params: 2
          }
        ]
      })

      state.networks.matic.web3.eth.extend({
        methods: [
          {
            name: "signTypedDataLegacy",
            call: "eth_signTypedDataLegacy",
            params: 2
          }
        ]
      })

      // set selected network id into store
      if (selectedNetworkKey) {
        // set new selected network
        await dispatch("setSelectedNetworkKey", selectedNetworkKey)
      }

    }
  }
}
