import getAxios from '~/plugins/axios';
import app from '~/plugins/app';
import OrderModel from '~/components/model/Order'

export default {
  namespaced: true,

  state: () => {
    return {
      account: null,
      makerOrders: null,
      favouriteOrders: null,
    }
  },

  getters: {
    account(state) {
      return state.account
    },
    makerOrders(state) {
      return state.makerOrders;
    },
    favouriteOrders(state) {
      return state.favouriteOrders
    }
  },

  mutations: {
    account(state, account) {
      state.account = account
    },
    makerOrders(state, orders) {
      state.makerOrders = orders
    },
    favouriteOrders(state, orders) {
      state.favouriteOrders = orders
    }
  },

  actions: {
    async fetchMakerOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        let response = await getAxios().get(`users/${user.id}/makerorders`)
        if (response.status === 200 && response.data.data.orders[0].maker_orders) {
          let orders = [];
          response.data.data.orders[0].maker_orders.forEach(
            order => orders.push(new OrderModel(order))
          )
          commit('makerOrders', orders)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchFavoritesOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        let response = await getAxios().get(`users/${user.id}/favourites`)
        if (response.status === 200 && response.data.data.favourites[0].favourites) {
          commit('favouriteOrders', response.data.data.favourites[0].favourites)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
