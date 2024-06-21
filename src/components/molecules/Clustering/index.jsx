// src/components/Clustering.js
import React from "react";
import Card from "@components/atoms/Card";
import Golonganke1 from "@assets/images/Child/Golongan1.webp";
import Golonganke2 from "@assets/images/Child/Golongan2.webp";
import Golonganke3 from "@assets/images/Child/Golongan3.webp";
import Golonganke4 from "@assets/images/Child/Golongan4.webp";

const Clustering = () => {
  return (
    <div className="py-5">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-poppins font-bold">
          Penggolongan Kondisi Anak
        </h1>
      </div>
      <div className="flex flex-wrap justify-center px-10">
        <Golongan1 />
        <Golongan2 />
        <Golongan3 />
        <Golongan4 />
      </div>
    </div>
  );
};

const Golongan1 = () => {
  const description =
    "Golongan pertama menandakan kondisi pertumbuhan anak yang dapat dianggap sebagai kategori normal, baik dari segi tinggi maupun berat badan. Anak yang termasuk dalam golongan ini mengalami pertumbuhan yang sesuai dengan standar perkembangan umum pada usianya. Tinggi dan berat badan anak pada golongan pertama mencerminkan kesehatan yang optimal, menunjukkan bahwa proses tumbuh kembangnya berlangsung secara seimbang. Sebagai hasilnya, anak pada golongan pertama memiliki potensi untuk menjalani kehidupan sehat dan aktif dengan dukungan yang tepat dari lingkungan dan perawatan yang baik.";

  return (
    <Card title="Golongan 1" description={description} imageUrl={Golonganke1} />
  );
};

const Golongan2 = () => {
  const description =
    "Golongan kedua pertama, mencakup anak-anak yang menunjukkan pertumbuhan tinggi di atas rata-rata usia sebaya, namun dengan berat badan yang sedikit berlebihan. Meskipun tinggi badan yang melampaui standar dapat menunjukkan potensi fisik yang baik, berat badan yang berlebihan memerlukan perhatian khusus terkait pola makan dan gaya hidup sehat. Kedua, tinggi badan anak ideal tetapi berat badan kurang, Penting bagi orang tua dan perawat untuk memastikan bahwa anak pada golongan kedua tetap menjalani kehidupan yang seimbang, dengan perhatian khusus pada nutrisi dan aktivitas fisik, guna mendukung kesehatan dan perkembangan mereka secara optimal.";

  return (
    <Card title="Golongan 2" description={description} imageUrl={Golonganke2} />
  );
};

const Golongan3 = () => {
  const description =
    "Golongan ketiga melibatkan anak-anak yang mungkin mengalami stunting, dengan dua kondisi yang berbeda. Pertama, berat badan anak ideal tetapi tinggi badan kurang, memerlukan perhatian terhadap nutrisi dan pertumbuhan linier. menandakan perlunya dukungan nutrisi dan perawatan kesehatan yang intensif. Dalam kedua kasus ini, tindakan preventif dan intervensi diperlukan untuk memastikan pertumbuhan dan perkembangan anak mencapai potensinya secara optimal.";

  return (
    <Card title="Golongan 3" description={description} imageUrl={Golonganke3} />
  );
};

const Golongan4 = () => {
  const description =
    "Golongan keempat melibatkan anak-anak yang mengalami stunting, di mana tinggi badan mereka kurang dari standar perkembangan usia sebaya, sementara berat badan mereka berlebih. Kondisi ini menandakan ketidakseimbangan antara tinggi dan berat badan, yang dapat disebabkan oleh pola makan yang tidak sehat atau kurangnya nutrisi yang tepat. Penting untuk memberikan perhatian khusus terhadap aspek gizi dan memastikan bahwa anak-anak dalam golongan keempat ini mendapatkan pola makan yang seimbang guna mengatasi stunting dan mencegah masalah kesehatan yang dapat timbul akibat ketidakseimbangan pertumbuhan.";

  return (
    <Card title="Golongan 4" description={description} imageUrl={Golonganke4} />
  );
};

export default Clustering;
