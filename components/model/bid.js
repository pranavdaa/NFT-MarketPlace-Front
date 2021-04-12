import Model from '~/components/model/model'
import app from '~/plugins/app'
import BigNumber from '~/plugins/bignumber'
import { parseBalance } from '~/plugins/helpers/token-utils'

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

export default class Order extends Model {
  getPrice() {
    const price = new BigNumber(this.price)
    if (!price || !this.erc20Token) {
      return ZERO
    }
    return parseBalance(price, this.erc20Token.decimal)
  }
}
