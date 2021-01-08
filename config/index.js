// Module dependencies
const path = require("path")
const dotenv = require("dotenv")

// Set config object
const root = path.normalize(`${__dirname}/..`)
dotenv.config({ path: `${root}/config.env`, silent: true })

// get config
const config = require("./env/default")

// export config
module.exports = config
