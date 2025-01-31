import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { VotingContext } from "../../context/Voter";
import Style from "./NavBar.module.css";

const NavBar = () => {
  const {
    connectWallet,
    error,
    currentAccount,
    startVoting,
    endVoting,
    resetVoting,
    winner,
  } = useContext(VotingContext);
  
  const [errorState, setErrorState] = useState(error);

  // Manually close the error and reload the page if connected to MetaMask
  const handleCloseError = () => {
    setErrorState(""); // Clear the error state
    if (currentAccount) {
      window.location.reload(); // Reload the page if MetaMask is connected
    }
  };

  // Keep track of any new error state updates
  useEffect(() => {
    setErrorState(error); // Update error state whenever error changes
  }, [error]);

  return (
    <div className={Style.navbar}>
      {/* Error message box */}
      {errorState && (
        <div className={Style.error_overlay}>
          <div className={Style.message_box}>
            <button className={Style.close_button} onClick={handleCloseError}>
              &times;
            </button>
            <p>{errorState}</p>
          </div>
        </div>
      )}
{winner && (
  <div className={Style.winner_overlay}>
    <div className={Style.winner_message_box}>
      <button className={Style.winner_close_button} onClick={handleCloseError}>
        &times;
      </button>
      <div className={Style.celebration_icon}>🎉</div>
      <h3>Winner Announced!</h3>
      <p>Candidate: {typeof winner.candidate === 'string' ? winner.candidate : winner.candidate?.name}</p>
      <p>Votes: {winner.voteCount}</p>
    </div>
  </div>
)}
      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href="/">
            <a className={Style.logo}>MKVV</a>
          </Link>
        </div>
        
        <div className={Style.nav_menu}>
          <Link href="/candidate">
            <a>Register Candidate</a>
          </Link>
          <Link href="/R_did">
            <a>Register Did Proof</a>
          </Link>
          <Link href="/allowed-voters">
            <a>Register Voter</a>
          </Link>
          <Link href="/voterList">
            <a>Voters details</a>
          </Link>
         
        </div>
        
        <div className={Style.connect}>
          {currentAccount ? (
            <>
              <button onClick={startVoting} className={Style.action_button}>
                Start Voting
              </button>
              <button onClick={endVoting} className={Style.action_button}>
                End Voting
              </button>
              <button onClick={resetVoting} className={Style.action_button}>
                Reset Voting
              </button>
              <span className={Style.connected_account}>
                Connected: {currentAccount.slice(0, 5)}...
                {currentAccount.slice(-4)}
              </span>
            </>
          ) : (
            <button onClick={connectWallet} className={Style.connect_button}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
