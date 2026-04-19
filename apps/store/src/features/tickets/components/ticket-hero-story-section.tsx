import { useIsMobile } from "@tedx-2026/ui/hooks/use-is-mobile";
import {
  motion,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import PaperTexture from "@/assets/imgs/paper-texture-1.png";
import People from "@/assets/imgs/people.png";
import Stage from "@/assets/imgs/stage.png";

import "../styles/hero-section.css";

export const TicketHeroStorySection = ({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) => {
  const smoothScroll = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const introOpacity = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [1, 1, 0, 0, 0, 0]
  );

  const introY = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [0, 0, -40, -40, -40, -40]
  );

  const storyOpacity = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [0, 0, 1, 1, 0, 0]
  );

  const storyY = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [40, 40, 0, 0, -40, -40]
  );

  const filterOpacity = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [1, 1, 1, 1, 0, 0]
  );

  const isMobile = useIsMobile();

  const stageBottom = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    isMobile
      ? ["-20dvh", "-18dvh", "-16.5dvh", "-15dvh", "-13.5dvh", "-12dvh"]
      : ["-72dvh", "-60dvh", "-50dvh", "-45dvh", "-40dvh", "-40dvh"]
  );

  const peopleBottom = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    isMobile
      ? ["-60dvh", "-58dvh", "-56dvh", "-54dvh", "-52dvh", "-50dvh"]
      : ["-92dvh", "-90dvh", "-80dvh", "-80dvh", "-77dvh", "-75dvh"]
  );

  const peopleOpacity = useTransform(
    smoothScroll,
    [0, 0.15, 0.3, 0.45, 0.6, 0.65],
    [1, 1, 1, 1, 1, 1]
  );

  const peopleScaleBase = useTransform(
    smoothScroll,
    [0, 0.45, 0.65],
    [1, 1, 1.1]
  );

  const peopleScale = useSpring(peopleScaleBase, {
    stiffness: 100,
    damping: 25,
    mass: 1,
  });

  const filterOverlayOpacity = useTransform(smoothScroll, [0.65, 0.8], [0, 1]);

  return (
    <div className="hero-sticky-container">
      <div className="hero-bg-layer">
        <img
          alt=""
          className="paper-texture"
          height={1080}
          src={PaperTexture}
          width={1920}
        />
        <motion.div
          className="gradient-filter"
          style={{ opacity: filterOpacity }}
        />
        <motion.div
          className="filtering-overlay"
          style={{ opacity: filterOverlayOpacity }}
        />
        <motion.img
          alt=""
          className="stage"
          height={1080}
          src={Stage}
          style={{ bottom: stageBottom }}
          width={1920}
        />
        <motion.img
          alt=""
          className="people"
          height={1080}
          src={People}
          style={{
            bottom: peopleBottom,
            opacity: peopleOpacity,
            scale: peopleScale,
          }}
          width={1920}
        />
      </div>

      <div className="hero-content-layer">
        <div className="hero-intro-wrapper">
          <motion.div
            className="motion-wrapper"
            style={{ opacity: introOpacity, y: introY }}
          >
            <p className="hero-intro-text" id="ticket-hero-intro-copy">
              Selamat datang dalam perjalanan bertumbuh bersama TEDxUniversitas
              Brawijaya 2026!
            </p>
          </motion.div>
        </div>

        <div className="hero-story-wrapper">
          <motion.div
            className="motion-wrapper"
            style={{ opacity: storyOpacity, y: storyY }}
          >
            <p className="hero-story-text" id="ticket-hero-story-copy">
              Di ruang ini, kamu tidak hanya datang untuk mendengar, tapi juga
              untuk membawa kisah dari perjalananmu. Cerita tentang tawa, luka,
              dan harapan yang kamu simpan, kini punya ruang untuk saling
              melengkapi dengan cerita lainnya. Mari ubah pengalaman pribadimu
              menjadi bagian dari sebuah rumah, tempat berbagai gagasan bertemu
              dan makna baru terbentuk.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
