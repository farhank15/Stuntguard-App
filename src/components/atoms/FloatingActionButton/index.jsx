import React from "react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-10 right-10">
      <button
        onClick={onClick}
        className="btn btn-circle btn-primary shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;
