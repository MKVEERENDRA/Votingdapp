import React from "react";
import Tilt from "react-parallax-tilt";
import Style from "./card.module.css";

const Card = ({ candidateArray, vote }) => {
  return (
    <div className={Style.card_container}>
      {candidateArray.map((candidate, i) => (
        <Tilt
          key={i}
          className={Style.card_box}
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          perspective={1000}
          glareEnable={true}
          glareMaxOpacity={0.4}
          glareColor="#ffffff"
          glarePosition="bottom"
          transitionSpeed={400}
        >
                     <div className={Style.inner_element}>

          <div className={Style.card_content}>
            {/* Image Section */}
            <div className={Style.image}>
              <img
                src={candidate.imageUrl}
                alt={`Candidate ${candidate.name}`}
              />
            </div>

            {/* Candidate Info */}
            <div className={Style.card_info}>
              <h3>{candidate.name}</h3>
              <p>Age: {candidate.age}</p>
              <p>Candidate Number: #{candidate.candidateNumber}</p>
              <p>Address: {candidate.address.slice(0, 10)}...</p>
              <p className={Style.total}>Total Votes:
                {" "}
                <span className={Style.span_total}>
                  {" "}
                 {candidate.voteCount}
                 </span>
                 </p>
           
            </div>

            {/* Vote Button */}
            <div className={Style.card_button}>
              <button onClick={() => vote(candidate.candidateNumber)}>Vote</button>
            </div>
          </div>
          </div>
        </Tilt>
      ))}
    </div>
  );
};

export default Card;
