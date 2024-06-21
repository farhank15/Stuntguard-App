import Button from "@components/atoms/Button";
import { FaChartLine } from "react-icons/fa";

const StuntingExplanation = () => {
  return (
    <div className="mt-20 mb-10 p-8 rounded-xl  flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
      <div className="md:w-1/3 flex justify-center md:justify-start">
        <div className="bg-gradient-to-r from-purple-400 to-pink-600 text-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <FaChartLine size={48} />
          <h3 className="text-2xl md:text-3xl font-bold mt-4">
            Apa Itu Stunting?
          </h3>
          <p className="mt-4 text-sm md:text-base leading-relaxed">
            Stunting adalah kondisi gagal tumbuh pada anak balita akibat dari
            kekurangan gizi kronis, infeksi berulang, dan stimulasi psikososial
            yang tidak memadai. Hal ini menyebabkan anak terlalu pendek untuk
            usianya.
          </p>
        </div>
      </div>
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dampak Stunting
        </h2>
        <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
          Stunting memiliki dampak jangka panjang yang signifikan terhadap
          individu dan masyarakat, termasuk gangguan perkembangan otak yang
          memengaruhi kemampuan kognitif dan prestasi belajar, peningkatan
          risiko penyakit kronis di kemudian hari, serta rendahnya produktivitas
          ekonomi.
        </p>
        <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
          Pencegahan stunting memerlukan upaya yang komprehensif dan terpadu,
          melibatkan perbaikan gizi ibu hamil dan anak, peningkatan akses
          terhadap layanan kesehatan, sanitasi yang baik, dan edukasi mengenai
          pola asuh yang benar.
        </p>
        <Button
          name="Pelajari Lebih Lanjut"
          className="mt-6 bg-blue-500 text-white rounded-lg"
        />
      </div>
    </div>
  );
};

export default StuntingExplanation;
