// Hero story section: drives scroll-based stage/people animation and narrative copy transition.
import PaperTexture from "@/assets/imgs/paper-texture.png";
import People from "@/assets/imgs/people.png";
import Stage from "@/assets/imgs/stage.png";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const introText =
  "Selamat datang dalam perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!";
const storyText =
  "Di ruang ini, kamu tidak hanya datang untuk mendengar, tapi juga untuk membawa kisah dari perjalananmu. Cerita tentang tawa, luka, dan harapan yang kamu simpan, kini punya ruang untuk saling melengkapi dengan cerita lainnya. Mari ubah pengalaman pribadimu menjadi bagian dari sebuah rumah, tempat berbagai gagasan bertemu dan makna baru terbentuk.";

export const TicketHeroStorySection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stageY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    ["0%", "-6%", "-10%"]
  );
  const peopleY = useTransform(scrollYProgress, [0, 0.35], ["24%", "0%"]);
  const mediaScale = useTransform(scrollYProgress, [0.45, 1], [1, 1.08]);
  const introOpacity = useTransform(scrollYProgress, [0.25, 0.42], [1, 0]);
  const storyOpacity = useTransform(scrollYProgress, [0.4, 0.58], [0, 1]);

  return (
    <section
      className="relative h-[260vh] overflow-clip bg-black"
      id="ticket-hero-text"
      ref={sectionRef}
      style={{
        backgroundImage: `url(${PaperTexture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          style={{ scale: mediaScale }}
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black via-black/65 to-transparent" />
          <motion.img
            alt="Stage"
            className="absolute inset-0 h-full w-full object-contain"
            height={1080}
            src={Stage}
            style={{ y: stageY }}
            width={1920}
          />
          <motion.img
            alt="People"
            className="absolute right-0 bottom-0 z-10 h-[56vh] w-auto max-w-[92vw] object-contain md:h-[72vh]"
            height={1024}
            src={People}
            style={{ y: peopleY }}
            width={768}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center px-6 md:px-16">
          <motion.p
            className="max-w-2xl font-serif-2 text-white text-xl leading-tight md:text-4xl"
            id="ticket-hero-intro-copy"
            style={{ opacity: introOpacity }}
          >
            {introText}
          </motion.p>
          <motion.p
            className="absolute max-w-3xl font-sans-2 text-base text-white/95 leading-relaxed md:text-xl"
            id="ticket-hero-story-copy"
            style={{ opacity: storyOpacity }}
          >
            {storyText}
          </motion.p>
        </div>
      </div>
    </section>
  );
};
