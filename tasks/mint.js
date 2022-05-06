const fs = require("fs");

async function main(taskArgs, hre) {
    const signer = await hre.ethers.getSigner();
    const OmniChainNFT = await hre.ethers.getContractFactory("OmniChainNFT");
    let deployedContracts = fs.existsSync("./deployedContracts.json") ? JSON.parse(fs.readFileSync("./deployedContracts.json")) : [];
    const contractConfig = deployedContracts.filter(c => c.name === hre.network.name)[0];
    if (!contractConfig)
        throw `Contract not deployed on ${hre.network.name}`;
    const omniChainNFT = OmniChainNFT.attach(contractConfig.address);
    const tx = await omniChainNFT.mint();
    const { events } = await tx.wait(1);
    const { tokenId } = events[0].args;
    const balance = await omniChainNFT.balanceOf(signer.address);
    console.log(`${hre.network.name} NFT balance: `, balance.toString());
    const owner = await omniChainNFT.ownerOf(tokenId);
    console.log(`Token ${tokenId} owner: `, owner);
    deployedContracts = deployedContracts.map(c => c.name === hre.network.name ? { ...c, lastNft: Number(tokenId) } : c);
    fs.writeFileSync("./deployedContracts.json", JSON.stringify(deployedContracts));
}

module.exports = main;