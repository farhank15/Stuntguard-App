import AboutTemp from "@/components/templates/About";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - About</title>
      </Helmet>
      <AboutTemp />
    </div>
  );
};

export default About;
