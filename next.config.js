require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRETE_KEY: process.env.JWT_SECRETE_KEY,
    expire:process.env.expire
},
}
