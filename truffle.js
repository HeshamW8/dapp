// Allows us to use ES6 in our migrations and tests.
require('babel-register')
const HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "wait mirror lawsuit stomach melt hurt morning famous anger piece total say";
// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/e106735b25f24695800ce16dbee58306");
      },
      network_id: '*',
      gas: 4500000,
      gasPrice: 10000000000
    }
  }
}
