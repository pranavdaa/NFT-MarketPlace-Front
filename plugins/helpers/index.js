const DEFAULT_DEBOUNCE_DURATION = 500
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
