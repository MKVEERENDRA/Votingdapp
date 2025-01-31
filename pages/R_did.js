import React, { useState, useContext, useEffect } from 'react';
import Style from '../styles/did.module.css'; // Import your CSS module for styling

import { VotingContext } from '../context/Voter';

const R_did = () => {
  const [aadhaar, setAadhaar] = useState('');  // Aadhaar input
  const [message, setMessage] = useState('');  // Message to display status
  const [loading, setLoading] = useState(false);  // Loading state
  const [jwt, setJwt] = useState(null); // Store JWT for verification
  
  const { createDid, createDidJwt, verifyDidJwt, verifyUserDID, issueDID, fetchDID, currentAccount } = useContext(VotingContext); // Get functions from context

  // Effect to check if JWT exists in localStorage and verify it
  useEffect(() => {
    const storedJwt = localStorage.getItem('userJWT');
  
  }, []);

  // Function to handle the button click
  const handleGenerateJWT = async () => {
    if (!aadhaar) {
      setMessage('Please enter a valid Aadhaar number.');
      return;
    }

    // Simple validation for Aadhaar number length (12 digits)
    if (aadhaar.length !== 12 || isNaN(aadhaar)) {
      setMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setLoading(true);

    // Dynamically use the currentAccount from the context to generate the DID
    const did = `did:ethr:${currentAccount}`;
    
    try {
      // Create JWT using the generated DID and Aadhaar
      const jwtToken = await createDidJwt(did, { aadhaar });

      // Store the JWT in localStorage
      localStorage.setItem('userJWT', jwtToken);
      setJwt(jwtToken); // Update the JWT state

      setMessage('JWT generated and stored successfully!');  // Success message
      console.log('Generated JWT:', jwtToken);  // You can store or use the JWT as needed
    } catch (error) {
      console.error('Error generating JWT:', error);
      setMessage('Error generating JWT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.pageContainer}>
      <div className={Style.formCard}>
        <h1 className={Style.title}>Authenticate & Vote</h1>
        <div className={Style.inputGroup}>
          <label htmlFor="aadhaarInput" className={Style.label}>Aadhaar Number</label>
          <input
            type="text"
            id="aadhaarInput"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            placeholder="Enter Aadhaar Number"
            className={Style.inputField}
            maxLength={12} // Limit input length to 12 digits
          />
        </div>
        <button
          onClick={handleGenerateJWT}
          className={Style.button}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Generate JWT'}
        </button>
        {message && <p className={Style.statusMessage}>{message}</p>}

        {/* If JWT exists, display the JWT and allow verification */}
        {jwt && (
          <div>
            <h3>JWT Stored</h3>
            <pre>{jwt}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default R_did;
