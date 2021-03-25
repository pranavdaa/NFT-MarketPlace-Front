import { toChecksumAddress } from "ethereumjs-util"

import Model from "~/components/model/model"
import app from "~/plugins/app"

export default class Category extends Model {

  get checksumAddress() {
    return this.address && toChecksumAddress(this.address)
  }


  get addresses() {
    let addresses = {}
    if (this.categoriesaddresses) {
      this.categoriesaddresses.forEach(address => {
        addresses[address.chain_id] = address.address
      })
    }
    return addresses
  }

  get count() {
    return this.orders || 0
  }

  get address() {
    if (!this.addresses) {
      return null
    }

    const network = app.getSelectedNetwork()
    if (network) {
      return this.addresses[network.id]
    }

    return null
  }

  get maticAddress() {
    if (app.ethereumNetworks) {
      return this.addresses[app.ethereumNetworks.matic.chainId]
    }
    return null
  }
  get mainAddress() {
    if (app.ethereumNetworks) {
      return this.addresses[app.ethereumNetworks.main.chainId]
    }
    return null
  }

  getAddress(networkId) {
    if (this.addresses) {
      if (networkId) {
        return this.addresses[networkId] ? this.addresses[networkId] : ''
      } else {
        const selectedNetwork = app.getSelectedNetwork()
        if (selectedNetwork) {
          return this.addresses[selectedNetwork.id]
        }
      }
    }

    return null
  }
}
