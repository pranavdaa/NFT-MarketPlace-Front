/* eslint no-param-reassign: 0 */
import { clearStore, config as configStore } from "~/plugins/localstore"
import { getAxios } from "~/plugins/axios"
import app from "~/plugins/app"
import Vue from "vue"

export default {
  namespaced: true,

  state: () => {
    return {
      initialized: false,
      authToken: null,
      user: null,
      address: null,
      userId: null
    }
  },

  mutations: {
    initialized(state, value) {
      state.initialized = value
    },

    user(state, user) {
      state.initialized = true
      state.user = user
      if (state.user) {
        state.userId = user.id
      } else {
        state.userId = null
        state.authToken = null
      }
    },

    userId(state, value) {
      state.userId = value
    },

    address(state, value) {
      state.address = value
    },

    authToken(state, value) {
      state.authToken = value
    }
  },

  getters: {
    initialized(state) {
      return !!state.initialized
    },

    authenticated(state) {
      return !!state.user
    },

    user(state) {
      return state.user
    },

    userId(state) {
      return state.userId
    },

    address(state) {
      return state.address
    },

    emailVerified(state) {
      if (state.user && !state.user.isAnonymous) {
        return !!state.user.emailVerified
      }

      return true
    },

    anonymous(state) {
      return !!(state.user && state.user.isAnonymous)
    }
  },

  actions: {
    login({ commit }, user) {
      commit("user", user)
      if (user) {
        commit("address", user.address)
      } else {
        commit("address", null)
      }
    },

    async logout({ commit, dispatch }) {
      commit("user", null)
      commit("userId", null)
      commit("authToken", null)
      commit("address", null)
      dispatch("trunk/resetBalances", {}, { root: true });
      Vue.logger.stopTrack()
      clearStore()
    },

    // do login
    async doLogin({ dispatch }, payload) {
      if (!payload || !payload.address || !payload.signature) {
        console.log("User addresss and Signature is required for login")
        return
      }

      const response = await getAxios().post("users/login", payload)
      if (response.status === 200 && response.data.data) {
        // Store auth token to local store and add user
        configStore.set("authToken", response.data.auth_token)
        dispatch('login', response.data.data)
        app.initNetworks(app.vuexStore)
        app.initAccount(app.vuexStore)
      }

      return null
    },

    async checkLogin({ dispatch }) {
      try {
        const response = await getAxios().get('users/details')
        if (response.status === 200) {
          dispatch('login', response.data.data)
        }
      } catch (err) {
        if (err.response.status === 401) {
          dispatch('logout');
        }
      }
    }
  }
}
