import React from "react";
import Image from "next/image";
import Style from "./voterCard.module.css";
import Tilt from "react-parallax-tilt";


const VoterCard = ({ voterArray }) => {
  return (
    <div className={Style.card}>
      {voterArray.map((voter, i) => (
         <Tilt
         key={i}
         className={Style.card_box}
         glareEnable={true}
         glareMaxOpacity={0.4}
         glareColor="#ffffff"
         glarePosition="bottom"
         tiltMaxAngleX={15}
         tiltMaxAngleY={15}
         transitionSpeed={400}
       >
        <div key={i} className={Style.card_box}>
          {/* Image Section */}
          <div className={Style.image}>
            <Image
              src={voter.image} // Access image URL
              alt={`Voter ${voter.name}`}
              width={150}
              height={150}
            />
          </div>

          {/* Voter Info */}
          <div className={Style.card_info}>
            <h3>Name: {voter.name}</h3>
            <p>Voter ID: {voter.voterId}</p>
            <p>Address: {voter.voterAddress.slice(0, 10)}...</p>
            <p>Has Voted: {voter.voted ? "Yes" : "No"}</p>
            <p>Vote: {voter.vote}</p>
            <p>
              IPFS: <a href={voter.ipfs} target="_blank">View Document</a>
            </p>
          </div>
        </div>
        </Tilt>
      ))}
    </div>
  );
};

export default VoterCard;
