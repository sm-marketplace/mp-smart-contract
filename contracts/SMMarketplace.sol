// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * Code based on: https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/NFTMarketplace.sol
 */

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract SMMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;
    Counters.Counter private _itemsSold;

    //FIXME: la comision debe ser un porcentaje
    //TODO: debe definirse un monto minimo para los assets (este monto debe ser mayor que la comision) 
    uint256 txCommission = 0.025 ether; // 25000000000000000 wei (1 wei = 10^-18 ETH)
    address payable owner;

    mapping(uint256 => Asset) private idToAsset;

    struct Asset {
        uint256 id;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event AssetCreated(
        uint256 indexed id,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("SM Marketplace", "FC") {
        owner = payable(msg.sender); // Quien deploya el contrato en la red
    }

    function _ownerUpdateTxCommission(uint256 _txCommission) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        txCommission = _txCommission;
    }

    function _ownerGetTxCommission() public view returns (uint256) {
        return txCommission;
    }

    function _ownerCollect() public payable {
        require(
            msg.sender==owner,
            "Only marketplace owner can collect."
        );

        uint balance = address(this).balance;
        owner.transfer(balance);
    }

    /* Mints a token and lists it in the marketplace */
    function _createToken(string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        _ids.increment();
        uint256 newId = _ids.current();

        // Mints id and transfers it to to.
        _mint(
            /*to=*/
            msg.sender,
            /*id=*/
            newId
        );
        _setTokenURI(newId, tokenURI);
        // createMarketItem(newId, price);
        return newId;
    }

    function _mpNewAsset(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == txCommission,
            "Price must be equal to listing price"
        );

        uint256 newId = _createToken(tokenURI);

        idToAsset[newId] = Asset(
            newId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        // transferimos el token al address del contract ya que
        // como el token estará en venta, el contract necesita
        // poder mas adelante poder transferirlo a su nuevo dueno
        _transfer(msg.sender, address(this), newId);

        emit AssetCreated(newId, msg.sender, address(this), price, false);

        return newId;
    }

    function _mpBuyAsset(uint256 id) public payable {
        uint256 price = idToAsset[id].price;
        address seller = idToAsset[id].seller;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToAsset[id].owner = payable(msg.sender);
        idToAsset[id].sold = true;
        idToAsset[id].seller = payable(address(0));

        _itemsSold.increment();
        _transfer(address(this), msg.sender, id);

        // FIXME: la comision debe salir del monto de mgs.value, seria:
        // pay to seller: msg.value - txCommission
        // pay to owner : txCommission
        // payable(owner).transfer(txCommission); // pago de commission al owner

        // se resta el valor de la comision al monto total de la compra
        // payable(seller).transfer(msg.value - txCommission); // transferencia al vendedor

        // se transfiere todo el monto al vendedor
        // ya que la comision solo se cobra al publicar el asset,
        // mas no al venderlo, de esta forma el vendedor puede tener un margen
        // de ganancia siempre que ofrezca el asset al precio:
        // txComision + margenGanancia = precioOfrecido 
        payable(seller).transfer(msg.value); // transferencia al vendedor
    }

    function _mpResellAsset(uint256 assetId, uint256 price) public payable {
        require(idToAsset[assetId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == txCommission, "Price must be equal to listing price");
        idToAsset[assetId].sold = false;
        idToAsset[assetId].price = price;
        idToAsset[assetId].seller = payable(msg.sender);
        idToAsset[assetId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), assetId);
    }

    function _mpGetAsset(uint256 id) public view returns (Asset memory) {
        return idToAsset[id];
    }

    function _mpGetNumberOfAssets() public view returns (uint256) {
        return _ids.current();
    }

    function _mpGetAllItemsToSell() public view returns (Asset[] memory) {
        uint itemCount = _ids.current();
        uint unsoldItemCount = _ids.current() - _itemsSold.current();
        uint currentIndex = 0;

        Asset[] memory items = new Asset[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToAsset[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                Asset storage currentItem = idToAsset[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function _mpGetMyOwnAssets() public view returns (Asset[] memory) {
        uint totalItemCount = _ids.current();
        uint itemCount = 0;
        uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToAsset[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      Asset[] memory items = new Asset[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToAsset[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          Asset storage currentItem = idToAsset[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function _mpGetMyAssetsToSell() public view returns (Asset[] memory) {
        uint totalItemCount = _ids.current();
        uint itemCount = 0;
        uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToAsset[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      Asset[] memory items = new Asset[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToAsset[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          Asset storage currentItem = idToAsset[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}
