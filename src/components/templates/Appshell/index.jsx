import Footer from "@/components/molecules/Footer";
import Navbar from "@components/molecules/Navbar";
import { HelmetProvider } from "react-helmet-async";

const index = ({ children }) => {
  return (
    <div data-theme="cupcake" className="font-poppins">
      <Navbar />
      <HelmetProvider>{children}</HelmetProvider>
      <Footer />
    </div>
  );
};

export default index;
