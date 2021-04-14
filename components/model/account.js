import Model from '~/components/model/model'
import ethjsUtil from 'ethjs-util'
import { toChecksumAddress } from 'ethereumjs-util'

import app from '~/plugins/app'
import { config as configStore } from '~/plugins/localstore'

export default class Account extends Model {
  // getters
  get name() {
    return (
      this.label ||
      `Account ${ethjsUtil.stripHexPrefix(this.address).slice(0, 4)}`
    )
  }

  get checksumAddress() {
    return this.address && toChecksumAddress(this.address)
  }

  get shortChecksumAddress() {
    if (!this.address) {
      return null
    }
    const a = toChecksumAddress(this.address)
    return `${a.slice(0, 6)}...${a.slice(38, 42)}`
  }

  get mediumChecksumAddress() {
    if (!this.address) {
      return null
    }
    const a = toChecksumAddress(this.address)
    return `${a.slice(0, 12)}...${a.slice(30, 42)}`
  }

  get isMetamaskAccount() {
    const strategy = configStore.get('loginStrategy')
    if (strategy && strategy === app.strategies.METAMASK) {
      return true
    }
    return false
  }

  // getBalance(refresh = false) {
  //   return app.vuexStore.dispatch("trunk/fetchAccountBalance", {
  //     refresh,
  //     address: this.address
  //   })
  // }
}
