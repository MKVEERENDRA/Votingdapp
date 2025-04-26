// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Counters.sol";

contract VotingDApp {
    using Counters for Counters.Counter;

    Counters.Counter private _voterId;
    Counters.Counter private _candidateId;

    // Owner of the contract
    address public owner;

    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address candidateAddress;
        string ipfs;
    }

    struct Voter {
        uint256 voterId;
        string name;
        string image;
        address voterAddress;
        bool voted;
        uint256 vote; // candidateId the voter voted for
        string ipfs;
    }

    // Voting state tracking
    bool public votingStarted = false;
    bool public votingEnded = false;
    // Winner tracking
    address public winningCandidate;
    uint256 public winningVoteCount;
    // Candidate and voter lists
    address[] public candidateAddresses;
    address[] public voterAddresses;
    address[] public votedVoters;

    // Mappings for voters and candidates
    mapping(address => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(uint256 => address) public candidateAddressesById; // New mapping from ID to address

  // Leading candidate tracking
    address public leadingCandidate;
    uint256 public leadingVoteCount;
    // Events
    event CandidateRegistered(uint256 indexed candidateId, string name, string age, string image, address candidateAddress, string ipfs);
    event VoterRegistered(uint256 indexed voterId, string name, string image, address voterAddress, string ipfs);
    event VoteCast(address indexed voterAddress, uint256 candidateId);
    event VotingStarted();
    event VotingEnded(address indexed winner, uint256 voteCount);

    // Constructor to set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    modifier votingNotStarted() {
        require(!votingStarted, "Voting has already started, you cannot register now.");
        _;
    }

    modifier duringVoting() {
        require(votingStarted && !votingEnded, "Voting is not currently active.");
        _;
    }

    modifier voteNotEnded() {
        require(!votingEnded, "Voting has already ended.");
        _;
    }

    // Register as a candidate (only by the owner)
    function registerCandidate(
        address _candidateAddress,  // Accept candidate's address as a parameter
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public onlyOwner votingNotStarted {
        require(candidates[_candidateAddress].candidateAddress == address(0), "This candidate is already registered.");

        _candidateId.increment();
        uint256 idNumber = _candidateId.current();

        candidates[_candidateAddress] = Candidate({
            candidateId: idNumber,
            age: _age,
            name: _name,
            image: _image,
            voteCount: 0,
            candidateAddress: _candidateAddress,
            ipfs: _ipfs
        });

        candidateAddresses.push(_candidateAddress);
        candidateAddressesById[idNumber] = _candidateAddress; // Store the mapping from ID to address

        emit CandidateRegistered(idNumber, _name, _age, _image, _candidateAddress, _ipfs);
    }

    // Register as a voter
    function registerVoter(
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public votingNotStarted {
        require(voters[msg.sender].voterAddress == address(0), "You are already registered as a voter");

        _voterId.increment();
        uint256 idNumber = _voterId.current();

        voters[msg.sender] = Voter({
            voterId: idNumber,
            name: _name,
            image: _image,
            voterAddress: msg.sender,
            voted: false,
            vote: 0, // default no vote
            ipfs: _ipfs
        });

        voterAddresses.push(msg.sender);
        emit VoterRegistered(idNumber, _name, _image, msg.sender, _ipfs);
    }

    // Start the voting process
    function startVoting() public voteNotEnded onlyOwner {
        require(candidateAddresses.length > 0, "No candidates are registered.");
        require(voterAddresses.length > 0, "No voters are registered.");
        require(!votingStarted, "Voting has already started.");

        votingStarted = true; // Set votingStarted to true
        votingEnded = false;  // Ensure votingEnded is false when starting
        emit VotingStarted();  // Emit event when voting starts
    }

     // End the voting process
    function endVoting() public duringVoting onlyOwner {
        votingEnded = true; // Set votingEnded to true
        votingStarted = false; // Ensure votingStarted is set to false when voting ends
        determineWinner(); // Determine the winner when voting ends
        emit VotingEnded(winningCandidate, winningVoteCount);    
    }

 
    // Determine the winner after voting ends
    function determineWinner() internal {
        uint256 highestVoteCount = 0;
        address leadingCandidateAddress;

        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddr = candidateAddresses[i];
            uint256 currentVoteCount = candidates[candidateAddr].voteCount;

            if (currentVoteCount > highestVoteCount) {
                highestVoteCount = currentVoteCount;
                leadingCandidateAddress = candidateAddr;
            }
        }

        winningCandidate = leadingCandidateAddress;
        winningVoteCount = highestVoteCount;
    }


function vote(uint256 candidateId) public duringVoting {
    Voter storage voter = voters[msg.sender];
    require(voter.voterAddress != address(0), "You are not registered as a voter.");
    require(!voter.voted, "You have already voted.");
    require(candidateAddressesById[candidateId] != address(0), "Invalid candidate ID."); // Check using mapping
    
    // Update the vote count for the candidate
    candidates[candidateAddressesById[candidateId]].voteCount += 1; // Use the mapping to get the address

    voter.voted = true;
    voter.vote = candidateId;

    votedVoters.push(msg.sender);

    emit VoteCast(msg.sender, candidateId);
}


    // Get all candidate addresses
    function getCandidates() public view returns (address[] memory) {
        return candidateAddresses;
    }

    // Get candidate count
    function getCandidateLength() public view returns (uint256) {
        return candidateAddresses.length;
    }

// Reset voting process (owner-only)
function resetVoting() public onlyOwner {
    require(votingEnded, "Voting must end before resetting.");

    // Reset all voters
    for (uint256 i = 0; i < voterAddresses.length; i++) {
        delete voters[voterAddresses[i]]; // Resets the voter struct
    }
    delete voterAddresses; // Clears the array

    // Reset all candidates
    for (uint256 i = 0; i < candidateAddresses.length; i++) {
        delete candidates[candidateAddresses[i]]; // Resets the candidate struct
    }
    delete candidateAddresses; // Clears the array

    // Clear the list of voters who have voted
    delete votedVoters; // Clears the voted voters array

    // Reset counters
    _voterId._value = 0; // Resetting to zero instead of using reset()
    _candidateId._value = 0; // Resetting to zero instead of using reset()

    // Reset voting state variables
    votingStarted = false; // Ensure votingStarted is reset to false
    votingEnded = false;   // Ensure votingEnded is reset to false

    // Reset winner details
    winningCandidate = address(0); // Reset winner's address
    winningVoteCount = 0; // Reset winner's vote count

    // Reset leading candidate details
    leadingCandidate = address(0); // Reset leading candidate's address
    leadingVoteCount = 0; // Reset leading candidate's vote count
}


// Determine the leading candidate
function determineLeadingCandidate() public view duringVoting returns (address, uint256) {
    uint256 highestVoteCount = 0;
    address leadingCandidateAddress;

    for (uint256 i = 0; i < candidateAddresses.length; i++) {
        address candidateAddr = candidateAddresses[i];
        uint256 currentVoteCount = candidates[candidateAddr].voteCount;

        if (currentVoteCount > highestVoteCount) {
            highestVoteCount = currentVoteCount;
            leadingCandidateAddress = candidateAddr;
        }
    }
    
    return (leadingCandidateAddress, highestVoteCount);
}

    // Get candidate details
    function getCandidateData(address _address)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        Candidate memory candidate = candidates[_address];
        return (
            candidate.age,
            candidate.name,
            candidate.candidateId,
            candidate.image,
            candidate.voteCount,
            candidate.ipfs,
            candidate.candidateAddress
        );
    }

    // Get all voter addresses
    function getVoters() public view returns (address[] memory) {
        return voterAddresses;
    }

    // Get voter count
    function getVoterCount() public view returns (uint256) {
        return voterAddresses.length;
    }

    // Get voter details
    function getVoterData(address _address)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            bool,
            uint256,
            string memory
        )
    {
        Voter memory voter = voters[_address];
        return (
            voter.voterId,
            voter.name,
            voter.image,
            voter.voterAddress,
            voter.voted,
            voter.vote,
            voter.ipfs
        );
    }

    // Get list of voters who voted
    function getVotedVoters() public view returns (address[] memory) {
        return votedVoters;
    }

    // Get voted voters count
    function getVotedVotersCount() public view returns (uint256) {
        return votedVoters.length;
    }
}
