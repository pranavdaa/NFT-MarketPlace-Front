import * as axios from "axios"

// global axios object
let axiosAPIObj = null
let axiosBaseObj = null
let cachedToken = null

export function initalizeAxios(options = {}) {
  axiosAPIObj = axios.create(options)
  axiosBaseObj = axios.create({})


  return axiosAPIObj
}

export function getAxios() {
  initalizeAxios()
  return axiosAPIObj
}

export function getBaseAxios() {
  initalizeAxios()
  return axiosBaseObj
}
export default getAxios
