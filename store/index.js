import Vuex from 'vuex'

import locale from './locale'


const createStore = () =>
  new Vuex.Store({
    // modules
    modules: {
      locale
    }
  })

export default createStore
