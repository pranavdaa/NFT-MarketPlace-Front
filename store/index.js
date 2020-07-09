import Vuex from 'vuex'

import locale from './locale'
import page from './page'
import auth from './auth'
import account from './account'
import token from './token'
import category from './category'



const createStore = () =>
  new Vuex.Store({
    // modules
    modules: {
      locale,
      auth,
      account,
      page,
      category,
      token
    }
  })

export default createStore
