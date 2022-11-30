describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const SMMarketplace = await ethers.getContractFactory("SMMarketplace")
    const smMarketplace = await SMMarketplace.deploy()
    await smMarketplace.deployed()

    let listingPrice = await smMarketplace.getTxCommission()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    console.log({auctionPrice})
    
    /* create two tokens */
    await smMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    await smMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })
    
    const [_, buyerAddress] = await ethers.getSigners()
    await smMarketplace.connect(buyerAddress).buyAsset(1, { value: auctionPrice })

  //   /* execute sale of token to another user */

  //   /* resell a token */
  //   await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

  //   /* query for and return the unsold items */
  //   items = await nftMarketplace.fetchMarketItems()
  //   items = await Promise.all(items.map(async i => {
  //     const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
  //     let item = {
  //       price: i.price.toString(),
  //       tokenId: i.tokenId.toString(),
  //       seller: i.seller,
  //       owner: i.owner,
  //       tokenUri
  //     }
  //     return item
  //   }))
  //   console.log('items: ', items)
  })
})