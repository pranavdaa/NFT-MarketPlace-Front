import eutils from 'ethjs-util'
import BigNumber from '~/plugins/bignumber'

const DEFAULT_DEBOUNCE_DURATION = 1000
export function debounce(method, duration = DEFAULT_DEBOUNCE_DURATION) {
  let timeoutId
  function debounceWrapper(...args) {
    debounceWrapper.clear()
    timeoutId = setTimeout(() => {
      timeoutId = null
      method.apply(this, args)
    }, duration)
  }

  debounceWrapper.clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  return debounceWrapper
}

/* eslint-disable no-restricted-syntax */
export function fuzzysearch(rawNeedle, rawHaystack) {
  const needle = rawNeedle.toLowerCase()
  const haystack = rawHaystack.toLowerCase()

  const hlen = haystack.length
  const nlen = needle.length
  if (nlen > hlen) {
    return false
  }

  if (nlen === hlen) {
    return needle === haystack
  }

  outer: for (let i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i)
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer
      }
    }
    return false
  }

  return true
}

export function fuzzySearchResult(inputVal, tokensList) {
  let searchedTokensList = [];

  tokensList.forEach((token) => {
    if (
      fuzzysearch(inputVal, token.name) ||
      fuzzysearch(inputVal, token.description) ||
      fuzzysearch(inputVal, token.token_id) ||
      fuzzysearch(inputVal, token.category.name)
    ) {
      searchedTokensList.push(token);
    }
  })

  return searchedTokensList;
}

export function getNextRoute(route) {
  const meta = route.meta
  const query = route.query
  if (query && query.next) {
    return { path: query.next }
  } else if (meta && meta.next) {
    if (typeof meta.next === 'string') {
      return { name: meta.next }
    } else if (typeof meta.next === 'object') {
      return meta.next
    }
  }

  return null
}

export function getLocationFromURL(href) {
  const l = document.createElement('a')
  l.href = href
  return l
}

export function getBlob(mime, value) {
  const str = typeof value === 'object' ? JSON.stringify(value) : value
  if (!str) {
    return ''
  }
  const blob = new Blob([str], {
    type: mime
  })
  return window.URL.createObjectURL(blob)
}

export function isHex(str = '') {
  const stripped = eutils.stripHexPrefix(str)
  return /^[a-fA-F0-9]+$/.test(stripped)
}

export function padLeft(data, width, padding = '0') {
  return data.length >= width
    ? data
    : new Array(width - data.length + 1).join(padding) + data
}

export function sanitizeHex(value) {
  const hex = eutils.stripHexPrefix(value)
  if (hex === '') return ''
  return eutils.addHexPrefix(eutils.padToEven(hex))
}

export function trimHexZero(value) {
  if (value === '0x00' || value === '0x0') {
    return '0x0'
  }

  let hex = sanitizeHex(value)
  hex = hex.substring(2).replace(/^0+/, '')
  return eutils.addHexPrefix(hex)
}

export function decimalToHex(dec) {
  return new BigNumber(dec).toString(16)
}

export function hexToDecimal(hex) {
  return new BigNumber(sanitizeHex(hex)).toString()
}

export function isValidTxHash(txHash) {
  return (
    txHash.substring(0, 2) === '0x' &&
    txHash.length === 66 &&
    this.isHex(txHash)
  )
}

export function getFunctionSignature(name) {
  return eutils
    .sha3(name)
    .toString('hex')
    .slice(0, 8)
}

export function isChecksumAddress(address) {
  return address === eutils.toChecksumAddress(address)
}

export function dataSize(data) {
  return data ? eutils.stripHexPrefix(data).length : 0
}

export function namehash(name) {
  let node = eutils.addHexPrefix(Array(64).join('0'))
  if (name) {
    const labels = name.split('.')
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      const labelSha = eutils.sha3(labels[i]).toString('hex')
      node = eutils.addHexPrefix(eutils.sha3(node + labelSha).toString('hex'))
    }
  }
  return node
}

export function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.responseType = 'blob';
  xhr.send();
}

export function tokenImage(token) {
  let imgs = require.context('~/static/tokens/', false, /\.svg$/)
  try {
    return imgs('./' + token.toUpperCase() + '.svg')
  } catch (error) {
    return null
  }
}

export function formatUSDValue(amount) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  return formatter.format(amount)
}
