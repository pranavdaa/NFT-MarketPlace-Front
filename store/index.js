import Vuex from 'vuex'

import locale from './locale'
import page from './page'


const createStore = () =>
  new Vuex.Store({
    // modules
    modules: {
      locale,
      page
    }
  })

export default createStore
