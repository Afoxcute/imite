// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ConfidentialIPAsset
 * @dev Confidential contract for encrypted IP asset metadata and revenue.
 *      - Encrypted metadata stored as ciphertext (bytes)
 *      - Optional confidential revenue (deploy FHE variant on supported networks for euint64)
 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Optional FHE variant: only compile when targeting an FHE-enabled network (conditional compilation or separate Hardhat config).
// Uncomment and add remappings for @fhevm/solidity to deploy FHE version:
/*
import { FHE, euint64 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialIPAsset is ZamaEthereumConfig, Ownable, ReentrancyGuard {
    struct ConfidentialIP {
        uint256 tokenId;
        address owner;
        bytes encryptedMetadata;  // ciphertext from client-side or FHE
        bytes32 ipHashCommitment; // commitment to ipHash for integrity
        bool exists;
    }
    mapping(uint256 => ConfidentialIP) public confidentialIPs;
    mapping(uint256 => euint64) public confidentialRevenue; // per-tokenId encrypted revenue
    uint256 public nextTokenId = 1;
    event IPRegisteredConfidential(uint256 indexed tokenId, address indexed owner, bytes32 ipHashCommitment);
    event RevenuePaidConfidential(uint256 indexed tokenId);

    function registerIPConfidential(bytes calldata encryptedMetadata_, bytes32 ipHashCommitment_) external returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        confidentialIPs[tokenId] = ConfidentialIP({
            tokenId: tokenId,
            owner: msg.sender,
            encryptedMetadata: encryptedMetadata_,
            ipHashCommitment: ipHashCommitment_,
            exists: true
        });
        confidentialRevenue[tokenId] = FHE.asEuint64(0);
        emit IPRegisteredConfidential(tokenId, msg.sender, ipHashCommitment_);
        return tokenId;
    }
    function payRevenueConfidential(uint256 tokenId, euint64 amount) external nonReentrant {
        require(confidentialIPs[tokenId].exists, "Token does not exist");
        confidentialRevenue[tokenId] = FHE.add(confidentialRevenue[tokenId], amount);
        emit RevenuePaidConfidential(tokenId);
    }
    function getEncryptedMetadata(uint256 tokenId) external view returns (bytes memory) {
        require(confidentialIPs[tokenId].exists, "Token does not exist");
        return confidentialIPs[tokenId].encryptedMetadata;
    }
}
*/

// EVM placeholder: same interface, no FHE (plain bytes and uint256)
contract ConfidentialIPAsset is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}

    struct ConfidentialIP {
        uint256 tokenId;
        address owner;
        bytes encryptedMetadata;
        bytes32 ipHashCommitment;
        bool exists;
    }
    mapping(uint256 => ConfidentialIP) public confidentialIPs;
    mapping(uint256 => uint256) public confidentialRevenue;
    uint256 public nextTokenId = 1;

    error FHEVMRequired();

    event IPRegisteredConfidential(uint256 indexed tokenId, address indexed owner, bytes32 ipHashCommitment);
    event RevenuePaidConfidential(uint256 indexed tokenId);

    function registerIPConfidential(bytes calldata encryptedMetadata_, bytes32 ipHashCommitment_) external returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        confidentialIPs[tokenId] = ConfidentialIP({
            tokenId: tokenId,
            owner: msg.sender,
            encryptedMetadata: encryptedMetadata_,
            ipHashCommitment: ipHashCommitment_,
            exists: true
        });
        confidentialRevenue[tokenId] = 0;
        emit IPRegisteredConfidential(tokenId, msg.sender, ipHashCommitment_);
        return tokenId;
    }

    function payRevenueConfidential(uint256 tokenId, uint256 amount) external payable nonReentrant {
        require(confidentialIPs[tokenId].exists, "Token does not exist");
        require(msg.value == amount && amount > 0, "Invalid amount");
        confidentialRevenue[tokenId] += amount;
        emit RevenuePaidConfidential(tokenId);
    }

    function getEncryptedMetadata(uint256 tokenId) external view returns (bytes memory) {
        require(confidentialIPs[tokenId].exists, "Token does not exist");
        return confidentialIPs[tokenId].encryptedMetadata;
    }
}
