import Footer from "@/components/molecules/Footer";
import Navbar from "@components/molecules/Navbar";

const index = ({ children }) => {
  return (
    <div data-theme="cupcake" className="font-poppins">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default index;
