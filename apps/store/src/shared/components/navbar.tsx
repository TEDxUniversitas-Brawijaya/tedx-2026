import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Logo from "@/assets/imgs/logo.png";
import MenuBook from "@/assets/imgs/menu-book.png";

type MenuChild = {
  readonly name: string;
  readonly href: string;
};

type MenuItem = {
  readonly name: string;
  readonly href?: string;
  readonly children?: readonly MenuChild[];
};

const menu: readonly MenuItem[] = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    children: [
      {
        name: "About TED",
        href: "https://tedxuniversitasbrawijaya.com/about-ted",
      },
      {
        name: "Grand Theme",
        href: "https://tedxuniversitasbrawijaya.com/about-ted#grand-theme",
      },
      {
        name: "Our Team",
        href: "https://tedxuniversitasbrawijaya.com/our-team",
      },
    ],
  },
  {
    name: "Event",
    children: [
      {
        name: "Propaganda 1",
        href: "https://tedxuniversitasbrawijaya.com/events/propaganda-1",
      },
      {
        name: "Pre Event",
        href: "https://tedxuniversitasbrawijaya.com/events/pre-event",
      },
      {
        name: "Propaganda 2",
        href: "https://tedxuniversitasbrawijaya.com/events/propaganda-2",
      },
      {
        name: "Propaganda 3",
        href: "https://tedxuniversitasbrawijaya.com/events/propaganda-3",
      },
      {
        name: "Main Event",
        href: "https://tedxuniversitasbrawijaya.com/events/main-event",
      },
    ],
  },
  {
    name: "Order",
    children: [
      { name: "Merch TEDx", href: "/merchandise" },
      { name: "Ticket", href: "/tickets" },
    ],
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [page, setPage] = useState<"left" | "right">("left");
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isTouchInMenuRef = useRef<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }

    touchStartXRef.current = firstTouch.clientX;
    touchStartYRef.current = firstTouch.clientY;
    isTouchInMenuRef.current =
      menuContainerRef.current?.contains(event.target as Node) ?? false;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      isTouchInMenuRef.current
    ) {
      return;
    }

    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }

    const diffX = firstTouch.clientX - touchStartXRef.current;
    const diffY = firstTouch.clientY - touchStartYRef.current;

    if (Math.abs(diffX) <= Math.abs(diffY)) {
      return;
    }

    event.preventDefault();

    const tolerance = 50;
    if (Math.abs(diffX) <= tolerance) {
      return;
    }

    if (diffX < 0 && page === "left") {
      setPage("right");
    }

    if (diffX > 0 && page === "right") {
      setPage("left");
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isTouchInMenuRef.current = false;
  };

  useEffect(() => {
    if (!isOpen) {
      setPage("left");
    }
  }, [isOpen]);

  const menuPageTransform =
    page === "left"
      ? "translate(-25%, -50%) scale(1)"
      : "translate(-75%, -50%) scale(1)";

  const modalClassName = isOpen ? "pointer-events-auto" : "pointer-events-none";
  const backdropClassName = isOpen ? "opacity-100" : "opacity-0";
  const contentClassName = isOpen
    ? "opacity-100 blur-0"
    : "opacity-0 blur-[2px]";

  const menuHeadingClassName =
    "grid grid-cols-[auto_1fr] items-center after:translate-y-[5px] after:border-b-2 after:border-dotted after:border-black after:content-['']";

  const menuLinkClassName =
    "grid grid-cols-[auto_1fr] items-center text-black no-underline transition-colors duration-300 ease-in-out after:translate-y-[9px] after:border-b-2 after:border-dotted after:border-black after:transition-colors after:duration-300 after:ease-in-out after:content-[''] hover:text-red-2 hover:after:border-red-2 focus:text-red-2 focus:after:border-red-2 focus:outline-none";

  const submenuLinkClassName =
    "grid grid-cols-[auto_1fr] items-center text-black no-underline transition-colors duration-300 ease-in-out after:translate-y-[5px] after:border-b after:border-dotted after:border-black after:transition-colors after:duration-300 after:ease-in-out after:content-[''] hover:text-red-2 hover:after:border-red-2 focus:text-red-2 focus:after:border-red-2 focus:outline-none";

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-9999 flex h-18 items-center justify-between bg-[#171715] px-5 py-4 md:h-20 md:px-37.5">
        <Link
          aria-label="TEDx Universitas Brawijaya Home"
          className="inline-block h-full w-auto rounded-lg focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          id="logo-link"
          to="/"
        >
          <img
            alt="TEDx Universitas Brawijaya Logo"
            className="aspect-[3.78/1] h-full w-auto object-cover object-center"
            height={160}
            id="logo"
            src={Logo}
            width={605}
          />
        </Link>

        <button
          aria-label="Menu"
          className="flex cursor-pointer items-center gap-2 border-0 bg-transparent px-4 py-2 text-[#fff] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 md:px-8 md:py-4"
          id="navbar-menu-button"
          onClick={() => {
            setIsOpen(true);
          }}
          type="button"
        >
          <span>Menu</span>
          <Menu size={24} />
        </button>
      </header>

      <div
        className={`fixed top-0 left-0 z-10000 h-full w-full ${modalClassName}`}
        id="modal"
      >
        <button
          aria-label="Close menu"
          className={`absolute top-0 left-0 h-full w-full border-0 bg-black/50 transition-opacity duration-300 ease-in-out ${backdropClassName}`}
          id="modal-backdrop"
          onClick={() => {
            setIsOpen(false);
          }}
          type="button"
        />

        <div
          className={`absolute top-1/2 left-1/2 aspect-[1.39/1] h-auto w-[150%] overflow-visible transition-[opacity,transform,filter] duration-300 ease-in-out md:max-w-[90dvw] lg:w-[90%] lg:max-w-[60dvw] min-[1440px]:w-[80%] min-[1920px]:w-[80%] min-[1440px]:max-w-[60dvw] min-[1920px]:max-w-[50dvw] ${contentClassName}`}
          id="modal-content"
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          style={{
            transform: menuPageTransform,
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 h-auto w-full -translate-x-1/2 -translate-y-1/2"
            id="menu-book-container-wrapper"
          >
            <div
              className="relative aspect-[1.39/1] h-auto w-full"
              id="menu-book-container"
            >
              <img
                alt="Menu Book"
                className="aspect-[1.39/1] h-full w-auto object-cover object-center"
                height={763}
                id="menu-book"
                src={MenuBook}
                width={1061}
              />
              <div
                className="absolute top-1/2 left-[6%] h-[90%] w-[44%] -translate-y-1/2 px-8 py-2 lg:px-10 lg:py-6"
                id="menu-container-wrapper"
              >
                <div
                  className="relative flex h-full w-full flex-col gap-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  id="menu-container"
                  ref={menuContainerRef}
                >
                  <div
                    className="flex flex-col items-center gap-2 text-center"
                    id="heading"
                  >
                    <h2 className="font-serif-2 text-black text-m lg:text-l">
                      TABLE OF CONTENT
                    </h2>
                    <span className="font-sans text-black text-s lg:text-m">
                      TEDX UNIVERSITAS BRAWIJAYA
                    </span>
                  </div>

                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {menu.map((item) => {
                      if (item.children) {
                        return (
                          <li
                            className="font-serif-2 text-black text-m lg:text-l"
                            key={item.name}
                          >
                            <span className={menuHeadingClassName}>
                              {item.name}
                            </span>
                            <ul className="mt-1 flex list-none flex-col gap-1 pl-4">
                              {item.children.map((child) => {
                                const isExternal =
                                  child.href.startsWith("http");

                                return (
                                  <li
                                    className="font-serif-2 text-black text-s lg:text-m"
                                    key={child.name}
                                  >
                                    {isExternal ? (
                                      <Link
                                        className={submenuLinkClassName}
                                        onClick={() => setIsOpen(false)}
                                        to={child.href as never}
                                      >
                                        {child.name}
                                      </Link>
                                    ) : (
                                      <Link
                                        className={submenuLinkClassName}
                                        onClick={() => setIsOpen(false)}
                                        to={child.href}
                                      >
                                        {child.name}
                                      </Link>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      }

                      if (!item.href) {
                        return null;
                      }

                      const isExternal = item.href.startsWith("http");

                      return (
                        <li
                          className="font-serif-2 text-black text-m lg:text-l"
                          key={item.name}
                        >
                          {isExternal ? (
                            <Link
                              className={menuLinkClassName}
                              onClick={() => setIsOpen(false)}
                              to={item.href as never}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <Link
                              className={menuLinkClassName}
                              onClick={() => setIsOpen(false)}
                              to={item.href}
                            >
                              {item.name}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
