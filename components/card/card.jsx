import React from "react";
import Image from "next/image";
import Style from "./card.module.css";

const Card = ({ candidateArray, vote }) => {
  return (
    <div className={Style.card}>
      {candidateArray.map((candidate, i) => (
        <div key={i} className={Style.card_box}>
          {/* Image Section */}
          <div className={Style.image}>
            <img
              src={candidate.imageUrl} // Access image URL
              alt={`Candidate ${candidate.name}`}
              width={150}
              height={150}
            />
          </div>

          {/* Candidate Info */}
          <div className={Style.card_info}>
            <h3>Name:{" "} {candidate.name}</h3> {/* Candidate Name */}
            <p>Age: {candidate.age}</p> {/* Candidate Age */}
            <p>Candidate Number: #{candidate.candidateNumber}</p> {/* Candidate Number */}
            <p>Address: {candidate.address.slice(0, 10)}...</p> {/* Candidate Address */}
          
            <p className={Style.total}>Total Votes: {candidate.voteCount}</p> {/* Vote Count */}
          </div>
          

          {/* Vote Button */}
          <div className={Style.card_button}>
            
            <button onClick={() => vote(candidate.candidateNumber)}> {/* Use candidateNumber as ID */}
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;