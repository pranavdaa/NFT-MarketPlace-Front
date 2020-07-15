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
        if (address.chain_id == "8001") {
          addresses["80001"] = address.address
        } else {
          addresses[address.chain_id] = address.address
        }

      })
    }
    return addresses
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

  getAddress(networkId) {
    if (this.addresses) {
      if (networkId) {
        return this.addresses[networkId]
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
