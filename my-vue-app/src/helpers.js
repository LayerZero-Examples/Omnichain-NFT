import { ethers } from "ethers";
import NFTContract from "./abis/OmniChainNFT.json";

const contractInterface = new ethers.utils.Interface(NFTContract.abi);

export function getError(identifier) {
    return contractInterface.getError(identifier);
}

export function getFunctionOptionForMoralis(contractAddress, functionName, params, msgValue) {
    const abi = NFTContract.abi.filter(a => a.name === functionName);
    if (!abi[0]) return null;
    return { contractAddress, functionName, abi, params, msgValue };
}
