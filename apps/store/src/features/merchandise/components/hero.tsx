import HeroImage from "./hero-image";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden py-24">
      <div className="container mx-auto max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="font-extrabold font-sans-2 text-6xl text-black md:text-8xl">
          <h1>TEDXUB</h1>
          <h2>MERCH</h2>
        </div>
        <p className="font-sans-2 text-xs md:text-base lg:w-1/4">
          Lengkapi jejak ceritamu sebagai bagian dari ruang bertumbuh bersama
          TEDxUniversitasBrawijaya 2026.
        </p>
      </div>
      {/* Image  */}
      <HeroImage />
    </section>
  );
};

export default Hero;
