import { Link } from "@tanstack/react-router";
import FooterAssets from "@/assets/imgs/carpet-2.png";
import Logo from "@/assets/imgs/logo.png";
import Texture from "@/assets/imgs/paper-texture-1.png";
import silhouetteOfLightMobile from "@/assets/svgs/silhouette-of-light-mobile.svg";
import silhouetteOfLight from "@/assets/svgs/silhouette-of-light.svg";
import { cn } from "@tedx-2026/ui/lib/utils";

export const Footer = () => {
  return (
    <footer
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[#0f0f0f] text-white"
      )}
      id="footer"
    >
      <img
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-5 h-full w-full object-cover mix-blend-multiply"
        )}
        height={713}
        id="footer-texture"
        loading="lazy"
        src={Texture}
        width={1268}
      />
      <div
        className={cn(
          "relative flex min-h-125 w-full items-start px-6 pt-[2.2rem] pb-[9.2rem] sm:min-h-62.5 sm:items-center sm:px-[4.7rem] sm:pt-[2.4rem] sm:pb-8 md:min-h-63.75 md:px-[4.8rem]"
        )}
        id="footer-backdrop"
      >
        <img
          alt=""
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-top brightness-[4] contrast-[3.8] md:block"
          )}
          height={350}
          id="footer-light-desktop"
          loading="lazy"
          src={silhouetteOfLight}
          width={1920}
        />
        <img
          alt=""
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover object-left brightness-[4] contrast-[3.8] md:hidden"
          )}
          height={550}
          id="footer-light-mobile"
          loading="lazy"
          src={silhouetteOfLightMobile}
          width={393}
        />
        <div
          className={cn(
            "relative z-3 mx-[0.45rem] mt-[0.7rem] flex max-w-92.5 flex-col items-start gap-5 text-left sm:mx-0 sm:mt-0 sm:max-w-125 sm:gap-[1.2rem] md:max-w-132.5"
          )}
          id="footer-content"
        >
          <div id="footer-brand">
            <Link
              className={cn("inline-flex w-fit items-center justify-center")}
              id="footer-logo-link"
              to="/"
            >
              <img
                alt="TEDx Universitas Brawijaya logo"
                className={cn(
                  "h-auto w-[min(74vw,340px)] max-w-full object-cover object-center sm:w-[min(52vw,290px)] md:h-[clamp(2.1rem,3.3vw,3rem)] md:w-auto"
                )}
                height={160}
                id="footer-logo"
                loading="lazy"
                src={Logo}
                width={605}
              />
            </Link>
          </div>
          <div
            className={cn(
              "flex flex-col items-start gap-[0.15rem] font-sans leading-[1.3] opacity-40"
            )}
            id="footer-copy"
          >
            <p
              className={cn(
                "text-[clamp(1.04rem,4.2vw,1.28rem)] sm:text-[clamp(0.9rem,2.35vw,1rem)]"
              )}
            >
              ©2026. TEDxUniversitasBrawijaya
            </p>
            <p
              className={cn(
                "text-[clamp(1.04rem,4.2vw,1.28rem)] sm:text-[clamp(0.9rem,2.35vw,1rem)]"
              )}
            >
              An independently organized TED-like event under license from TED.
            </p>
          </div>
          <nav aria-label="Social links" id="footer-social">
            <ul
              className={cn(
                "m-0 flex list-none flex-wrap justify-start gap-x-4 gap-y-[0.55rem] p-0"
              )}
            >
              <li>
                <Link
                  aria-label="Instagram"
                  className={cn(
                    "inline-flex items-center gap-2 p-0 text-[clamp(1.05rem,3.8vw,1.24rem)] text-[color-mix(in_oklch,var(--color-white)_85%,transparent_15%)] no-underline transition-[transform,color,background-color] duration-180 ease-in-out hover:-translate-y-0.5 hover:text-red-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[clamp(0.88rem,1.75vw,1rem)] md:text-[clamp(0.78rem,0.95vw,0.92rem)]"
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                  to={
                    "https://www.instagram.com/tedxuniversitasbrawijaya/" as never
                  }
                >
                  <svg
                    aria-hidden="true"
                    className={cn(
                      "h-[1.24em] w-[1.24em] shrink-0 sm:h-[1.1em] sm:w-[1.1em]"
                    )}
                    fill="none"
                    focusable="false"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8567 1.66663C11.7942 1.66913 12.2701 1.67413 12.6809 1.68579L12.8426 1.69163C13.0292 1.69829 13.2134 1.70663 13.4359 1.71663C14.3226 1.75829 14.9276 1.89829 15.4584 2.10413C16.0084 2.31579 16.4717 2.60246 16.9351 3.06496C17.359 3.4814 17.6869 3.98535 17.8959 4.54163C18.1017 5.07246 18.2417 5.67746 18.2834 6.56496C18.2934 6.78663 18.3017 6.97079 18.3084 7.15829L18.3134 7.31996C18.3259 7.72996 18.3309 8.20579 18.3326 9.14329L18.3334 9.76496V10.8566C18.3354 11.4645 18.329 12.0723 18.3142 12.68L18.3092 12.8416C18.3026 13.0291 18.2942 13.2133 18.2842 13.435C18.2426 14.3225 18.1009 14.9266 17.8959 15.4583C17.6869 16.0146 17.359 16.5185 16.9351 16.935C16.5186 17.3589 16.0147 17.6868 15.4584 17.8958C14.9276 18.1016 14.3226 18.2416 13.4359 18.2833L12.8426 18.3083L12.6809 18.3133C12.2701 18.325 11.7942 18.3308 10.8567 18.3325L10.2351 18.3333H9.14423C8.53612 18.3354 7.928 18.329 7.32007 18.3141L7.1584 18.3091C6.96058 18.3016 6.76279 18.293 6.56507 18.2833C5.6784 18.2416 5.0734 18.1016 4.54173 17.8958C3.98576 17.6867 3.4821 17.3588 3.0659 16.935C2.64169 16.5186 2.31349 16.0146 2.10423 15.4583C1.8984 14.9275 1.7584 14.3225 1.71673 13.435L1.69173 12.8416L1.68757 12.68C1.67221 12.0723 1.66526 11.4645 1.66673 10.8566V9.14329C1.66443 8.53546 1.67054 7.92762 1.68507 7.31996L1.6909 7.15829C1.69757 6.97079 1.7059 6.78663 1.7159 6.56496C1.75757 5.67746 1.89757 5.07329 2.1034 4.54163C2.31315 3.98512 2.64192 3.48116 3.06673 3.06496C3.48269 2.64125 3.98606 2.31335 4.54173 2.10413C5.0734 1.89829 5.67757 1.75829 6.56507 1.71663C6.78673 1.70663 6.97173 1.69829 7.1584 1.69163L7.32007 1.68663C7.92773 1.67182 8.53556 1.66543 9.1434 1.66746L10.8567 1.66663ZM10.0001 5.83329C8.895 5.83329 7.83519 6.27228 7.05379 7.05368C6.27239 7.83508 5.8334 8.89489 5.8334 9.99996C5.8334 11.105 6.27239 12.1648 7.05379 12.9462C7.83519 13.7276 8.895 14.1666 10.0001 14.1666C11.1051 14.1666 12.1649 13.7276 12.9463 12.9462C13.7277 12.1648 14.1667 11.105 14.1667 9.99996C14.1667 8.89489 13.7277 7.83508 12.9463 7.05368C12.1649 6.27228 11.1051 5.83329 10.0001 5.83329ZM10.0001 7.49996C10.3284 7.4999 10.6535 7.56452 10.9568 7.6901C11.2601 7.81569 11.5358 7.99979 11.768 8.2319C12.0001 8.46401 12.1843 8.73957 12.31 9.04287C12.4357 9.34616 12.5004 9.67124 12.5005 9.99954C12.5005 10.3278 12.4359 10.6529 12.3103 10.9563C12.1848 11.2596 12.0007 11.5352 11.7685 11.7674C11.5364 11.9996 11.2609 12.1838 10.9576 12.3095C10.6543 12.4352 10.3292 12.4999 10.0009 12.5C9.33786 12.5 8.70197 12.2366 8.23313 11.7677C7.76429 11.2989 7.5009 10.663 7.5009 9.99996C7.5009 9.33692 7.76429 8.70103 8.23313 8.23219C8.70197 7.76335 9.33786 7.49996 10.0009 7.49996M14.3759 4.58329C14.0996 4.58329 13.8347 4.69304 13.6393 4.88839C13.444 5.08374 13.3342 5.34869 13.3342 5.62496C13.3342 5.90123 13.444 6.16618 13.6393 6.36153C13.8347 6.55688 14.0996 6.66663 14.3759 6.66663C14.6522 6.66663 14.9171 6.55688 15.1125 6.36153C15.3078 6.16618 15.4176 5.90123 15.4176 5.62496C15.4176 5.34869 15.3078 5.08374 15.1125 4.88839C14.9171 4.69304 14.6522 4.58329 14.3759 4.58329Z"
                      fill="#DC2625"
                    />
                  </svg>
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Twitter"
                  className={cn(
                    "inline-flex items-center gap-2 p-0 text-[clamp(1.05rem,3.8vw,1.24rem)] text-[color-mix(in_oklch,var(--color-white)_85%,transparent_15%)] no-underline transition-[transform,color,background-color] duration-180 ease-in-out hover:-translate-y-0.5 hover:text-red-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[clamp(0.88rem,1.75vw,1rem)] md:text-[clamp(0.78rem,0.95vw,0.92rem)]"
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                  to={"https://x.com/TEDxBrawijaya" as never}
                >
                  <svg
                    aria-hidden="true"
                    className={cn("h-[0.88em] w-[0.88em] shrink-0")}
                    fill="none"
                    focusable="false"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6007 0.768677H15.054L9.694 6.89534L16 15.2307H11.0627L7.196 10.1747L2.77067 15.2307H0.316L6.04933 8.67734L0 0.769343H5.06267L8.558 5.39068L12.6007 0.768677ZM11.74 13.7627H13.0993L4.324 2.16001H2.86533L11.74 13.7627Z"
                      fill="#DC2625"
                    />
                  </svg>
                  <span>Twitter</span>
                </Link>
              </li>
              <li>
                <Link
                  aria-label="TikTok"
                  className={cn(
                    "inline-flex items-center gap-2 p-0 text-[clamp(1.05rem,3.8vw,1.24rem)] text-[color-mix(in_oklch,var(--color-white)_85%,transparent_15%)] no-underline transition-[transform,color,background-color] duration-180 ease-in-out hover:-translate-y-0.5 hover:text-red-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[clamp(0.88rem,1.75vw,1rem)] md:text-[clamp(0.78rem,0.95vw,0.92rem)]"
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                  to={
                    "https://www.tiktok.com/@tedxuniversitasbrawijaya?lang=en" as never
                  }
                >
                  <svg
                    aria-hidden="true"
                    className={cn(
                      "h-[1.24em] w-[1.24em] shrink-0 sm:h-[1.1em] sm:w-[1.1em]"
                    )}
                    fill="none"
                    focusable="false"
                    viewBox="0 0 22 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9999 1.83337C9.18693 1.83337 7.41465 2.37099 5.9072 3.37824C4.39974 4.38548 3.22483 5.81712 2.53103 7.49211C1.83722 9.1671 1.65569 11.0102 2.00939 12.7884C2.36309 14.5665 3.23613 16.1999 4.51811 17.4819C5.80009 18.7638 7.43344 19.6369 9.2116 19.9906C10.9898 20.3443 12.8329 20.1627 14.5079 19.4689C16.1828 18.7751 17.6145 17.6002 18.6217 16.0928C19.629 14.5853 20.1666 12.813 20.1666 11C20.1642 8.56963 19.1976 6.23947 17.4791 4.52091C15.7605 2.80235 13.4303 1.8358 10.9999 1.83337ZM16.444 8.90363V9.49579C16.444 9.54111 16.435 9.58598 16.4173 9.62774C16.3997 9.6695 16.3739 9.7073 16.3414 9.73892C16.309 9.77054 16.2705 9.79532 16.2283 9.81182C16.1861 9.82832 16.141 9.83618 16.0957 9.83496C15.1278 9.76658 14.2019 9.41317 13.4346 8.81929V13.1533C13.4344 13.633 13.3386 14.1078 13.1529 14.55C12.9672 14.9923 12.6952 15.3931 12.3529 15.7291C12.0078 16.0739 11.5973 16.3464 11.1456 16.5305C10.6939 16.7147 10.2099 16.8069 9.72209 16.8016C8.74114 16.8002 7.79961 16.4153 7.09859 15.7291C6.65253 15.2794 6.33124 14.7213 6.16634 14.1097C6.00143 13.4982 5.99859 12.8542 6.15809 12.2412C6.30384 11.6527 6.59809 11.1119 7.01334 10.671C7.32302 10.2925 7.71337 9.98795 8.15587 9.77971C8.59836 9.57146 9.0818 9.46475 9.57084 9.46737H10.3225V11.0285C10.3228 11.0738 10.3135 11.1187 10.2951 11.1601C10.2767 11.2016 10.2497 11.2386 10.2159 11.2688C10.1821 11.299 10.1422 11.3216 10.0989 11.3352C10.0557 11.3487 10.01 11.3529 9.96501 11.3475C9.52857 11.2164 9.05829 11.2598 8.65329 11.4687C8.24829 11.6776 7.94022 12.0356 7.79401 12.4672C7.64781 12.8988 7.67489 13.3703 7.86955 13.7824C8.06422 14.1944 8.41125 14.5147 8.83751 14.6759C9.08501 14.818 9.36184 14.9014 9.64601 14.9206C9.86601 14.9298 10.086 14.9023 10.295 14.8363C10.6439 14.7186 10.9474 14.4949 11.1631 14.1965C11.3789 13.8981 11.4962 13.5398 11.4986 13.1716V5.27454C11.4986 5.18718 11.5332 5.10338 11.5949 5.04152C11.6566 4.97966 11.7403 4.94478 11.8277 4.94454H13.1248C13.209 4.94464 13.2901 4.97699 13.3513 5.03494C13.4125 5.09289 13.4492 5.17206 13.4538 5.25621C13.5011 5.66067 13.6296 6.05142 13.8315 6.40504C14.0334 6.75865 14.3047 7.06786 14.629 7.31412C15.0673 7.64311 15.5878 7.84484 16.1333 7.89712C16.215 7.90411 16.2914 7.94046 16.3483 7.99945C16.4053 8.05844 16.439 8.13606 16.4431 8.21796L16.444 8.90363Z"
                      fill="#DC2625"
                    />
                  </svg>
                  <span>TikTok</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className={cn("absolute inset-0 flex h-full w-full justify-end")}
          id="footer-decoration-container"
        >
          <img
            alt=""
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-[-16%] bottom-[-0.4rem] z-2 h-auto w-[166%] max-w-none select-none sm:right-[-5%] sm:w-[95%] md:right-0 md:w-[30%]"
            )}
            height={308}
            id="footer-decoration-image"
            loading="lazy"
            src={FooterAssets}
            width={1722}
          />
          <p
            className={cn(
              "absolute right-[-6%] bottom-[-10%] z-3 translate-x-[6%] translate-y-[10%] font-black font-sans text-[#a01a1a] text-[14rem] before:absolute before:right-[4%] before:-z-1 before:h-full before:w-full before:-translate-x-[4%] before:text-red-2 before:content-['X'] sm:right-[2%] sm:bottom-[-6%] sm:-translate-x-[2%] sm:translate-y-[6%] md:text-[12rem]"
            )}
            id="footer-decoration-text"
          >
            X
          </p>
        </div>
      </div>
    </footer>
  );
};
