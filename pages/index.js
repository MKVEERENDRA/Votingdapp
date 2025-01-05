import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/card/card"; // Renamed card to Card

const Index = () => {
  const { 
    checkIfconn, 
    vote, 
    voterlength, 
    determineLeadingCandidate ,
    checkVotingEnded,   // <-- Destructure the new method
    checkVotingStart,
    currentAccount, 
    CandidateLength, 
    candidateArray 
  } = useContext(VotingContext);
  const [leadingCandidate, setLeadingCandidate] = useState(null);
  const [votingEnded, setVotingEnded] = useState(false);
  const [votingstarted, setVotingstarted] = useState(false);


  useEffect(() => {
    const initialize = async () => {
      try {
        await checkIfconn(); // Check connection
  
        // Check if voting has ended
        const hasVotingEnded = await checkVotingEnded();
        setVotingEnded(hasVotingEnded);
        const hasVotingStart = await checkVotingStart();
        setVotingstarted(hasVotingStart);
       
        // Only fetch the leading candidate if voting has not ended
        if (!hasVotingEnded && hasVotingStart) {
          const candidate = await determineLeadingCandidate();
          setLeadingCandidate(candidate);
          
        }
      } catch (err) {
      }
    };
  
    initialize();
  }, []);
console.log("we",leadingCandidate);
  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                Number Of candidate: <span>{CandidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
              Number Of Voters: <span>{voterlength}</span>
              </p>
            </div>
          </div>
             {/* Leading Candidate Section */}
             <div className={Style.winner_message}>
            {votingEnded ? (
              <p>Voting has ended. Check the winner in the results section.</p>
            ) : leadingCandidate ? (
              <div>
                <p>
                  <strong>
                    <img src={leadingCandidate.image} alt="Pic" width={100} className={Style.candidateimage}/>
                  </strong>
                </p>
                <p>
                  Leading Candidate: <strong>{leadingCandidate.name}</strong>
                </p>
                <p>
                  Vote Count: <strong>{leadingCandidate.voteCount}</strong>
                </p>
              </div>
            ) : (
              <p>Loading leading candidate...</p>
            )}
          </div>
       
        </div>
      )}
      <Card candidateArray={candidateArray} vote={vote} />
    </div>
  );
};

export default Index;
