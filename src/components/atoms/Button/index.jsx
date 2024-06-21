import { Link } from "react-router-dom";

const Button = ({ name, className, onClick, path }) => {
  return (
    <div>
      <Link
        to={path}
        className={`px-2 py-2 text-white hover:scale-105 ${className}`}
        onClick={onClick}
        style={{
          minWidth: "44px",
          minHeight: "44px",
          display: "inline-flex",
          alignItems: "center",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <span className="inline-block">{name}</span>
      </Link>
    </div>
  );
};

export default Button;
