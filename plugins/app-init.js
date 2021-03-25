import app from '~/plugins/app'

export default async function ({ store }) {
  // Initialize app
  await app.init(store)
}
