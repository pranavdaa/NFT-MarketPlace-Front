import Model from "~/components/model/model"
import app from "~/plugins/app"
import BigNumber from "~/plugins/bignumber"
import Web3 from "web3"
import { parseBalance } from "~/plugins/helpers/token-utils"

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

export default class Order extends Model {
  get categories_id() {
    return this.categories.id
  }
  get erc20tokens_id() {
    return this.erc20tokens.id
  }

  get token() {
    return {
      name: `Token ${Web3.utils.hexToNumberString(this.tokens_id)}`,
      img_url: "/_nuxt/static/img/dummy-kitty.png",
      owner: this.makerAddress || "",
      description: ""
    }
  }

  getPrice() {
    const price = new BigNumber(this.price)
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    if (!price || !erc20Token) {
      return ZERO
    }
    return parseBalance(price, erc20Token.decimal)
  }
  getMinPrice() {
    const price = new BigNumber(this.min_price)
    if (!price) {
      return ZERO
    }

    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    return parseBalance(price, erc20Token.decimal)
  }

}
