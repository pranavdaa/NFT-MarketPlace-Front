import Vue from "vue"
import Web3 from "web3"
import MetaNetwork from "@maticnetwork/meta/network"

import { clearStore, config as configStore } from "~/plugins/localstore"
import { initalizeAxios } from "./axios"

import AccountModel from "~/components/model/account"
import { registerAccountChange, getMetamaskProvider, registerNetworkChange } from "~/plugins/helpers/metamask-utils"
import { getWalletProvider } from "~/plugins/helpers/providers"

const uiconfig = JSON.parse(process.env.uiconfig)

const app = {
  vuexStore: null,
  web3: new Web3(),
  gasLimit: 3500000,
  maticDecimals: 18,
  bus: new Vue(),

  uiconfig,
  strategies: {
    METAMASK: "metamask",
    WALLETCONNECT: "walletconnect",
    PORTIS: "portis"
  },
  orderTypes: {
    FIXED: "FIXED",
    NEGOTIATION: "NEGOTIATION",
    AUCTION: "AUCTION"
  },

  async init(store) {
    // store vuex store in this app
    this.vuexStore = store

    // initialize axios
    initalizeAxios({
      baseURL: uiconfig.apis.MARKETPLACE_API_HOST
    })

    // set and Initialise networks
    this.setNetworks(store)

    // TODO: initialize Authentication
    await this.initAuthentication(store)

    // Initialize Categories
    this.initCategories(store)

    // Initialize tokens
    this.initTokens(store)
  },


  async setNetworks(store) {
    const network = new MetaNetwork(
      this.uiconfig.matic.deployment.network,
      this.uiconfig.matic.deployment.version
    )

    // Store meta to use ABIs and artifacts
    store.commit("network/networkMeta", network)

    const main = network.Main
    const matic = network.Matic

    this.ethereumNetworks = {
      main: {
        key: "main",
        id: main.ChainId,
        chainId: main.ChainId,
        networkId: main.ChainId,
        name: main.NetworkName,
        historyHost: main.Explorer,
        childNetworkId: matic.ChainId,
        rpc: this.uiconfig.mainRPC,
        isMatic: false,
        syncerUrl: main.SyncerAPI,
        watcherUrl: main.WatcherAPI,
        daggerEndpoint: main.DaggerEndpoint,
        contracts: {
          ...main.Contracts
        }
      },
      matic: {
        key: "matic",
        id: matic.ChainId,
        chainId: matic.ChainId,
        networkId: matic.ChainId,
        name: matic.NetworkName,
        parentNetworkId: main.ChainId,
        historyHost: matic.Explorer,
        rpc: this.uiconfig.maticRPC,
        isMatic: true,
        default: true,
        syncerUrl: matic.SyncerAPI,
        watcherUrl: matic.WatcherAPI,
        daggerEndpoint: matic.daggerEndpoint,
        contracts: {
          ...matic.Contracts
        }
      },
    }
    // Initialize networks
    await this.initNetworks(store)
  },

  async initNetworks(store) {
    // store networks
    await store.dispatch("network/setNetworks", this.ethereumNetworks)

    // avoid reloading when metamask network is changed
    window.ethereum.autoRefreshOnNetworkChange = false

    // set network depending upon the login strategy
    if (this.isMetaMaskConnected()) {
      const metamaskNetworkChangeHandler = async () => {
        await store.dispatch("network/setProviders", {
          main: getWalletProvider({
            networks: this.ethereumNetworks, primaryProvider: 'main'
          }),
          matic: getWalletProvider({
            networks: this.ethereumNetworks, primaryProvider: 'matic'
          })
        })
      }

      registerNetworkChange(metamaskNetworkChangeHandler)
      await metamaskNetworkChangeHandler()

      registerAccountChange(async (selectedAddress) => {
        const user = store.getters["auth/user"]

        if (!user || !user.address) {
          await store.dispatch("auth/logout");
        }

        else if (!selectedAddress || !selectedAddress[0] || user.address.toLowerCase() !== selectedAddress[0].toLowerCase()) {
          await store.dispatch("auth/logout")
          window.location.replace("/login")
        }
      })
    } else {
      await store.dispatch("network/setProviders", {
        main: new Web3.providers.HttpProvider(this.ethereumNetworks.main.rpc),
        matic: new Web3.providers.HttpProvider(this.ethereumNetworks.matic.rpc)
      })
    }
  },

  async initAuthentication(store) {
    // Check auth token is there and is valid or not
    await store.dispatch("auth/checkLogin")

    // Initialize account
    this.initAccount(store)

  },

  async initAccount(store) {
    // store commit
    store.commit(
      "account/account",
      new AccountModel({
        address: store.getters["auth/address"]
      })
    )

    await store.dispatch("token/reloadBalances")

    // user profile data
    this.initUserProfile(store)
  },

  async initCategories(store) {
    await store.dispatch('category/fetchCategories')
  },

  async initTokens(store) {
    await store.dispatch("token/fetchERC20Tokens")

    const user = store.getters['auth/user']
    if (user) {
      // Load account balance
      await store.dispatch("token/reloadBalances")
    }
  },

  async initUserProfile(store) {
    const user = store.getters['auth/user']
    if (user) {
      store.dispatch('account/fetchActiveOrders')
      // store.dispatch('account/fetchFavoritesOrders')
    }
  },

  getSelectedNetwork() {
    return app.vuexStore.getters["network/selectedNetwork"]
  },

  getMatic() {
    return app.vuexStore.getters["network/matic"]
  },

  isWCConnected() {
    return this.strategies.WALLETCONNECT === configStore.get("loginStrategy")
  },

  isMetaMaskConnected() {
    return this.strategies.METAMASK === configStore.get("loginStrategy")
  },

  isPortisConnected() {
    return this.strategies.PORTIS === configStore.get("loginStrategy")
  },

  addToast(title, body, options = {}) {
    options.details = body
    this.bus.$emit("toast:add", title, options)
  },

  refreshApp() {
    window.location.reload(true)
  },

  async logout() {
    // clear all store
    clearStore()

    // redirect to login
    location.replace("/login")
  },

  walletconnectModal: {
    open: (uri, onClose) => {
      app.bus.$once("walletconnect:session:abort", () => {
        onClose()
      })
      app.bus.$emit("walletconnect:session:new", uri)
    },
    close: () => {
      app.bus.$emit("walletconnect:session:close")
    }
  }
}

// Export
export default app
