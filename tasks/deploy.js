const layerzeroEndpoints = require("../constants/layerzeroEndpoints.json");
const fs = require("fs");

async function main(taskArgs, hre) {
    console.log(hre.network.name);
    const OmniChainNFT = await hre.ethers.getContractFactory("OmniChainNFT");
    let deployedContracts = [];
    if (fs.existsSync("./deployedContracts.json")) {
        deployedContracts = JSON.parse(fs.readFileSync("./deployedContracts.json"));
    }
    const lastMax = deployedContracts.length === 0 ? 0 : Math.max(...deployedContracts.map(contract => contract.max));
    const start = lastMax;
    const max = lastMax + 100;
    const omniChainNFT = await OmniChainNFT.deploy(
        layerzeroEndpoints[hre.network.name],
        start,
        max
    );
    console.log(start, max)
    await omniChainNFT.deployed();
    const contractConfig = {
        name: hre.network.name,
        address: omniChainNFT.address,
        start,
        max
    };
    if (deployedContracts.filter(contract => contract.name === hre.network.name)[0]) {
        deployedContracts = deployedContracts.map(contract => contract.name === hre.network.name ? contractConfig : contract);
    } else {
        console.log("Hello World");
        deployedContracts.push(contractConfig);
    }
    console.log(deployedContracts);
    console.log(`${hre.network.name} ----- omniChainNFT deployed to: ${omniChainNFT.address}`);
    fs.writeFileSync("./deployedContracts.json", JSON.stringify(deployedContracts));
}

module.exports = main;