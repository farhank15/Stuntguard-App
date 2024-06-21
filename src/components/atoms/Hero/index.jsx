import Button from "@components/atoms/Button";
import Waves from "@assets/images/waves/wavehome.svg";

const HeroAtom = ({
  title,
  description,
  classNameT,
  classNameD,
  backgroundImage,
}) => {
  const defaultStyles = {
    minHeight: "100vh",
    position: "relative",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  };

  const waveStyles = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 2,
  };

  return (
    <div className="hero font-poppins h-screen" style={defaultStyles}>
      <div style={overlayStyles}></div>
      <div className="hero-content text-center relative z-10">
        <div className="max-w-md xl:max-w-5xl">
          <h1 className={`mb-3 xl:mb-5 text-shadow ${classNameT}`}>{title}</h1>
          <p className={`mb-3 ${classNameD}`}>{description}</p>
          <Button name="Mulai Cegah" className="bg-secondary-400 rounded-lg" />
        </div>
      </div>
      <div style={waveStyles}>
        <img src={Waves} alt="Gelombang" className="w-full" />
      </div>
    </div>
  );
};

export default HeroAtom;
