/**
 * Expose
 */

const debug = !process.env.NODE_ENV || process.env.NODE_ENV === "development"

module.exports = {
  env: process.env.NODE_ENV || "development",
  debug,
  matic: {
    deployment: {
      network: process.env.DEPLOYMENT_NETWORK || "testnet",
      version: process.env.DEPLOYMENT_VERSION || "mumbai"
    }
  },
  apis: {
    MARKETPLACE_API_HOST: process.env.MARKETPLACE_API_HOST || "http://localhost:3001/api/v1/",
    FILE_HOST: process.env.FILE_HOST || "http://localhost:3001/"
  },
  displayDecimals: process.env.DISPLAY_DECIMALS || 2,
  maticDecimals: process.env.MATIC_DECIMALS || 18,
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 50,
  pageIncrementSize: process.env.PAGE_INCREMENT_SIZE || 50,
}
