import PaperTexture1 from "@/assets/imgs/paper-texture-1.png";
import RedBrushStroke from "@/assets/imgs/red-brush-stroke.png";
import SmallMirror1 from "@/assets/imgs/small-mirror-1.png";
import SmallMirror2 from "@/assets/imgs/small-mirror-2.png";
import YellowWindow from "@/assets/imgs/yellow-window.png";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

export const ComingSoon = () => {
  return (
    <>
      <Navbar />
      <main className="relative min-h-dvh overflow-hidden bg-red pt-18 md:pt-20">
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[140dvh] w-dvw -translate-x-1/2 -translate-y-1/2 object-cover object-top opacity-50"
          height={646}
          id="red-brush-stroke"
          src={RedBrushStroke}
          width={839}
        />
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 aspect-[1.78/1] h-dvh w-dvw object-cover mix-blend-multiply"
          height={713}
          id="paper-texture-1"
          src={PaperTexture1}
          width={1268}
        />
        <section
          className="relative h-[calc(100dvh-72px)] w-full md:h-[calc(100dvh-80px)]"
          id="section-1"
        >
          <div
            className="relative top-[-10%] h-full w-full"
            id="window-container"
          >
            <div
              className="absolute top-0 left-1/2 h-[60dvh] w-full -translate-x-1/2"
              id="yellow-window-group"
            >
              <img
                alt="Yellow Window"
                className="pointer-events-none absolute top-0 left-1/2 z-1 aspect-[1.13/1] h-[60dvh] w-auto -translate-x-1/2 object-cover object-top"
                height={735}
                id="yellow-window"
                src={YellowWindow}
                width={829}
              />
              <img
                alt="Small Mirror 1"
                className="pointer-events-none absolute top-1/2 left-1/2 aspect-[0.79/1] h-[20dvh] w-auto translate-x-[20%] -translate-y-[30%] object-cover"
                height={226}
                id="small-mirror-1"
                src={SmallMirror1}
                width={182}
              />
              <img
                alt="Small Mirror 2"
                className="pointer-events-none absolute top-1/2 left-1/2 aspect-[0.79/1] h-[20dvh] w-auto -translate-x-[120%] -translate-y-[70%] object-contain"
                height={265}
                id="small-mirror-2"
                src={SmallMirror2}
                width={213}
              />
            </div>
          </div>

          <div
            className="absolute top-[80%] left-1/2 flex w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center sm:w-1/2 md:w-3/5 lg:w-2/5"
            id="text-container"
          >
            <h1 className="font-serif-2 text-white text-xl-2 md:text-xxl">
              Segera Hadir.
            </h1>
            <p className="font-sans text-m text-white md:text-l">
              Kami sedang menyiapkan sesuatu yang akan segera bisa kamu jelajahi
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
