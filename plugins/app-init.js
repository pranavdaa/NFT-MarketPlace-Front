import app from '~/plugins/app'
import logger from '~/plugins/logger';
import Vue from "vue";

export default async function ({ store, $sentry }) {
  // Initialize app
  Vue.use(logger);
  await app.init(store, $sentry)
}
