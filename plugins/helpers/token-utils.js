import BigNumber from '~/plugins/bignumber'
import moment from 'moment'

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

// Remove underscores from the attribute lable and other formats
export function formatMetaAttributes(attributes) {
  if (attributes) {
    return attributes.map((element) => {
      element = {
        ...element,
        trait_type: element.trait_type.replace(/_/g, ' '),
      }

      if (element.trait_type === 'generation') {
        element = {
          ...element,
          value: element.value
            .toString()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        }
      }

      if (element.trait_type === 'birthday') {
        element = {
          ...element,
          value: moment.unix(element.value).format('ddd, MMMM Do, YYYY'),
        }
      }

      return element
    })
  } else {
    return null
  }
}
