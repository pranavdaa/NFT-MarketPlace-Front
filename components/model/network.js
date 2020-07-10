import Model from "~/components/model/model"

export default class Network extends Model {
  historyLink(address) {
    if (!this.historyHost || !address) return
    return `${this.historyHost}/address/${address}`
  }

  tokenLink(address) {
    if (!this.historyHost || !address) return
    return `${this.historyHost}/token/${address}`
  }

  txHistoryLink(address) {
    if (!this.historyHost || !address) return
    return `${this.historyHost}/tx/${address}`
  }

  blockLink(blockNumber) {
    if (!this.historyHost || !blockNumber) return
    return `${this.historyHost}/block/${blockNumber}`
  }
}
