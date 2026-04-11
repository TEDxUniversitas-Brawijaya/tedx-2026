import { Link } from "@tanstack/react-router";
import HangingLamp from "@/assets/imgs/hanging-lamp.png";
import PaperTexture1 from "@/assets/imgs/paper-texture-1.png";
import RedBrushStroke from "@/assets/imgs/red-brush-stroke.png";
import SmallFramedArt1 from "@/assets/imgs/small-framed-art-1.png";
import SmallFramedArt2 from "@/assets/imgs/small-framed-art-2.png";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { cn } from "@tedx-2026/ui/lib/utils";

export const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <main
        className={cn("relative h-dvh overflow-hidden bg-black pt-18 md:pt-20")}
      >
        <div
          className={cn("absolute inset-0 h-dvh w-dvw overflow-hidden")}
          id="background-container"
        >
          <div
            className={cn(
              "h-dvh w-dvw bg-[oklch(0.371_0_0)] mix-blend-multiply"
            )}
          />
          <div
            className={cn(
              "mask-center mask-no-repeat mask-cover transform-[translate(-50%,-40%)] absolute top-1/2 left-1/2 h-[160dvh] w-dvw bg-[oklch(0.252_0_0)] opacity-20"
            )}
            style={{ maskImage: `url(${RedBrushStroke})` }}
          />
          <img
            alt=""
            className={cn(
              "pointer-events-none absolute inset-0 aspect-[1.78/1] h-dvh w-dvw object-cover mix-blend-multiply"
            )}
            height={713}
            src={PaperTexture1}
            width={1268}
          />
        </div>

        <div
          className={cn(
            "md:transform-[translate(30%,0)] absolute top-[30%] left-1/2 h-[10dvh] w-auto translate-x-[20%] md:top-[40%] md:left-[18%] md:h-[20dvh] min-[425px]:h-[15dvh]"
          )}
          id="small-framed-art-1-container"
        >
          <img
            alt="Small Framed Art Overlay"
            className={cn(
              "filter-[brightness(0)_saturate(100%)] pointer-events-none absolute inset-0 z-2 aspect-[0.86/1] h-full w-auto object-contain opacity-40"
            )}
            height={218}
            src={SmallFramedArt1}
            width={217}
          />
          <img
            alt="Small Framed Art"
            className={cn(
              "pointer-events-none relative aspect-[0.86/1] h-full w-auto object-contain"
            )}
            height={218}
            src={SmallFramedArt1}
            width={217}
          />
        </div>

        <div
          className={cn(
            "md:transform-[translate(-90%,0)] absolute top-[35%] left-1/2 h-[12.5dvh] w-auto -translate-x-[90%] md:top-[50%] md:left-[29%] md:h-[25dvh] min-[425px]:h-[17.5dvh]"
          )}
          id="small-framed-art-2-container"
        >
          <img
            alt="Small Framed Art Overlay"
            className={cn(
              "filter-[brightness(0)_saturate(100%)] pointer-events-none absolute inset-0 z-2 aspect-[0.86/1] h-full w-auto object-contain opacity-40"
            )}
            height={309}
            src={SmallFramedArt2}
            width={267}
          />
          <img
            alt="Small Framed Art"
            className={cn(
              "pointer-events-none relative aspect-[0.86/1] h-full w-auto object-contain"
            )}
            height={309}
            src={SmallFramedArt2}
            width={267}
          />
        </div>

        <div
          className={cn("absolute top-0 left-[15%] hidden md:block")}
          id="hanging-lamp-1-container"
        >
          <img
            alt="Hanging Lamp"
            className={cn(
              "pointer-events-none relative z-1 aspect-[0.6/1] h-[30dvh] w-auto object-contain"
            )}
            height={284}
            src={HangingLamp}
            width={171}
          />
          <svg
            aria-hidden="true"
            className={cn(
              "transform-[translate(-13%,-45.5%)] absolute top-full left-0 scale-[1.2] animate-blink"
            )}
            fill="none"
            focusable="false"
            height="112"
            viewBox="0 0 204 112"
            width="204"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#hanging-lamp-1-ellipse-filter)">
              <ellipse
                cx="101.632"
                cy="52.6358"
                fill="#FF9500"
                rx="59.7145"
                ry="13.0521"
                transform="rotate(-3.43409 101.632 52.6358)"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="111.068"
                id="hanging-lamp-1-ellipse-filter"
                width="203.264"
                x="-5.96046e-05"
                y="-0.000106096"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="4.34685" />
                <feGaussianBlur stdDeviation="2.57189" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="hanging-lamp-1-ellipse-drop-shadow-1"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius="5.79581"
                  result="hanging-lamp-1-ellipse-drop-shadow-2"
                />
                <feOffset dy="2.8979" />
                <feGaussianBlur stdDeviation="18.1119" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 0.583333 0 0 0 0 0 0 0 0 0.5 0"
                />
                <feBlend
                  in2="hanging-lamp-1-ellipse-drop-shadow-1"
                  mode="normal"
                  result="hanging-lamp-1-ellipse-drop-shadow-2"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="hanging-lamp-1-ellipse-drop-shadow-2"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <svg
            aria-hidden="true"
            className={cn(
              "transform-[translate(-25%,-28%)] absolute top-full left-0 scale-[1.2] animate-blink opacity-100 transition-opacity duration-300"
            )}
            fill="none"
            focusable="false"
            height="299"
            viewBox="0 0 394 299"
            width="394"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#hanging-lamp-1-triangle-filter)">
              <path
                d="M196.558 43.4688L349.647 255.378H43.4686L196.558 43.4688Z"
                fill="url(#hanging-lamp-1-triangle-gradient)"
                fillOpacity="0.9"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="298.846"
                id="hanging-lamp-1-triangle-filter"
                width="393.115"
                x="0.000209808"
                y="0.000209808"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                />
                <feGaussianBlur
                  result="hanging-lamp-1-triangle-blur"
                  stdDeviation="21.7343"
                />
              </filter>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="hanging-lamp-1-triangle-gradient"
                x1="196.558"
                x2="196.558"
                y1="43.4687"
                y2="252.215"
              >
                <stop stopColor="#FF9500" />
                <stop offset="1" stopColor="#995900" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className={cn(
            "absolute top-0 right-1/2 translate-x-1/2 md:top-0 md:right-[12.5%] md:translate-x-0 min-[425px]:top-[-5%]"
          )}
          id="hanging-lamp-2-container"
        >
          <img
            alt="Hanging Lamp"
            className={cn(
              "pointer-events-none relative z-1 aspect-[0.6/1] h-[20dvh] w-auto object-contain md:h-[35dvh] md:w-auto min-[425px]:h-auto min-[425px]:w-[15dvh]"
            )}
            height={284}
            src={HangingLamp}
            width={171}
          />
          <svg
            aria-hidden="true"
            className={cn(
              "transform-[translate(-43%,-87%)] sm:transform-[translate(-25%,-70%)] md:transform-[translate(-5%,-45.5%)] absolute top-full left-0 scale-[0.6] animate-blink sm:scale-[0.8] md:scale-[1.3]"
            )}
            fill="none"
            focusable="false"
            height="112"
            viewBox="0 0 204 112"
            width="204"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#hanging-lamp-2-ellipse-filter)">
              <ellipse
                cx="101.632"
                cy="52.6358"
                fill="#FF9500"
                rx="59.7145"
                ry="13.0521"
                transform="rotate(-3.43409 101.632 52.6358)"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="111.068"
                id="hanging-lamp-2-ellipse-filter"
                width="203.264"
                x="-5.96046e-05"
                y="-0.000106096"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="4.34685" />
                <feGaussianBlur stdDeviation="2.57189" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="hanging-lamp-2-ellipse-drop-shadow-1"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius="5.79581"
                  result="hanging-lamp-2-ellipse-drop-shadow-2"
                />
                <feOffset dy="2.8979" />
                <feGaussianBlur stdDeviation="18.1119" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 0.583333 0 0 0 0 0 0 0 0 0.5 0"
                />
                <feBlend
                  in2="hanging-lamp-2-ellipse-drop-shadow-1"
                  mode="normal"
                  result="hanging-lamp-2-ellipse-drop-shadow-2"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="hanging-lamp-2-ellipse-drop-shadow-2"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <svg
            aria-hidden="true"
            className={cn(
              "transform-[translate(-28%,-18%)] sm:transform-[translate(-27%,-18%)] md:transform-[translate(-18%,-18%)] absolute top-full left-0 scale-[1.2] animate-blink opacity-100 transition-opacity duration-300 ease-linear md:scale-[1.5]"
            )}
            fill="none"
            focusable="false"
            height="299"
            viewBox="0 0 394 299"
            width="394"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#hanging-lamp-2-triangle-filter)">
              <path
                d="M196.558 43.4688L349.647 255.378H43.4686L196.558 43.4688Z"
                fill="url(#hanging-lamp-2-triangle-gradient)"
                fillOpacity="0.9"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="298.846"
                id="hanging-lamp-2-triangle-filter"
                width="393.115"
                x="0.000209808"
                y="0.000209808"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                />
                <feGaussianBlur
                  result="hanging-lamp-2-triangle-blur"
                  stdDeviation="21.7343"
                />
              </filter>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="hanging-lamp-2-triangle-gradient"
                x1="196.558"
                x2="196.558"
                y1="43.4687"
                y2="252.215"
              >
                <stop stopColor="#FF9500" />
                <stop offset="1" stopColor="#995900" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className={cn(
            "absolute right-1/2 bottom-[10%] flex w-full translate-x-1/2 flex-col items-center justify-center gap-8 px-5 md:right-[5%] md:w-[60%] md:translate-x-0 md:items-end md:justify-end md:gap-16 md:px-0"
          )}
          id="content-container"
        >
          <div
            className={cn(
              "flex flex-col gap-2 text-center md:gap-6 md:text-right"
            )}
            id="text-container"
          >
            <h1 className={cn("font-serif-2 text-white text-xl-2 md:text-xxl")}>
              Halaman Tidak Ditemukan
            </h1>
            <p className={cn("font-sans text-m text-white md:text-l")}>
              Kami tidak dapat menemukan halaman yang kamu cari
            </p>
          </div>
          <Link
            className={cn(
              "rounded-lg bg-red-2 px-8 py-4 font-serif-2 text-m text-white no-underline transition-colors duration-300 ease-in-out hover:bg-[color-mix(in_oklch,var(--color-red-2)_80%,transparent_20%)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 active:bg-[color-mix(in_oklch,var(--color-red-2)_60%,transparent_40%)]"
            )}
            to={"https://tedxuniversitasbrawijaya.com" as never}
          >
            Kembali ke home
          </Link>
        </div>

        <img
          alt="Paper Texture"
          className={cn(
            "pointer-events-none absolute inset-0 aspect-[1.78/1] h-dvh w-dvw object-cover mix-blend-multiply"
          )}
          height={713}
          src={PaperTexture1}
          width={1268}
        />
      </main>
      <style>{`
        @keyframes blink {
          0%, 30% { opacity: 1; }
          31%, 40% { opacity: 0; }
          41%, 50% { opacity: 1; }
          51%, 55% { opacity: 0; }
          56%, 60% { opacity: 1; }
          61%, 70% { opacity: 1; }
          71%, 80% { opacity: 0; }
          81%, 100% { opacity: 1; }
        }

        .animate-blink {
          animation: blink 3s infinite;
        }
      `}</style>
      <Footer />
    </>
  );
};
