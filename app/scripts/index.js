// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import StarNotaryArtifact from '../../build/contracts/StarNotary.json'

// StarNotary is our usable abstraction, which we'll use through the code below.
const StarNotary = contract(StarNotaryArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const createStar = async () => {
  const instance = await StarNotary.deployed();
  const name = document.getElementById("starName").value;
  const id = document.getElementById("starId").value;
  await instance.createStar(name, id, 'name', 'id', 'name', 'name', { from: account });
  App.setStatus("New Star Owner is " + account + ".");
}

const getTokenNameAndSymbol = async function () {
  const instance = await StarNotary.deployed();
  let name = instance.name();
  let symbol = instance.symbol();

  console.log({ name, symbol });
}

const lookUpStar = async () => {
  const instance = await StarNotary.deployed();
  const id = document.getElementById("starIdToBeFound").value;
  var name = await instance.lookUptokenIdToStarInfo(id);
  App.setStatus("Found a star with the name" + name + ".");
}

const getStarOwner = async () => {
  const instance = await StarNotary.deployed();
  const id = document.getElementById("starIdFindOwner").value;
  var name = await instance.ownerOf(id);
  App.setStatus("Star owner is " + name + ".");
}

const transferStar = async () => {
  const instance = await StarNotary.deployed();
  const starId = document.getElementById("starIdToBeTransferred").value;
  const address = document.getElementById("addressToReceiveStar").value;
  var name = await instance.transferStar(address, starId, { from: account });
  App.setStatus("Star transferred to address" + name + ".");
}

const exchangeStars = async () => {
  const instance = await StarNotary.deployed();
  const starId1 = document.getElementById("starIdToBeExchanged1").value;
  const starId2 = document.getElementById("starIdToBeExchanged2").value;
  var name = await instance.exchangeStars(starId1, starId2, { from: account });
  App.setStatus("Stars exchanged " + name + ".");
}

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    StarNotary.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  createStar: function () {
    createStar();
  },

  lookUpStar: function () {
    lookUpStar();
  },

  transferStar: function () {
    transferStar();
  },

  getStarOwner: function () {
    getStarOwner();
  },

  exchangeStars: function () {
    exchangeStars();
  },

  getTokenNameAndSymbol: function () {
    getTokenNameAndSymbol();
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
