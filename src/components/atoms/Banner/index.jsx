// src/components/Banner.js
import React from "react";

const Banner = ({ description, className, classNamep }) => {
  return (
    <div className="font-poppins">
      <div className={`p-4 bg-yellow-300 ${className}`}>
        <p className={`text-sm text-yellow-800 ${classNamep}`}>{description}</p>
      </div>
    </div>
  );
};

export default Banner;
