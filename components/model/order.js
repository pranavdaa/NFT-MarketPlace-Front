import Model from "~/components/model/model"
import app from "~/plugins/app"
import BigNumber from "~/plugins/bignumber"
import Web3 from "web3"
import { parseBalance, toTokenAmount } from "~/plugins/helpers/token-utils"

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

export default class Order extends Model {
  get categories_id() {
    return this.categories.id
  }
  get erc20tokens_id() {
    return this.erc20tokens.id
  }

  // adding temporarily for development without api
  // remove this getter once API is ready
  get attributes() {
    return [
      {
        "trait_type": "title",
        "value": "Origin",
        "display_type": null,
        "max_value": null,
        "trait_count": 3802,
        "order": null
      },
      {
        "trait_type": "skill",
        "value": 31,
        "display_type": null,
        "max_value": null,
        "trait_count": 38646,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "raven",
        "display_type": null,
        "max_value": null,
        "trait_count": 7245,
        "order": null
      },
      {
        "trait_type": "speed",
        "value": 46,
        "display_type": null,
        "max_value": null,
        "trait_count": 3404,
        "order": null
      },
      {
        "trait_type": "morale",
        "value": 54,
        "display_type": null,
        "max_value": null,
        "trait_count": 1700,
        "order": null
      },
      {
        "trait_type": "hp",
        "value": 33,
        "display_type": null,
        "max_value": null,
        "trait_count": 1269,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "doubletalk",
        "display_type": null,
        "max_value": null,
        "trait_count": 3429,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "lagging",
        "display_type": null,
        "max_value": null,
        "trait_count": 3356,
        "order": null
      },
    ]
  }

  get token() {
    let img = ""
    let name = `Token ${this.tokens_id}`
    let owner = ""
    let description = ""
    if (this.image) {
      img = this.image
    }
    if (this.name) {
      name = this.name
    }
    if (this.description) {
      description = this.description
    }

    if (this.seller_users) owner = this.seller_users.address
    else if (this.makerAddress) owner = this.makerAddress
    else owner = ""

    return {
      name: name,
      img_url: img,
      owner: owner,
      description: description,
      attributes_metadata: this.attributes,
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

  getPriceInBN() {
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    if (!this.price || !erc20Token) {
      return ZERO
    }
    return toTokenAmount(this.price, erc20Token.decimal)
  }

  getMinPriceInBN() {
    if (!this.min_price) {
      return ZERO
    }
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    return toTokenAmount(this.min_price, erc20Token.decimal)
  }

}
