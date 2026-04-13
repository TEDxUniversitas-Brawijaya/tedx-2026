import { useEffect, useRef, useState } from "react";

export const useMerchScroll = (speedFactor = 0.001) => {
  const [renderScroll, setRenderScroll] = useState(0);
  const virtualScroll = useRef(0);
  const currentInterpolated = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const EASING = 0.08;
    const STOP_EPSILON = 0.05;

    const stopAnimation = () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };

    const animate = () => {
      const diff = virtualScroll.current - currentInterpolated.current;

      currentInterpolated.current += diff * EASING;

      if (Math.abs(diff) > STOP_EPSILON) {
        setRenderScroll(currentInterpolated.current);
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      currentInterpolated.current = virtualScroll.current;
      setRenderScroll(currentInterpolated.current);
      stopAnimation();
    };

    const ensureAnimating = () => {
      if (requestRef.current === null) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      virtualScroll.current += e.deltaY;
      ensureAnimating();
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
        ensureAnimating();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      stopAnimation();
    };
  }, []);

  return {
    renderScroll,
    globalProgress: (renderScroll * speedFactor) % 7,
  };
};
