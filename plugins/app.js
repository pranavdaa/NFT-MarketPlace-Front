import Vue from "vue"
import Web3 from "web3"

import { clearStore, config as configStore } from "~/plugins/localstore"
import { initalizeAxios } from "./axios"

import AccountModel from "~/components/model/account"

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
  orderStatus: {
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

    // Initialize Categories
    await this.initCategories(store)

    // Initialize tokens
    await this.initTokens(store)

    // TODO: initialize Authentication
    await this.initAuthentication(store)

  },

  async initAuthentication(store) {
    // Check auth token is there and is valid or not
    await store.dispatch("auth/checkLogin")

    // Initialize account
    this.initAccount(store)

  },

  async initAccount(store) {
    // store commit
    console.log(new AccountModel({
      address: store.getters["auth/address"]
    }))
    store.commit(
      "account/account",
      new AccountModel({
        address: store.getters["auth/address"]
      })
    )
  },

  async initCategories(store) {
    await store.dispatch('category/fetchCategories')
  },

  async initTokens(store) {
    await store.dispatch("token/fetchERC20Tokens");
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
