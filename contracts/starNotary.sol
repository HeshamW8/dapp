pragma solidity >=0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string story;
        string ra;
        string dec;
        string mag;
    }

    string public name = "StarNotary";
    string public symbol = "SNS";

    mapping(uint256 => Star) _tokensStore;
    mapping(uint256 => bool) tokenIdExists;
    mapping(uint256 => uint256) public starsForSale;

    modifier tokenExists(uint256 _tokenId) {
        require(tokenIdExists[_tokenId] == true, "Token Id does not exist");
        _;
    }

    function createStar(string _name, uint256 _tokenId, string _story, string _ra, string _dec, string _mag) public {
        Star memory newStar = Star(_name, _story, _ra, _dec, _mag);

        _tokensStore[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    function lookUptokenIdToStarInfo(uint256 tokenId) public view returns(string memory) {
        
        Star memory foundStar = _tokensStore[tokenId];

        return (foundStar.name);
    }

    function exchangeStars(uint256 _tokenId0, uint256 _tokenId1) public {
        require(ownerOf(_tokenId0) == msg.sender || ownerOf(_tokenId1) == msg.sender, "Err: The sender does not own any of the stars");
        address exchanger0 = ownerOf(_tokenId0);
        address exchanger1 = ownerOf(_tokenId1);
        _removeTokenFrom(exchanger0, _tokenId0);
        _addTokenTo(exchanger1, _tokenId0);
        _removeTokenFrom(exchanger1, _tokenId1);
        _addTokenTo(exchanger0, _tokenId1);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to, uint256 _tokenId) public {        
        require(ownerOf(_tokenId) == msg.sender, "Err: The sender does not own this star");
        transferFrom(msg.sender, _to, _tokenId);
        // _removeTokenFrom(msg.sender, _tokenId);
        // _addTokenTo(_to, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }
}
