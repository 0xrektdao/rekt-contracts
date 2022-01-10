// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract RektToken is ERC20 {
    bytes32 public immutable merkleRoot;

    mapping(address => bool) public hasClaimed;

    error AlreadyClaimed();
    error NotInMerkle();

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        bytes32 _merkleRoot
    ) ERC20(_name, _symbol, _decimals) {
        merkleRoot = _merkleRoot;
    }

    event Claim(address indexed to, uint256 amount);

    function claim(
        address to,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        if (hasClaimed[to]) revert AlreadyClaimed();

        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();

        hasClaimed[to] = true;

        _mint(to, amount);

        emit Claim(to, amount);
    }
}
