import app from '~/plugins/app'
import logger from '~/plugins/logger'
import Vue from 'vue'

export default async function({ store, $sentry }) {
  // Initialize app
  Vue.use(logger)
  console.log('app runing with env', process.env.NODE_ENV)
  await app.init(store, $sentry)
}
