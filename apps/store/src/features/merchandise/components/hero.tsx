import type { ReactNode } from "react";

type HeroProps = {
  heroImage: ReactNode;
};

const Hero = ({ heroImage }: HeroProps) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden py-24">
      <div className="container mx-auto px-4 md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="font-extrabold font-sans-2 text-6xl text-black md:text-8xl">
          <h1>TEDXUB</h1>
          <h2>MERCH</h2>
        </div>
        <p className="w-2/3 font-sans-2 text-xs md:text-base lg:w-1/4">
          Lengkapi jejak ceritamu sebagai bagian dari ruang bertumbuh bersama
          TEDxUniversitasBrawijaya 2026.
        </p>
      </div>
      {/* Image  */}
      {heroImage}
    </section>
  );
};

export default Hero;
