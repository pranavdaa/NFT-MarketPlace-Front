import Vuex from 'vuex'

import locale from './locale'
import page from './page'
import auth from './auth'
import account from './account'
import token from './token'
import category from './category'
import network from './network'
import trunk from './trunk'

const createStore = () =>
  new Vuex.Store({
    // modules
    modules: {
      locale,
      auth,
      account,
      category,
      token,
      network,
      trunk,
      page,
    },
  })

export default createStore
