export const Header = ({ logo }: { logo: string }) => {
  return (
    <div className="container mx-auto flex max-w-[calc(100vw-2rem)] items-center justify-between pt-8 md:max-w-2xl md:pt-12 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      <span className="font-bold font-sans-2 text-3xl text-black tracking-tight md:text-5xl md:tracking-normal">
        CATEGORY
      </span>
      <img
        alt="TEDx Logo"
        className="h-10 w-auto md:h-32"
        height={128}
        src={logo}
        width={128}
      />
    </div>
  );
};
