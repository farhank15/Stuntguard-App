import HeroAtom from "@components/atoms/Hero";
import customBackgroundImage from "@assets/images/heros/hero-home.webp";

const Hero = () => {
  return (
    <div>
      <HeroAtom
        classNameD="text-secondary-200 xl:text-lg text-[12px]"
        classNameT="font-bold xl:text-7xl  text-[32px] text-secondary-200"
        title="Mencegah Stunting untuk Generasi Masa Depan yang Sehat"
        description="Bergabunglah dengan kami dalam perjuangan mencegah stunting pada anak-anak. Temukan solusi terbaik untuk nutrisi yang seimbang dan gaya hidup sehat."
        backgroundImage={customBackgroundImage}
      />
    </div>
  );
};

export default Hero;
