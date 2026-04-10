type NavArrowProps = {
  direction: "left" | "right";
  onClick: () => void;
};

export const NavArrow = ({ direction, onClick }: NavArrowProps) => {
  const isLeft = direction === "left";

  return (
    <button
      className={`group absolute top-1/2 z-30 flex -translate-y-1/2 items-center justify-center transition-all hover:scale-125 ${
        isLeft ? "left-4 md:left-8" : "right-4 md:right-8"
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`font-light font-sans-2 text-2xl text-[#000000]/60 transition-transform md:text-5xl lg:text-6xl ${
          isLeft ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
        }`}
      >
        {isLeft ? "←" : "→"}
      </span>
    </button>
  );
};
