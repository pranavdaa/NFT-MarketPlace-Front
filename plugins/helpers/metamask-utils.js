import MetamaskProvider from "@maticnetwork/metamask-provider"
import Web3 from "web3"

// check metamask
export function isMetamask() {
  if (window.ethereum) {
    return true
  }
  return false
}

// get default account
export async function getDefaultAccount() {
  try {
    const accounts = await getAccounts()
    if (accounts && accounts.length >= 1) {
      return accounts[0]
    }
  } catch (e) {
    // ignore
  }
  return null
}

// get accounts
export function isMetamaskLocked() {
  return new Promise((resolve, reject) => {
    getAccounts()
      .then(result => {
        resolve(!result[0])
      })
      .catch(e => {
        resolve(true)
      })
  })
}

// get accounts
export function getAccounts() {
  return window.ethereum.enable().then(() => {
    const web3 = new Web3(window.ethereum)
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  })
}

// get netword id
export function getNetworkId() {
  const web3 = new Web3(window.ethereum)
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, netId) => {
      if (err) {
        return reject(err)
      }
      return resolve(netId)
    })
  })
}

export function personalSign(from, messageInHex, provider) {
  return new Promise((resolve, reject) => {
    provider.sendAsync(
      {
        method: "personal_sign",
        params: [messageInHex, from],
        from
      },
      (err, result) => {
        const e = err || (result && result.error)
        if (e) {
          reject(e)
        } else {
          resolve(result)
        }
      }
    )
  })
}

export function signTypedData(from, data, provider) {
  const params = [from, JSON.stringify(data)]
  const method = provider.isMetaMask
    ? "eth_signTypedData_v3"
    : "eth_signTypedData"

  // promise
  return new Promise((resolve, reject) => {
    provider.sendAsync(
      {
        method,
        params,
        from
      },
      (err, result) => {
        const e = err || (result && result.error)
        if (e) {
          reject(e)
        } else {
          resolve(result)
        }
      }
    )
  })
}

export function signTypedDataLegacy(from, data, provider) {
  const params = [data, from]
  const method = provider.isMetaMask
    ? "eth_signTypedData"
    : "eth_signTypedDataLegacy"

  // promise
  return new Promise((resolve, reject) => {
    provider.sendAsync(
      {
        method,
        params,
        from
      },
      (err, result) => {
        const e = err || (result && result.error)
        if (e) {
          reject(e)
        } else {
          resolve(result)
        }
      }
    )
  })
}

// register account change
export function registerAccountChange(fn) {
  if (window.ethereum.on) {
    window.ethereum.on("accountsChanged", fn)
  }
}

// register network change
export function registerNetworkChange(fn) {
  if (window.ethereum.on) {
    window.ethereum.on("networkChanged", fn)
  }
}

// export get metamask provider
export function getMetamaskProvider(options = {}) {
  return new MetamaskProvider(window.ethereum, options)
}
