/* eslint no-param-reassign: 0 */
import Vue from 'vue'

export default {
  namespaced: true,

  state: () => {
    return {
      selectedFilters: {
        selectedCategory: null,
        selectedSort: null,
      },
      isCategoryFetching: false,
    }
  },

  mutations: {
    selectedCategory(state, category) {
      Vue.set(state.selectedFilters, 'selectedCategory', category || null)
    },
    selectedSort(state, sortBy) {
      Vue.set(state.selectedFilters, 'selectedSort', sortBy || null)
    },
    setIsCategoryFetching(state, isCategoryFetching) {
      state.isCategoryFetching = isCategoryFetching
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
  },
}
