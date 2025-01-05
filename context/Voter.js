import React,{useContext,useState,useEffect} from "react";
import {ethers} from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import {votingAddress,votingABI} from "../context/constants";
const fetchContract = (signerOrProvider) => new ethers.Contract(votingAddress, votingABI, signerOrProvider);
const uei="https://eth-sepolia.g.alchemy.com/v2/BTeFNsqvZQ3n6WacRdUT1P4U-KSXkaOA";
export const VotingContext =React.createContext();
export const VotingProvider = ({children})=>{
    const votingTitle ="My dapp  ";
    const router=useRouter();
    const [currentAccount,setCurrentAccount] = useState('');
    const [candidate,setCandidate] = useState("");
    const [CandidateLength,setCandidateLength] =useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [ipfs, setIpfs] = useState("");
    const [ipfs1, setIpfs1] = useState("");

    const pushCandedate =[];
    const condidateIndex =[];
    const [candidateArray,setCandidateArray] = useState(pushCandedate);
    const [winner, setWinner] = useState(null); // State to hold the winner

    const [error,setError] =useState('');
    const pushVoters =[];
    const [voterArray,setVoterArray] = useState(pushVoters);
    const [voterlength,setVoterLength] = useState([]);
    const [voterAddress,setVoterAddress] =useState([]);
    const handleAccountChange = () => {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length === 0) {
              // User disconnected
              setCurrentAccount("");
              setIsConnected(false);
              setError("Disconnected from MetaMask. Please reconnect.");
              // Optionally reload the page
            } else {
              setCurrentAccount(accounts[0]);
            }
          });
        }
      };

    const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setCurrentAccount(address);
    }
  }, [isConnected, address]);

  useEffect(() => {
    const initializeProvider = async () => { 
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(browserProvider);
          console.log("Connected to Ethereum network");
          const walletSigner = await browserProvider.getSigner();
          setSigner(walletSigner);
          console.log("Connected to MetaMask");
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          toast.error("MetaMask connection failed");
           
        }
      } else {
        const defaultProvider = ethers.getDefaultProvider();
        setProvider(defaultProvider);
        setOpenerror(true),
        error(" MetaMask not installed; using read-only defaults");


      }
    };
    initializeProvider();
  }, []);
const connectwithsmartContract = async () =>{
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    console.log("Connected to Ethereum network1",browserProvider);
    const walletSigner = await browserProvider.getSigner();
    console.log("Connected to MetaMask1",walletSigner);
    const contract = fetchContract(walletSigner);
    console.log("contract", contract);
    return contract;
  } catch (error) {
    console.error("Error connecting to MetaMask1:", error);
    toast.error("MetaMask connection failed1");
  }
}
      // const connectWallet = async () => {
      //   if (!window.ethereum) return setError("Please install MetaMask");
      //   try {
      //     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      //     setCurrentAccount(accounts[0]);
      //     setIsConnected(true);
         
      //     setError(""); // Clear error on successful connection
      //     window.location.reload();

      //   } catch (err) {
         
      //       setError("Error connecting to MetaMask: " + err.message); // Ensure it's a string
      //   }
      // };
      // Check if connected to MetaMask
      // const checkIfconn  = async () => {
      //   if (!window.ethereum) return setError("Please install MetaMask");
      //   const account = await window.ethereum.request({ method: "eth_accounts" });
      //   if (account.length) {
      //     setCurrentAccount(account[0]);
      //     setIsConnected(true);
      //   } else {
      //     setError("Please Connect to Wallet");
      //     setIsConnected(false);
      //   }
      // };
  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: '243ce9acc91f9ed354ca',
            pinata_secret_api_key: 'bd96c34e962cf1686d70350205562b36190ebf8c61058601e98a750dbe9d2ca8',
          },
        });
        const ipfsHash = response.data.IpfsHash || response.data.ipfsHash;
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        console.log("IPFS uploaded:", ImgHash);
        return ImgHash;
      } catch (e) {
        console.error("Error uploading file:", e);
        setError(e);
        return null;
      }
    }
  };

// const connectwithsmartContract = async () =>{
//   try {
//     const web3Modal = new Web3Modal({
//         cacheProvider: true, // Optional
//         providerOptions: {}, // Add any providers you want to support
//     });
//     console.log("xsa", web3Modal);

//     // Connect to the wallet
//     const provider = await web3Modal.connect();
//     console.log("xsa", provider);

//     // Create a Web3 provider using ethers.js
//     const ethersProvider = new ethers.providers.Web3Provider(provider);
// console.log("xsa", ethersProvider);
//     // Get the signer to sign transactions
//     const signer = ethersProvider.getSigner();
//     console.log("signer", signer);
//     // Fetch your smart contract instance
//     const contract = fetchContract(signer);
//     console.log("xsa", contract);
//     return contract;
//   } catch (error) {
//     console.error("Error connecting to MetaMask1:", error);
//     setError(error);
//   }
// };
const createVoter = async (name, image) => {
    try {
        // Log the inputs
        console.log("Creating voter with", { name, image });
if(!name || !image ) {
    console.error("Incomplete data provided");
    return; // Return early if incomplete data is found
}
 const data = JSON.stringify({ name,  image });
try {
  const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: '243ce9acc91f9ed354ca',
      pinata_secret_api_key: 'bd96c34e962cf1686d70350205562b36190ebf8c61058601e98a750dbe9d2ca8',
    },
  });
  if (response.data && response.data.IpfsHash) {
    const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    console.log("IPFS URL:", ipfs);
    setIpfs(ipfs);
  


  } else {
    throw new Error("IPFS hash is missing in the response");

  }
} catch (e) {
  console.error("Error uploading data to IPFS:", e.message);
  setError(error);
}

        // Initialize Web3Modal
        const web3Modal = new Web3Modal({
            cacheProvider: true, // Optional
            providerOptions: {}, // Add any providers you want to support
        });
        console.log("xsa", web3Modal);

        // Connect to the wallet
        const provider = await web3Modal.connect();
        console.log("xsa", provider);

        // Create a Web3 provider using ethers.js
        const ethersProvider = new ethers.providers.Web3Provider(provider);
console.log("xsa", ethersProvider);
        // Get the signer to sign transactions
        const signer = ethersProvider.getSigner();
        console.log("signer", signer);
        // Fetch your smart contract instance
        const contract = fetchContract(signer);
        console.log("xsa", contract);

        // Call the registerVoter function from the smart contract
        const tx = await contract.registerVoter(name, image, ipfs);
        
        console.log("Voter created", tx);
        
        // Wait for the transaction to be confirmed
        await tx.wait();

        // Navigate to the allowed voters page after successful registration
        router.push("/voterList");
        
    } catch (error) {
        console.error("Error creating voter:", error);
        setError(error); // Assuming setError is a state setter for error handling
    }
};
const getAllVoter = async () => {
    try {
              const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);


        // Clear the arrays to avoid duplicating data
        const freshVotersArray = [];

        // Fetch voter addresses (or IDs)
        const voters = await contract.getVoters();
        console.log("Voters fetched:", voters);

        // Use Promise.all to ensure all asynchronous fetches complete
        await Promise.all(
            voters.map(async (el) => {
                const voterData = await contract.getVoterData(el);
                
                // Access voter data, including the image at index 2 (for instance)
                freshVotersArray.push({
                    voterId: voterData[0].toNumber(),  // Voter ID (BigNumber converted)
                    name: voterData[1],               // Voter name
                    image: voterData[2],              // Image URL (IPFS or other)
                    voterAddress: voterData[3],       // Voter's Ethereum address
                    voted: voterData[4],              // Boolean indicating if voted
                    vote: voterData[5].toNumber(),    // Vote (BigNumber converted)
                    ipfs: voterData[6],               // IPFS link or other info
                });

                console.log("Voter Data:", voterData[6]);
            })
        );

        // Set state with the cleaned array
        setVoterArray(freshVotersArray);
        setVoterLength(freshVotersArray.length); // Ensure you update the length based on the fresh data

        console.log("Final Voter Array:", freshVotersArray);

    } catch (error) {
        console.error("Error fetching voters", error);
        setError(error); // Assuming setError is a state setter for error handling
    }
};

useEffect(()=>{
getAllVoter();
getCandidates();
handleAccountChange();
checkIfconn();

},[]);
const startVoting = async () => {
    try {
        const contract = await connectwithsmartContract();
        const tx = await contract.startVoting();
        await tx.wait();
        console.log("Voting started:", tx);
window.location.reload();
    } catch (error) {
        console.error("Error starting voting", error);
        setError("You are Not The Owner To start the voting process"+error.message);
    }
};
const checkVotingEnded = async () => {
    try {
   const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);
        const hasVotingEnded = await contract.votingEnded(); // Assuming votingEnded() is a contract method
        return hasVotingEnded;
    } catch (error) {
        console.error("Error checking if voting has ended:", error);
        setError(error);
        return false; // Return false if there's an error
    }
};
const checkVotingStart = async () => {
    try {
   const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);
        const hasVotingstart = await contract.votingStarted(); // Assuming votingEnded() is a contract method
        return hasVotingstart;
    } catch (error) {
        console.error("Error checking if voting has ended:", error);
        setError(error);
        return false; // Return false if there's an error
    }
};
const endVoting = async () => {
    try {
      // Connect to the smart contract
      const contract = await connectwithsmartContract();
      
      // Call endVoting() function on the contract
      const tx = await contract.endVoting();
      
      // Wait for the transaction to be mined/confirmed
      await tx.wait();
      console.log("Voting ended:", tx);
      
      // Fetch the winning candidate's address directly
      const winningCandidate = await contract.winningCandidate(); // Assuming you have a function to get the winning candidate
  
      if (winningCandidate === "0x0000000000000000000000000000000000000000") {
        setError("No winner, the zero address was returned.");
        setWinner({
          candidate: "No Winner",
          voteCount: 0,
        });
      } else {
        // Fetch candidate details using the winningCandidate address
        const candidateData = await contract.getCandidateData(winningCandidate);
  
        const voteCount = candidateData[4]; // Assuming voteCount is the 5th element in the returned array
        
        const winnerDetails = {
          age: candidateData[0],           // age
          name: candidateData[1],          // name
          candidateId: candidateData[2],   // candidateId
          imageUrl: candidateData[3],      // image
          voteCount: candidateData[4],             // voteCount
          ipfs: candidateData[5],           // ipfs
          address: candidateData[6]         // candidateAddress
        };
  
        console.log("Winner:", winnerDetails);
        setWinner(winnerDetails); // Set winner details in context or state
  
        // Navigate to the Winner page with all the candidate details
        router.push({
          pathname: '/winner',
          query: {
            candidate: winnerDetails.name,
            voteCount: winnerDetails.voteCount,
            imageUrl: winnerDetails.imageUrl,
            address: winnerDetails.address,
            age: winnerDetails.age
          },
        });
      }
    } catch (error) {
      // Handle errors (such as the user not being the owner)
      console.error("Error ending voting:", error);
      setError("You are not the owner to end the voting process.");
    }
  };

// Reset voting (only by owner)
const resetVoting = async () => {
    try {
        const contract = await connectwithsmartContract(); // Ensure you are connected to the contract
        const tx = await contract.resetVoting(); // Call the resetVoting function on the smart contract
        await tx.wait(); // Wait for the transaction to be confirmed
        console.log("Voting has been reset:", tx);
        window.location.reload(); // Refresh the page to reflect the updated state
    } catch (error) {
        console.error("Error resetting voting", error); // Handle any errors that occur during the process
        setError("You are Not The Owner To Restart the voting process");

    }
};

// Vote for a candidate
const vote = async (candidateId) => {
    try {
        const contract = await connectwithsmartContract();
        const tx = await contract.vote(candidateId);
        
        await tx.wait();
        console.log("Vote cast:", tx);
    } catch (error) {
        console.error("Error casting vote", error);
        setError("Pls First Resister As a Voter in NavBar,If its not sloved then contact to veerendravamshi@gmail.com",error);

    }
};
const registerCandidate = async (candidateAddress, age, name, image, ipfs) => {
    try {
        console.log("Creating voter with", { name, image });
        if(!name || !image ) {
            console.error("Incomplete data provided");
            setError("Incomplete data provided")
            return; // Return early if incomplete data is found
        }
         const data = JSON.stringify({ candidateAddress, age, name, image, ipfs });
        try {
          const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
            headers: {
              'Content-Type': 'application/json',
              pinata_api_key: '243ce9acc91f9ed354ca',
              pinata_secret_api_key: 'bd96c34e962cf1686d70350205562b36190ebf8c61058601e98a750dbe9d2ca8',
            },
          });
          if (response.data && response.data.IpfsHash) {
            const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log("IPFS URL:", ipfs);
            setIpfs1(ipfs);
          
        
        
          } else {
            throw new Error("IPFS hash is missing in the response");
        
          }
        } catch (e) {
          console.error("Error uploading data to IPFS:", e.message);
          setError(e.message);
        }
        const contract = await connectwithsmartContract();
        const tx = await contract.registerCandidate(candidateAddress, age, name, image, ipfs1);
        await tx.wait();
        console.log("Candidate registered:", tx);
        window.location.href = "/";

    } catch (error) {
        console.error("Error registering candidate", error);
    }
};
// Get all candidate addresses
const getCandidates = async () => {
    try {
   const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);
        // Clear the arrays to avoid duplicating data
        const freshCandidatesArray = [];
        const freshCandidateIndex = [];

        // Fetch candidate addresses
        const candidates = await contract.getCandidates();
        console.log("Candidates fetched:", candidates);

        // Use Promise.all to ensure all asynchronous fetches complete
        await Promise.all(
            candidates.map(async (el) => {
                const candidateData = await contract.getCandidateData(el);
                
                // Access candidate data, including the image at index 3
                freshCandidatesArray.push({
                    name: candidateData[0],      // Candidate name
                    age: candidateData[1],       // Candidate age
                    candidateNumber: candidateData[2].toNumber(), // Candidate number (BigNumber converted)
                    imageUrl: candidateData[3],  // Image URL (IPFS link or other)
                    voteCount: candidateData[4].toNumber(), // Vote count (BigNumber converted)
                    address: candidateData[6],   // Candidate's Ethereum address
                });

                freshCandidateIndex.push(candidateData[2].toNumber());

                console.log("Candidate Data:", candidateData);
            })
        );

        // Set state with the cleaned array
        setCandidateArray(freshCandidatesArray);
        setCandidateLength(freshCandidatesArray.length); // Ensure you update the length based on the fresh data

        console.log("Final Candidate Array:", freshCandidatesArray);
        console.log("Candidate Indexes:", freshCandidateIndex);

    } catch (error) {
        console.error("Error fetching candidates", error);
    }
};


const getCandidateData = async (candidateAddress) => {
    try {
   const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);
        const candidateData = await contract.getCandidateData(candidateAddress);
        console.log("Candidate data:", candidateData);
        return candidateData;
    } catch (error) {
        console.error("Error fetching candidate data", error);
    }
};

// Inside VotingContext
const determineLeadingCandidate = async () => {
    try {
   const provider2 = new ethers.JsonRpcProvider(uei);
        const contract = await fetchContract(provider2);
        const [leadingCandidateAddress, leadingVoteCount] = await contract.determineLeadingCandidate();

        // Fetch additional candidate data like name or other details if needed
        const candidateData = await contract.getCandidateData(leadingCandidateAddress);

        return {
            candidateAddress: leadingCandidateAddress,
            voteCount: leadingVoteCount.toNumber(), // Convert BigNumber to number
            name: candidateData[0], // Assuming name is at index 1 in the candidateData
        image:candidateData[3],
        };
    } catch (error) {
        console.error("Error fetching leading candidate:", error);
        setError(error);
        return null;
    }
};

    return(
        <VotingContext.Provider value={{votingTitle,checkIfconn,connectWallet,uploadToIPFS,
            getCandidates,startVoting,endVoting,vote,determineLeadingCandidate,checkVotingEnded,
            getCandidateData,registerCandidate,error,getAllVoter,resetVoting,winner,checkVotingStart,
            voterArray,voterAddress,voterlength,currentAccount,CandidateLength,candidateArray,pushCandedate,
            createVoter}}>{children}</VotingContext.Provider>
    )
}

