//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NonblockingReceiver.sol";

contract OmniChainNFT is Ownable, ERC721, NonblockingReceiver {
    uint256 counter = 0;
    uint256 nextId = 0;
    uint256 MAX = 100;

    event ReceiveNFT(
        uint16 _srcChainId,
        address _from,
        uint256 _tokenId,
        uint256 counter
    );

    uint256 gasForDestinationLzReceive = 500000;

    constructor(
        address _endpoint,
        uint256 startId,
        uint256 _max
    ) ERC721("OmniChainNFT", "OOCCNFT") {
        endpoint = ILayerZeroEndpoint(_endpoint);
        nextId = startId;
        MAX = _max;
    }

    function mint() external payable {
        require(nextId + 1 <= MAX, "Exceeds supply");
        nextId += 1;
        _safeMint(msg.sender, nextId);
        counter += 1;
    }

    function crossChain(uint16 _dstChainId, uint256 tokenId) public payable {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        // burn NFT
        _burn(tokenId);
        counter -= 1;
        bytes memory payload = abi.encode(msg.sender, tokenId);

        // encode adapterParams to specify more gas for the destination
        uint16 version = 1;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        (uint256 messageFee, ) = endpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        require(
            msg.value >= messageFee,
            "Must send enough value to cover messageFee"
        );

        endpoint.send{value: msg.value}(
            _dstChainId,
            trustedRemoteLookup[_dstChainId],
            payload,
            payable(msg.sender),
            address(0x0),
            adapterParams
        );
    }

    function _LzReceive(
        uint16 _srcChainId,
        bytes memory, /* _srcAddress */
        uint64, /* _nonce */
        bytes memory _payload
    ) internal override {
        // decode
        (address toAddr, uint256 tokenId) = abi.decode(
            _payload,
            (address, uint256)
        );

        // mint the tokens back into existence on destination chain
        _safeMint(toAddr, tokenId);
        counter += 1;
        emit ReceiveNFT(_srcChainId, toAddr, tokenId, counter);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, uint256 _tokenId)
        public
        view
        returns (uint256 messageFee)
    {
        require(
            trustedRemoteLookup[_dstChainId].length > 0,
            "This chain is currently unavailable."
        );
        bytes memory payload = abi.encode(msg.sender, _tokenId);
        // encode adapterParams to specify more gas for the destination
        uint16 version = 1;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );
        (messageFee, ) = endpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );
    }

    function setGasForDestinationLzReceive(uint256 newVal) external onlyOwner {
        gasForDestinationLzReceive = newVal;
    }
}
