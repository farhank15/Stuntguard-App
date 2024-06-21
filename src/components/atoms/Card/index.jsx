// src/components/Card.js
import React from "react";

const Card = ({ title, description, imageUrl }) => {
  return (
    <div className="card w-full lg:w-[20rem] bg-base-100 shadow-xl md:m-4 mb-2">
      <figure>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">{title}</h2>
        <p className="text-justify text-[12px]">{description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
