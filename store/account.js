import getAxios from '~/plugins/axios';
import app from '~/plugins/app';
import OrderModel from '~/components/model/Order'

export default {
  namespaced: true,

  state: () => {
    return {
      account: null,
      userOrders: null,
      favouriteOrders: null,
    }
  },

  getters: {
    account(state) {
      return state.account
    },
    userOrders(state) {
      return state.userOrders;
    },
    favouriteOrders(state) {
      return state.favouriteOrders
    }
  },

  mutations: {
    account(state, account) {
      state.account = account
    },
    userOrders(state, orders) {
      state.userOrders = orders
    },
    favouriteOrders(state, orders) {
      state.favouriteOrders = orders
    }
  },

  actions: {
    async fetchActiveOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        let response = await getAxios().get(`users/${user.id}/activeorders`)
        if (response.status === 200 && response.data.data.orders[0].seller_orders) {
          console.log(response.data)
          let orders = [];
          response.data.data.orders[0].seller_orders.forEach(
            order => orders.push(new OrderModel(order))
          )
          commit('userOrders', orders)
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
