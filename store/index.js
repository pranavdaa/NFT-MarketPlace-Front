import Vuex from 'vuex'

import locale from './locale'
import page from './page'
import token from './token'
import category from './category'


const createStore = () =>
  new Vuex.Store({
    // modules
    modules: {
      locale,
      page,
      category,
      token
    }
  })

export default createStore
