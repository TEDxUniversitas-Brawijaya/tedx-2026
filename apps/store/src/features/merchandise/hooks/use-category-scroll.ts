import { useEffect, useRef, useState } from "react";

export const CATEGORIES = [
  { id: "t-shirt", title: "T-SHIRT", prev: "BUNDLING", next: "WORKSHIRT" },
  { id: "workshirt", title: "WORKSHIRT", prev: "T-SHIRT", next: "HAT" },
  { id: "hat", title: "HAT", prev: "WORKSHIRT", next: "SOCKS" },
  { id: "socks", title: "SOCKS", prev: "HAT", next: "STICKERS" },
  { id: "stickers", title: "STICKERS", prev: "SOCKS", next: "BUNDLING" },
  { id: "bundling", title: "BUNDLING", prev: "STICKERS", next: "T-SHIRT" },
];

export const LOOP_CATEGORIES = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

export const useCategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }

    const itemWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollLeft = itemWidth * CATEGORIES.length;

    const handleResize = () => {
      const newWidth = scrollContainer.offsetWidth;
      scrollContainer.scrollLeft =
        newWidth * (CATEGORIES.length + activeIndexRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }

    const scrollLeft = scrollContainer.scrollLeft;
    const itemWidth = scrollContainer.offsetWidth;
    const totalSetWidth = itemWidth * CATEGORIES.length;

    if (scrollLeft >= totalSetWidth * 2) {
      scrollContainer.scrollLeft = scrollLeft - totalSetWidth;
    } else if (scrollLeft <= 0) {
      scrollContainer.scrollLeft = scrollLeft + totalSetWidth;
    }

    const normalizedScroll = scrollLeft % totalSetWidth;
    const currentActive =
      Math.round(normalizedScroll / itemWidth) % CATEGORIES.length;
    if (currentActive !== activeIndex) {
      setActiveIndex(currentActive);
    }
  };

  const scrollPrev = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }
    const itemWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollBy({ left: -itemWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }
    const itemWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollBy({ left: itemWidth, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }
    const itemWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollTo({
      left: (CATEGORIES.length + index) * itemWidth,
      behavior: "smooth",
    });
  };

  return {
    scrollRef,
    activeIndex,
    handleScroll,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
};
