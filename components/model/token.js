import { toChecksumAddress } from "ethereumjs-util"

import BigNumber from "~/plugins/bignumber"
import Model from "~/components/model/model"
import app from "~/plugins/app"

import { parseBalance, parseUSDBalance } from "~/plugins/helpers/token-utils"

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

export default class Token extends Model {
  static ERC20 = "ERC20"

  static balanceHex = "0x70a08231"
  static transferHex = "0xa9059cbb"

  get checksumAddress() {
    return this.address && toChecksumAddress(this.address)
  }

  get addresses() {
    let addresses = {}
    if (this.erc20tokensaddresses) {
      this.erc20tokensaddresses.forEach(address => {
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

  get isEther() {
    return this.id == app.uiconfig.ethDBID
  }

  get isMatic() {
    return this.id == app.uiconfig.maticDBID
  }

  get fullUSDBalance() {
    return parseUSDBalance(this.balance, this.usd).dp(0)
  }

  get fullBalance() {
    const selectedNetwork = app.getSelectedNetwork()
    if (!this.address || !selectedNetwork) {
      return ZERO
    }

    return app.vuexStore.getters["trunk/tokenBalance"](
      this.address.toLowerCase(),
      selectedNetwork.id
    )
  }

  get balance() {
    if (this.fullBalance.isZero()) {
      return ZERO
    }

    return parseBalance(this.fullBalance, this.decimal)
  }

  get formattedBalance() {
    return this.balance.toFixed(2)
  }

  get formattedFullUSDBalance() {
    return parseUSDBalance(this.balance, this.usd).toFixed(2)
  }


  getFormattedBalance(networkId) {
    return this.getBalance(networkId).toFixed(3)
  }

  getContract(network) {
    let address = this.address
    if (network && network.id) {
      address = this.getAddress(network.id)
    }

    if (!address) {
      return null
    }

    return app.vuexStore.dispatch("trunk/fetchERC20ContractObject", {
      address,
      network
    })
  }

  // new methods (getAddress/getBalance) to return values based on network ID
  // TODO: we can refactor above getters in future
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

  getBalance(networkId) {
    const address = this.getAddress(networkId)

    if (!address) {
      return ZERO
    }

    const value = app.vuexStore.getters["trunk/tokenBalance"](
      address.toLowerCase(),
      networkId
    )

    return parseBalance(value, this.decimal)
  }

  getFullBalance(networkId) {
    const address = this.getAddress(networkId)

    return app.vuexStore.getters["trunk/tokenBalance"](
      address.toLowerCase(),
      networkId
    )
  }

  convertBalanceToAmount(amount) {
    const decimals = new BigNumber(this.decimal)
    return new BigNumber(amount).multipliedBy(TEN.pow(decimals))
  }
  convertToFormattedUSDBalance(amount) {
    return amount.times(new BigNumber(this.usd || "0.00")).dp(2);
  }
}
