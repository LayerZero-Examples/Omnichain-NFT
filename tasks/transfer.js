const fs = require("fs");
// const { ethers } = require("hardhat");
const chainIds = require("../constants/chainIds.json");

async function main(taskArgs, hre) {
    const { targetNetwork, tokenId } = taskArgs;
    const signer = await hre.ethers.getSigner();
    const OmniChainNFT = await hre.ethers.getContractFactory("OmniChainNFT");
    let deployedContracts = fs.existsSync("./deployedContracts.json") ? JSON.parse(fs.readFileSync("./deployedContracts.json")) : [];
    const contractConfig = deployedContracts.filter(c => c.name === hre.network.name)[0];
    if (!contractConfig)
        throw `Contract not deployed on ${hre.network.name}`;
    const omniChainNFT = OmniChainNFT.attach(contractConfig.address);
    const targetContract = deployedContracts.filter(c => c.name === targetNetwork)[0];
    if (!targetContract)
        throw `Contract not deployed on ${targetNetwork}`;
    const messageFee = await omniChainNFT.estimateFees(chainIds[targetContract.name], tokenId);
    await omniChainNFT.crossChain(chainIds[targetContract.name], tokenId, { value: messageFee });
}

module.exports = main;