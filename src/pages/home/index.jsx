import HomeTemp from "@components/templates/Home";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Home</title>
      </Helmet>
      <HomeTemp />
    </div>
  );
};

export default Home;
