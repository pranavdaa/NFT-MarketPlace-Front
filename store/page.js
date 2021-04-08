/* eslint no-param-reassign: 0 */
import Vue from 'vue'

export default {
  namespaced: true,

  state: () => {
    return {
      selectedFilters: {
        selectedCategory: null,
        selectedSort: null
      }
    }
  },

  mutations: {
    selectedCategory(state, category) {
      Vue.set(state.selectedFilters, 'selectedCategory', category || null)
    },
    selectedSort(state, sortBy) {
      Vue.set(state.selectedFilters, 'selectedSort', sortBy || null)
    },
  },

  getters: {
    selectedCategory(state) {
      return state.selectedFilters.selectedCategory
    },
    selectedSort(state) {
      return state.selectedFilters.selectedSort
    },
    selectedFilters(state) {
      return state.selectedFilters
    },
  }
}
