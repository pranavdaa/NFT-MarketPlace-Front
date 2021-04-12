import { getDefaultAccount } from '~/plugins/helpers/metamask-utils'
export default async function({ store, redirect, route, error }) {
  const user = store.getters['auth/user']
  const selectedAddress = await getDefaultAccount()

  // is initialized but not authenticated redirect to login
  if (
    !selectedAddress ||
    !user ||
    !user.address ||
    user.address.toLowerCase() !== selectedAddress.toLowerCase()
  ) {
    return redirect('/login', {
      next: route.fullPath,
    })
  }

  // check for email and redirect to "complete login"
  // if (!user.email && route.name !== 'complete-login') {
  //   return redirect('/complete-login', { next: route.fullPath })
  // }
}
