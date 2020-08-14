import getAxios from '~/plugins/axios';
import app from '~/plugins/app';
import OrderModel from '~/components/model/order'

export default {
  namespaced: true,

  state: () => {
    return {
      account: null,
      userOrders: null,
      favouriteOrders: null,
      totalMaticNft: 0,
      totalMainNft: 0,
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
    },
    totalMaticNft(state) {
      return state.totalMaticNft
    },
    totalMainNft(state) {
      return state.totalMainNft
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
    },
    totalMaticNft(state, num) {
      state.totalMaticNft = num
    },
    totalMainNft(state, num) {
      state.totalMainNft = num
    }
  },

  actions: {
    async fetchActiveOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        let response = await getAxios().get(`users/${user.id}/activeorders`)
        if (response.status === 200 && response.data.data.length > 0) {
          let orders = [];
          response.data.data.forEach(
            order => orders.push(new OrderModel(order))
          )
          commit('userOrders', orders)
        }
      } catch (error) {
        // console.log(error)
      }
    },
    async fetchFavoritesOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        let response = await getAxios().get(`users/${user.id}/favourites`)
        if (response.status === 200 && response.data.data.length > 0) {
          let orders = [];
          console.log(response.data.data)
          response.data.data.forEach(function (fav) {
            fav.orders.image = fav.image
            fav.orders.name = fav.name
            fav.orders.description = fav.description
            fav.order = new OrderModel(fav.orders)
            orders.push(fav)
          })
          commit('favouriteOrders', orders)
        }
      } catch (error) {
        // console.log(error)
      }
    }
  }
}
