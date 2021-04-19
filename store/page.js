/* eslint no-param-reassign: 0 */
import Vue from 'vue'

export default {
  namespaced: true,

  state: () => {
    return {
      selectedFilters: {
        selectedCategory: null,
        selectedSort: null,
        searchString: null,
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
    setSearchString(state, searchString) {
      Vue.set(state.selectedFilters, 'searchString', searchString || null)
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
    searchString(state) {
      return state.selectedFilters.searchString
    },
    selectedFilters(state) {
      return state.selectedFilters
    },
  },

  actions: {
    clearFilters({ commit }) {
      commit('selectedCategory')
      commit('selectedSort')
      commit('setSearchString')
    },
  },
}
