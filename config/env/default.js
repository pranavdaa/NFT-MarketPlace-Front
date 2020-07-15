/**
 * Expose
 */

const debug = !process.env.NODE_ENV || process.env.NODE_ENV === "development"

module.exports = {
  env: process.env.NODE_ENV || "development",
  debug,
  ethDBID: process.env.ETH_DB_ID || "2",
  maticDBID: process.env.MATIC_DB_ID || "1",
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
  displaySaleTagTime: process.env.DISPLAY_SALE_TAG_TIME || 2, // In days
  displayDecimals: process.env.DISPLAY_DECIMALS || 2,
  maticDecimals: process.env.MATIC_DECIMALS || 18,
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 50,
  pageIncrementSize: process.env.PAGE_INCREMENT_SIZE || 50,
  mainRPC: process.env.MAIN_RPC || 'https://mainnet.infura.io/v3/73d0b3b9a4b2499da81c71a2b2a473a9',
  maticRPC: process.env.MATIC_RPC || 'https://rpc-mainnet.matic.network',
}
