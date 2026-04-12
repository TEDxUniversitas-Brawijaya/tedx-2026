import type { HeroImageViewProps } from "../types/merch-view";

const HeroImage = ({ cards }: HeroImageViewProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 flex h-screen w-full items-end overflow-hidden bg-transparent">
      <div className="relative -mb-5 h-3/4 w-full">
        {cards.map((card) => (
          <div
            className="absolute bottom-0 left-0 aspect-square overflow-hidden shadow-[0_45px_1000px_-30px_rgba(0,0,0,0.6)]"
            key={card.id}
            style={{
              width: `${card.width + 1}px`,
              transform: `translate3d(${card.x}px, 0, 0)`,
              transformOrigin: "left bottom",
              zIndex: card.zIndex,
              willChange: "transform",
            }}
          >
            <img
              alt="Merchandise product displaying local culture"
              className="h-full w-full object-cover"
              height={800}
              src={card.imageUrl}
              width={800}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroImage;
