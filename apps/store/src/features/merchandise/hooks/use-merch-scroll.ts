import { useEffect, useRef, useState } from "react";

export const useMerchScroll = (speedFactor = 0.001) => {
  const [renderScroll, setRenderScroll] = useState(0);
  const virtualScroll = useRef(0);
  const currentInterpolated = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const diff = virtualScroll.current - currentInterpolated.current;

      currentInterpolated.current += diff * 0.06;

      if (Math.abs(diff) > 0.001) {
        setRenderScroll(currentInterpolated.current);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      virtualScroll.current += e.deltaY;
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        lastTouchY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const touchY = e.touches[0].clientY;
        const delta = lastTouchY - touchY;
        virtualScroll.current += delta * 2.5;
        lastTouchY = touchY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    renderScroll,
    globalProgress: (renderScroll * speedFactor) % 7,
  };
};
