import Waves from "@assets/images/waves/waveabout.svg";
import Logo from "@assets/images/logos/stuntguard.png";
import Partner1 from "@assets/images/logos/partner1.webp";
import Partner2 from "@assets/images/logos/partner2.webp";
import Partner3 from "@assets/images/logos/partner3.webp";
import Partner4 from "@assets/images/logos/partner4.webp";
import Partner5 from "@assets/images/logos/partner5.webp";

const LogoSection = () => (
  <section className="flex items-center justify-center pt-16 md:pt-24 pb-8 md:pb-12">
    <img
      src={Logo}
      alt="Logo StuntGuard"
      className="w-40 md:w-80 h-auto mb-4 transition-transform duration-300 hover:scale-105"
    />
  </section>
);

const IntroductionSection = () => (
  <section className="flex flex-col justify-center items-center md:items-start p-4 text-slate-50 text-center md:text-left">
    <h1 className="text-4xl md:text-5xl mb-3 font-bold">Stuntguard</h1>
    <p className="text-lg md:text-xl mb-5 md:pr-20 ">
      Menciptakan Generasi Sehat Tanpa Stunting. Kami berkomitmen untuk bekerja
      sama dengan berbagai pihak dalam menyediakan edukasi kesehatan dan nutrisi
      yang komprehensif. Dengan upaya bersama, kami yakin dapat mengurangi angka
      stunting dan memastikan setiap anak memiliki kesempatan untuk tumbuh dan
      berkembang secara optimal.
    </p>
    <button className="bg-primary-500 text-white px-6 py-2 rounded-full transition-transform duration-300 hover:scale-105">
      Pelajari Lebih Lanjut
    </button>
  </section>
);

const AboutSection = () => (
  <div className="bg-white shadow-lg rounded-lg p-6 m-4">
    <h2 className="text-3xl font-bold mb-4 text-accent-800">
      Tentang StuntGuard
    </h2>
    <p className="text-base mb-4">
      StuntGuard adalah proyek yang bertujuan untuk mencegah stunting pada
      anak-anak melalui kolaborasi dengan posyandu lokal. Kami berusaha
      menciptakan masa depan yang lebih sehat untuk generasi mendatang.
    </p>
    <p className="text-base mb-4">
      Misi kami adalah menyediakan edukasi kesehatan dan nutrisi yang
      komprehensif, sumber daya, dan dukungan kepada keluarga agar setiap anak
      dapat mencapai potensi penuhnya.
    </p>
  </div>
);

const BackgroundSection = () => (
  <div className="bg-white shadow-lg rounded-lg p-6 m-4">
    <h2 className="text-3xl font-bold mb-4 text-accent-800">Latar Belakang</h2>
    <p className="text-base mb-4">
      Stunting adalah kondisi dimana anak-anak tidak tumbuh sesuai potensi
      mereka karena malnutrisi kronis. Kondisi ini memiliki dampak jangka
      panjang terhadap perkembangan kognitif dan kesehatan. Proyek kami
      bertujuan untuk mengatasi masalah ini melalui peningkatan kesadaran dan
      dukungan komunitas.
    </p>
    <p className="text-base mb-4">
      Dengan bekerja sama secara erat dengan penyedia layanan kesehatan lokal
      dan organisasi masyarakat, kami berusaha mengurangi insiden stunting dan
      meningkatkan kesehatan anak-anak secara keseluruhan di daerah target kami.
    </p>
  </div>
);

const MethodologySection = () => (
  <div className="bg-white shadow-lg rounded-lg p-6 m-4">
    <h2 className="text-3xl font-bold mb-4 text-accent-800">
      Metodologi dan Teknologi
    </h2>
    <p className="text-base mb-4">
      Kami menggunakan teknik pengumpulan data dan alat analisis yang canggih
      untuk memastikan informasi yang akurat dan andal. Platform kami dibangun
      menggunakan teknologi terbaru untuk menyediakan antarmuka yang ramah
      pengguna.
    </p>
  </div>
);

const PartnersSection = () => (
  <div className="px-4">
    <div className="flex justify-around items-center flex-wrap">
      <img
        src={Partner1}
        alt="Partner 1"
        className="w-32 md:w-56 h-auto mb-4 filter grayscale hover:filter-none transition-all duration-300"
      />
      <img
        src={Partner2}
        alt="Partner 2"
        className="w-32 md:w-56 h-auto mb-4 filter grayscale hover:filter-none transition-all duration-300"
      />
      <img
        src={Partner3}
        alt="Partner 3"
        className="w-32 md:w-56 h-auto mb-4 filter grayscale hover:filter-none transition-all duration-300"
      />
      <img
        src={Partner4}
        alt="Partner 4"
        className="w-32 md:w-56 h-auto mb-4 filter grayscale hover:filter-none transition-all duration-300"
      />
      <img
        src={Partner5}
        alt="Partner 5"
        className="w-32 md:w-56 h-auto mb-4 filter grayscale hover:filter-none transition-all duration-300"
      />
    </div>
  </div>
);

const AchievementsSection = () => (
  <div className="bg-white shadow-lg rounded-lg p-6 m-4">
    <h2 className="text-3xl font-bold mb-4 text-accent-800">
      Capaian dan Rencana Masa Depan
    </h2>
    <p className="text-base mb-4">
      Sejak dimulai, proyek kami telah mencapai beberapa hasil penting. Kami
      berencana untuk memperluas jangkauan kami ke lebih banyak komunitas dan
      meningkatkan kemampuan analisis data kami.
    </p>
  </div>
);

const HeaderAbout = () => {
  return (
    <>
      <div className="font-poppins">
        <div className="bg-gradient-to-r bg-secondary-400 font-poppins h-auto min-h-[40rem] grid grid-cols-1 md:grid-cols-2 items-center justify-center text-center text-white p-4 md:p-0">
          <LogoSection />
          <IntroductionSection />
        </div>
        <img src={Waves} alt="Gelombang" className="w-full mt-[-1px]" />
        <PartnersSection />
        <div className="container mx-auto px-5 md:px-3 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AboutSection />
            <BackgroundSection />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MethodologySection />
            <AchievementsSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderAbout;
