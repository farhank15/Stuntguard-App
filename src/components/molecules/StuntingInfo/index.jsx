import Presiden from "@assets/images/presiden.webp";

const StuntingInfo = () => {
  return (
    <div className="mt-14 p-8 rounded-xl  flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
      <div className="md:w-1/3 flex justify-center md:justify-start">
        <img
          src={Presiden}
          alt="Wakil Presiden RI"
          className="w-32 h-32 md:w-52 md:h-52 object-cover rounded-full border-4 border-red-500 transform transition duration-500 hover:scale-110"
        />
      </div>
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          PERCEPATAN PENURUNAN <em>STUNTING</em>
        </h2>
        <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
          Percepatan penurunan stunting pada Balita adalah program prioritas
          Pemerintah sebagaimana termaktub dalam RPJMN 2020-2024. Target
          nasional pada tahun 2024, prevalensi stunting turun hingga 14%. Wakil
          Presiden RI sebagai Ketua Pengarah Tim Percepatan Penurunan Stunting
          (TP2S) Pusat bertugas memberikan arahan terkait penetapan kebijakan
          penyelenggaraan Percepatan Penurunan Stunting; serta memberikan
          pertimbangan, saran, dan rekomendasi dalam penyelesaian kendala dan
          hambatan penyelenggaraan Percepatan Penurunan Stunting secara efektif,
          konvergen, dan terintegrasi dengan melibatkan lintas sektor di tingkat
          pusat dan daerah.
        </p>
      </div>
      <div className="md:w-1/3 bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg shadow-lg text-center md:text-left transform transition duration-500 hover:shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold">
          PREVALENSI <em>STUNTING</em> NASIONAL
        </h2>
        <p className="mt-4 text-5xl font-extrabold">21,5%</p>
        <p className="mt-2 text-lg">Sumber Data: SKI, 2023</p>
      </div>
    </div>
  );
};

export default StuntingInfo;
