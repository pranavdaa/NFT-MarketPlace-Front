import ethjsUtil from 'ethjs-util';
import EthereumTx from "ethereumjs-tx"
import app from "~/plugins/app"

import BigNumber from "~/plugins/bignumber"
import EtherUnits from "~/plugins/helpers/ether-units"
import { trimHexZero } from "~/plugins/helpers"

export function adjustGas(gasLimit) {
  if (gasLimit === 21001) {
    return 21000
  }

  if (new BigNumber(gasLimit).gt(app.gasLimit)) {
    return null
  }

  return new BigNumber(gasLimit).toNumber()
}

export function gasGasPrice(network, ...args) {
  return network.web3.eth.getGasPrice(...args)
}

export function gasGasLimit(network, ...args) {
  return network.web3.eth.gasGasLimit(...args)
}

export function getBalance(network, ...args) {
  return network.web3.eth.getBalance(...args)
}

export function estimateGas(network, ...args) {
  return network.web3.eth.estimateGas(...args)
}

export function getBlockNumber(network, ...args) {
  return network.web3.eth.getBlockNumber(...args)
}

export function getTransactionCount(network, ...args) {
  return network.web3.eth.getTransactionCount(...args)
}

export function getTransaction(network, ...args) {
  return network.web3.eth.getTransaction(...args)
}

export function getTransactionReceipt(network, ...args) {
  return network.web3.eth.getTransactionReceipt(...args)
}

export function getBlock(network, ...args) {
  return network.web3.eth.getBlock(...args)
}

export function calculateContractAddress(address, nonce) {
  const nonceStr = new BigNumber(nonce).toString()
  const cleanAddress = eutils.addHexPrefix(address)
  return eutils.addHexPrefix(
    eutils.generateAddress(cleanAddress, nonceStr).toString("hex")
  )
}

export function generateRawTransaction(txObj, privateKey) {
  let privateKeyBuffer = privateKey
  if (typeof privateKey === "string") {
    privateKeyBuffer = Buffer.from(privateKey, "hex")
  }

  const tx = new EthereumTx(txObj)
  tx.sign(privateKeyBuffer)
  return tx.serialize()
}

export async function sendTransaction(
  web3Object,
  options = {},
  callbacks = {}
) {
  const from = options.from
  delete options.chainId
  const [gasLimit, gasPrice, nonce, chainId] = await Promise.all([
    !(options.gasLimit || options.gas)
      ? web3Object.eth.estimateGas(options)
      : options.gasLimit || options.gas,
    !options.gasPrice ? web3Object.eth.getGasPrice() : options.gasPrice,
    !options.nonce ? web3Object.eth.getTransactionCount(from) : options.nonce,
    !options.chainId ? web3Object.eth.net.getId() : options.chainId
  ])

  return web3Object.eth
    .sendTransaction({ ...options, gasLimit, gasPrice, nonce, chainId })
    .on("transactionHash", callbacks.txShowSuccess || txShowSuccess)
    .on("error", callbacks.txShowError || txShowError)
}

export async function getContractCode(network, address) {
  try {
    const rawCode = await network.web3.eth.getCode(address)
    return trimHexZero(rawCode)
  } catch (e) {
    console.log(e)
  }
  return "0x0"
}

export function beautifyErrorMessage(message) {
  if (!message) {
    return null
  }

  if (/sender doesn't have enough funds to send tx/gi.test(message)) {
    const matches = /The upfront cost is: (\d+) /gi.exec(message)
    let cost = null
    if (matches) {
      cost = EtherUnits.toEther(new BigNumber(matches[1]), "wei")
    }
    let result = "Account doesn't have enough funds to send transaction."
    if (cost) {
      result = `${result} Upfront cost is: ${cost.toFixed(5)} ETH`
    }

    return result
  } else if (/insufficient funds for gas \* price \+ value/gi.test(message)) {
    return "Account doesn't have enough funds to send transaction."
  } else if (/nonce too low/gi.test(message)) {
    return "Transaction nonce is too low."
  } else if (/The execution failed due to an exception/gi.test(message)) {
    return "Not enough ETH for transaction."
  } else if (
    /Unknown address - unable to sign transaction for this address:/gi.test(
      message
    )
  ) {
    return "Unable to sign transaction with this address. If you are using metamask, check your default address."
  } else if (
    /MetaMask Tx Signature: User denied transaction signature./gi.test(message)
  ) {
    return "MetaMask Tx: User denied transaction signature"
  }

  return null
}

export function txShowError(error, errorHeader, defaultMessage = '') {
  // error toast
  app.addToast(errorHeader || "Error", beautifyErrorMessage(error ? error?.message : null) || defaultMessage, {
    type: "danger"
  })
}

export function txShowSuccess(txId) {
  const txLink =
    app.vuexStore.getters["network/selectedNetwork"].txHistoryLink(txId) ||
    app.vuexStore.getters["network/networks"][0].txHistoryLink(txId)
  const options = {
    type: "success",
    sticky: true,
    html: true,
    details: "transactions.transactionSentSuccessDetails",
    link: txLink,
    button: {
      text: "transactions.checkTxStatus",
      link: txLink
    }
  }
  // success toast
  app.addToast("Success", "View transaction status ", options)
}

export function txShowResultToast(txPromise) {
  if (txPromise && txPromise.on) {
    return txPromise
      .on("transactionHash", txShowSuccess)
      .on("error", txShowError)
  }
  return txPromise
}

export async function sendContractTransaction(
  web3Object,
  txObject,
  options = {},
  callbacks = {}
) {
  const from = options.from
  const [gasLimit, gasPrice, nonce, chainId] = await Promise.all([
    !(options.gasLimit || options.gas)
      ? txObject.estimateGas({ from })
      : options.gasLimit || options.gas,
    !options.gasPrice ? web3Object.eth.getGasPrice() : options.gasPrice,
    !options.nonce ? web3Object.eth.getTransactionCount(from) : options.nonce,
    !options.chainId ? web3Object.eth.net.getId() : options.chainId
  ])

  await txObject
    .send({
      from: from,
      gasLimit,
      gasPrice,
      nonce,
      chainId
    })
    .on("transactionHash", callbacks.txShowSuccess || txShowSuccess)
    .on("error", callbacks.txShowError || txShowError)
}
