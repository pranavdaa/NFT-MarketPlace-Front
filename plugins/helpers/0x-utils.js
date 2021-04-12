import BigNumber from '~/plugins/bignumber'
import app from '~/plugins/app'

const TX_DEFAULTS = app.uiconfig.TX_DEFAULTS
const ONE_SECOND_MS = app.uiconfig.ONE_SECOND_MS
const TEN_MINUTES_MS = app.uiconfig.TEN_MINUTES_MS

export const getRandomFutureDateInSeconds = () => {
  return new BigNumber(Date.now() + TEN_MINUTES_MS)
    .div(ONE_SECOND_MS)
    .integerValue(BigNumber.ROUND_CEIL)
}

export const calculateProtocolFee = (
  orders,
  gasPrice = TX_DEFAULTS.gasPrice,
) => {
  return new BigNumber(150000).times(gasPrice).times(orders.length)
}
