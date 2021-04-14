/* eslint no-param-reassign: 0 */
import getAxios from '~/plugins/axios'
import CategoryModel from '~/components/model/category'

const uiconfig = JSON.parse(process.env.uiconfig)
const defaultCategory = {
  name: 'All Categories',
  img_url: require('~/static/img/category.svg'),
  isAll: true,
  count: 0,
}

export default {
  namespaced: true,

  state: () => {
    return {
      categories: [],
      allCategory: defaultCategory,
    }
  },
  mutations: {
    categories(state, categories) {
      state.categories = categories
    },
    addUsersMaticCount(state, categories) {
      for (let i = 0; i < state.categories.length; i++) {
        state.categories[i].maticCount =
          categories[state.categories[i].maticAddress]
      }
    },
    addUsersMainCount(state, categories) {
      for (let i = 0; i < state.categories.length; i++) {
        state.categories[i].mainCount =
          categories[state.categories[i].mainAddress]
      }
    },
  },

  getters: {
    categories(state) {
      return state.categories
    },
    allCategory(state) {
      const category = state.allCategory
      category.count =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.count) || 0),
          0,
        ) || '0'
      category.maticCount =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.maticCount) || 0),
          0,
        ) || '0'

      category.mainCount =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.mainCount) || 0),
          0,
        ) || '0'

      return category
    },
  },
  actions: {
    async fetchCategories({ commit }) {
      const response = await getAxios().get(`categories`)
      if (response.status === 200 && response.data.data.categories) {
        const categories = response.data.data.categories.map((item) => {
          item.img_url = `${uiconfig.apis.FILE_HOST}${item.img_url}`
          return new CategoryModel(item)
        })

        commit('categories', categories)
      }
    },
  },
}
