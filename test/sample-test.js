
describe("SMMarketplace", function() {
  it("Should create and buy asset NFT", async function() {
    
    /* deploy the marketplace */
    const SMMarketplace = await hre.ethers.getContractFactory("SMMarketplace")
    const smMarketplace = await SMMarketplace.deploy()
    await smMarketplace.deployed()

    let commission = await smMarketplace.getTxCommission()
    commission = commission.toString()

    const price = ethers.utils.parseUnits('1', 'ether')

    console.log({
      commission,
      price,
    });

    /* create two nfts */
    await smMarketplace.newAsset("https://www.mytokenlocation.com", price, { value: commission })
    await smMarketplace.newAsset("https://www.mytokenlocation2.com", price, { value: commission })
    
    console.log("========= Before =========");
    console.log(await smMarketplace.getAsset(1));
    console.log(await smMarketplace.getAsset(2));

    const [_, buyerAddress] = await ethers.getSigners()

    await smMarketplace.connect(buyerAddress).buyAsset(1, { value: price })
    await smMarketplace.connect(buyerAddress).buyAsset(2, { value: price })
    
    console.log("========= After =========");
    console.log(await smMarketplace.getAsset(1));
    console.log(await smMarketplace.getAsset(2));

  })
})