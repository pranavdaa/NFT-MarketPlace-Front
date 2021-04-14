import BigNumber from '~/plugins/bignumber'

const TEN = new BigNumber(10)

// parse balance of token returns BN
export function parseBalance(balance, decimals) {
  const bnDecimals = new BigNumber(decimals)
  return new BigNumber(balance).dividedBy(TEN.pow(bnDecimals))
}

// Converts String, Int and Float to BigNumber Token amount
export function toTokenAmount(balance, decimals) {
  const bnDecimals = new BigNumber(decimals)
  return new BigNumber(balance).times(TEN.pow(bnDecimals))
}

// parse usd balance of token returns BN
export function parseUSDBalance(balance, usd) {
  const bnUSD = BigNumber(usd || '0.00')
  return balance.times(bnUSD)
}
