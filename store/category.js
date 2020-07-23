/* eslint no-param-reassign: 0 */
import getAxios from "~/plugins/axios"
import CategoryModel from "~/components/model/Category"

const uiconfig = JSON.parse(process.env.uiconfig)

export default {
  namespaced: true,

  state: () => {
    return {
      categories: []
    }
  },

  mutations: {
    categories(state, categories) {
      state.categories = categories
    },

  },

  getters: {
    categories(state) {
      return state.categories
    },
  },
  actions: {
    async fetchCategories({ commit }) {
      const response = await getAxios().get(`categories`);
      if (response.status === 200 && response.data.data.categories) {
        let categories = response.data.data.categories.map(item => {
          item.img_url = `${uiconfig.apis.FILE_HOST}${item.img_url}`;
          return new CategoryModel(item);
        });

        commit('categories', categories);

      }
    }
  }
}
