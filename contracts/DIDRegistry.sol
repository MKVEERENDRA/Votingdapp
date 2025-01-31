// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    address public owner;

    struct DID {
        string did;  // The DID issued to the user
        bool verified; // Whether the DID is verified
        string aadhaar;  // Aadhaar number (in a real case, this would be validated)
    }

    mapping(address => DID) public dids;  // Mapping user addresses to their DIDs and Aadhaar

    // Event emitted when a DID is issued
    event DIDIssued(address indexed user, string did);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the government (owner) can issue DIDs.");
        _;
    }

    constructor() {
        owner = msg.sender; // The government (contract deployer) is the owner
    }

    // Function to issue a DID based on Aadhaar (only the government can do this)
    function issueDID(address user, string memory did, string memory aadhaar) public onlyOwner {
        require(bytes(did).length > 0, "DID must be provided.");
        require(bytes(aadhaar).length > 0, "Aadhaar number must be provided.");
        require(bytes(dids[user].did).length == 0, "DID already issued to this user.");

        // Simulating Aadhaar verification (in a real case, you would validate with a backend)
        require(validateAadhaar(aadhaar), "Invalid Aadhaar number.");
        
        // Issue the DID and store it
        dids[user] = DID(did, false, aadhaar);  // Store the DID, Aadhaar, and verification status

        emit DIDIssued(user, did);  // Emit an event that the DID was issued
    }

    // Simulating the Aadhaar validation (In real-world, this would be verified via backend)
    function validateAadhaar(string memory aadhaar) private pure returns (bool) {
        // Simulate Aadhaar number validation here (e.g., length check, regex validation)
        return bytes(aadhaar).length == 12;  // Example: assuming Aadhaar is 12 digits
    }

    // Function to verify a DID (users will submit their DID and it will be checked)
    function verifyDID(address user) public view returns (bool, string memory, string memory) {
        require(bytes(dids[user].did).length > 0, "No DID issued for this user.");
        
        // Return the DID and the verification status
        return (dids[user].verified, dids[user].did, dids[user].aadhaar);
    }

    // Function to mark the DID as verified (this would be done after some manual validation)
    function verifyUserDID(address user) public onlyOwner {
        require(bytes(dids[user].did).length > 0, "No DID issued for this user.");
        dids[user].verified = true;  // Mark the DID as verified

        emit DIDIssued(user, dids[user].did);  // Emit an event for verification
    }
}
