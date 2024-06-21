import StuntingExplanation from "@/components/molecules/StuntingExplanation";
import StuntingInfo from "@/components/molecules/StuntingInfo";
import StuntingStatistics from "@/components/molecules/StuntingStatistic";
import Hero from "@components/molecules/Hero";

const HomeTemp = () => {
  return (
    <div className="pt-20">
      <Hero />
      <StuntingInfo />
      <StuntingExplanation />
      <StuntingStatistics />
    </div>
  );
};

export default HomeTemp;
