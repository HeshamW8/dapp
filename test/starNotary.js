//import 'babel-polyfill';
const StarNotary = artifacts.require('StarNotary')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
  accounts = accs;
  instance = await StarNotary.deployed();
});

createStar = async (starId, account) => {
  let tokenId = starId;
  let starName = 'Awesome Star!';
  let starRa = 'RA';
  let starDc = 'DC';
  let starMag = 'starMag';
  let starStory = 'starStory';
  await instance.createStar(starName, tokenId, starStory, starRa, starDc, starMag, { from: account })
}

it('can Create a Star', async () => {
  let tokenId = 1;
  await createStar(tokenId, accounts[0])
  assert.equal(await instance.lookUptokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async () => {
  let tokenId = 2;
  let user1 = accounts[1]
  await createStar(tokenId, user1)
  let starPrice = web3.toWei(.01, "ether")
  await instance.putStarUpForSale(tokenId, starPrice, { from: user1 })
  assert.equal(await instance.starsForSale.call(tokenId), starPrice)
});

it('lets user1 get the funds after the sale', async () => {
  let user1 = accounts[1]
  let user2 = accounts[2]
  let starId = 3
  let starPrice = web3.toWei(.01, "ether")
  await createStar(starId, user1)
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
  await instance.buyStar(starId, { from: user2, value: starPrice })
  let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
  assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
});

it('lets user2 buy a star, if it is put up for sale', async () => {
  let user1 = accounts[1]
  let user2 = accounts[2]
  let starId = 4
  let starPrice = web3.toWei(.01, "ether")
  await createStar(starId, user1)
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
  await instance.buyStar(starId, { from: user2, value: starPrice });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
  let user1 = accounts[1]
  let user2 = accounts[2]
  let starId = 5
  let starPrice = web3.toWei(.01, "ether")
  await createStar(starId, user1)
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
  const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
  await instance.buyStar(starId, { from: user2, value: starPrice, gasPrice: 0 })
  const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
  assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
});

it('lets user1 transfer a star with user2', async () => {
  let user1 = accounts[0]
  let user2 = accounts[1]
  let starId = 6
  await createStar(starId, user1)
  await instance.transferStar(user2, starId, { from: user1 })
  let owner = await instance.ownerOf(starId);
  assert.equal(owner, user2);
});

it('lets user1 and user2 exchange their stars', async () => {
  let user1 = accounts[0]
  let user2 = accounts[1]
  let starId1 = 7
  let starId2 = 8
  await createStar(starId1, user1)
  await createStar(starId2, user2)
  await instance.exchangeStars(starId1, starId2, { from: user1 })
  let owner1 = await instance.ownerOf(starId1);
  let owner2 = await instance.ownerOf(starId2);
  assert.equal(owner1, user2);
  assert.equal(owner2, user1);
});

it('star name and token are set properly', async () => {
  let tokenName = await instance.name();
  let tokenSymbol = await instance.symbol();
  assert.equal(tokenName, 'StarNotary');
  assert.equal(tokenSymbol, 'SNS');
});
