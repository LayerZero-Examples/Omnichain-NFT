import { Button, ConnectButton, DatePicker, Icon, Input, Select, Card, useNotification } from "web3uikit";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState } from "react";
import nftContract from "../abis/OmniChainNFT.json";
import { getFunctionOptionForMoralis } from "../helpers";

function Home() {
    const { Moralis, chainId, account } = useMoralis();
    const network = nftContract.networks.filter(n => n.chainId === chainId)[0];
    const [nfts, setNfts] = useState([]);
    const contractProcessor = useWeb3ExecuteFunction();
    const dispatch = useNotification();


    useEffect(() => {
        if (!network || !account) return;
        (async () => {
            const nfts = await Moralis.Web3API.account.getNFTs({ chain: network.chainId, token_addresses: [network.address] });
            setNfts(nfts.result);
        })();
    }, [network, account]);


    function handleSuccess(message) {
        dispatch({
            type: 'success',
            message,
            title: 'Mint Successful',
            position: 'topL',
        });
    }

    function handleError(error) {
        let errorMsg = "Something went wrong";
        if (error.code === 1) {
            errorMsg = "Please switch to Rinkeby Network";
        } else if (error.code === 4001) {
            errorMsg = "User denied the request";
        } else {
            try {
                const errorF = error.error.data.originalError.data
                errorMsg = errorF;
            } catch (err) {
            }
        }
        dispatch({
            type: 'error',
            message: `${errorMsg}`,
            title: 'Booking Failed',
            position: 'topL',
        });
    }

    async function mintNFT() {
        const options = getFunctionOptionForMoralis(network.address, "mint", {}, "0");
        await contractProcessor.fetch({
            params: options,
            onSuccess() {
                handleSuccess(`Nice! You have minted you nft`);
            },
            onError(error) {
                handleError(error);
            }
        })
    }

    async function transferMFT(tokenId) {
        const _dstChainId = nftContract.networks.filter(n => n.chainId !== chainId)[0].lzChainId;

        let fee;
        try {
            const options = getFunctionOptionForMoralis(network.address, "estimateFees", { _dstChainId, _tokenId: tokenId }, "0");
            fee = await (new Promise(async (resolve, reject) => {
                await contractProcessor.fetch({
                    params: options,
                    onSuccess: resolve,
                    onError: reject
                });
            }));
        } catch (err) {
            handleError(err);
            return;
        }
        const options = getFunctionOptionForMoralis(network.address, "crossChain", { _dstChainId, tokenId }, fee);
        await contractProcessor.fetch({
            params: options,
            onSuccess() {
                handleSuccess(`Nice! You have transferred you nft`);
            },
            onError(error) {
                handleError(error);
            }
        });
    }

    console.log(nfts)
    return <div className="container mx-auto px-10 pt-10">
        <div className="grid grid-cols-3 gap-10">
            <div className="">
                <div className="border-2 border-gray-500 border-dotted p-4 rounded-lg">
                    <div className="text-center text-xl mb-5">Mint NFT</div>
                    <div className="">
                        <button className="bg-indigo-500 text-md hover:bg-indigo-600 rounded-lg  text-center text-white w-full" onClick={mintNFT}>Mint</button>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <div className="text-2xl">Your NFTs</div>
                {nfts.length === 0 ? <div className="text-lg text-red-600 mt-5">No NFTs Available</div> : <div className="grid grid-cols-3 gap-3 mt-3">
                    {nfts.map((nft, i) => <Card key={i} children={[<div>
                        <p className="text-xl">Token ID: #{nft.token_id}</p>
                        <div className="">
                            <button onClick={() => transferMFT(nft.token_id)} className="block bg-indigo-500 w-full py-2 rounded-lg mt-3 text-white text-center">Transfer</button>
                        </div>
                    </div>]} />
                    )}
                </div>

                }
            </div>
        </div>
    </div>
}

export default Home;