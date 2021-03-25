import * as axios from "axios"
import { config as configStore } from "~/plugins/localstore"

// global axios object
let axiosAPIObj = null
let axiosBaseObj = null
const getToken = () => configStore.get("authToken") || null

export function initalizeAxios(options = {}) {
  axiosAPIObj = axios.create(options)
  axiosBaseObj = axios.create({})


  // Use request interceptor to add authorization header
  axiosAPIObj.interceptors.request.use(
    async config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = getToken()
      }
      return config
    },
    error => error
  )

  return axiosAPIObj
}

export function getAxios() {
  return axiosAPIObj
}

export function getBaseAxios() {
  return axiosBaseObj
}
export default getAxios
