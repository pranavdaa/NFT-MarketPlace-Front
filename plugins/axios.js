import * as axios from "axios"

// global axios object
let axiosAPIObj = null
let axiosBaseObj = null
let cachedToken = null

export function initalizeAxios(options = {}) {
  axiosAPIObj = axios.create(options)
  axiosBaseObj = axios.create({})

  // Add Authorization header

  return axiosAPIObj
}

export function getAxios() {
  return axiosAPIObj
}

export function getBaseAxios() {
  return axiosBaseObj
}
export default getAxios
