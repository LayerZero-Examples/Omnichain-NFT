const fs = require("fs");
const chainIds = require("../constants/chainIds.json");

async function main(taskArgs, hre) {
    const { targetNetwork } = taskArgs;
    const OmniChainNFT = await hre.ethers.getContractFactory("OmniChainNFT");
    let deployedContracts = fs.existsSync("./deployedContracts.json") ? JSON.parse(fs.readFileSync("./deployedContracts.json")) : [];
    const contractConfig = deployedContracts.filter(c => c.name === hre.network.name)[0];
    if (!contractConfig)
        throw `Contract not deployed on ${hre.network.name}`;
    const omniChainNFT = OmniChainNFT.attach(contractConfig.address);
    const targetContract = deployedContracts.filter(c => c.name === targetNetwork)[0];
    if (!targetContract)
        throw `Contract not deployed on ${targetNetwork}`;
    await omniChainNFT.setTrustedRemote(chainIds[targetContract.name], targetContract.address);
}

module.exports = main;