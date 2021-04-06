import app from '~/plugins/app'

export default async function ({ store, $sentry }) {
  // Initialize app
  await app.init(store, $sentry)
}
