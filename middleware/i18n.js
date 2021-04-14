export default function({
  app,
  store,
  route,
  params,
  error,
  redirect,
  hotReload,
}) {
  // If middleware is called from hot-reloading, ignore it
  if (hotReload) {
    return
  }

  // Get locale from params
  const locale = params.lang || 'en'
  if (store.state.locale.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }

  // Set locale
  store.commit('locale/set', locale)
  app.i18n.locale = store.getters['locale/current']
  // If route is /en/... -> redirect to /...
  // if (locale === 'en' && route.fullPath.indexOf('/en') === 0) {
  //   return redirect(route.fullPath.replace(/^\/en/, '/'));
  // }
}
