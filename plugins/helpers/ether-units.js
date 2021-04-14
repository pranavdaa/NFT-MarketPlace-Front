import Web3 from 'web3'
import BigNumber from '~/plugins/bignumber'

const web3 = new Web3()
export default class EtherUnits {
  static unitMap = web3.utils.unitMap;

  static getValueOfUnit(unit) {
    const unitKey = unit ? unit.toLowerCase() : 'ether'
    const unitValue = this.unitMap[unitKey]
    if (unitValue === undefined) {
      return null
    }
    return new BigNumber(unitValue, 10)
  }

  static fiatToWei(number, pricePerEther) {
    const returnValue = new BigNumber(String(number))
      .div(pricePerEther)
      .times(EtherUnits.getValueOfUnit('ether'))
      .round(0)
    return returnValue.toString(10)
  }

  static toFiat(number, unit, multi) {
    const returnValue = new BigNumber(EtherUnits.toEther(number, unit))
      .times(multi)
      .round(5)
    return returnValue.toString(10)
  }

  static toEther(number, unit) {
    return EtherUnits.unitToUnit(number, unit || 'wei', 'ether')
  }

  static toWei(number, unit) {
    return EtherUnits.unitToUnit(number, unit || 'ether', 'wei')
  }

  static unitToUnit(number, from, to) {
    const b = new BigNumber(String(number))
    return b
      .times(EtherUnits.getValueOfUnit(from))
      .div(EtherUnits.getValueOfUnit(to))
  }
}
