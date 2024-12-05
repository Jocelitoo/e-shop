import Image from 'next/image';

export const HomeBanner = () => {
  return (
    <div className="flex gap-4  text-white px-8 py-12 mb-8 bg-gradient-to-r from-sky-500 to-sky-700">
      <div className="flex flex-1 flex-col justify-center items-center gap-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">E-Shop!</h1>
        <p>Aproveite os últimos lançamentos</p>
        <p className="text-yellow-400 uppercase text-2xl font-bold sm:text-5xl">
          10% off
        </p>
      </div>

      <picture className="hidden flex-1 my-auto md:!block">
        <source
          media="(max-width:639px)"
          srcSet="/images/banner-mobile.png"
          type="image/png"
          width={640}
          height={329}
        />
        <source
          media="(max-width:1023px)"
          srcSet="/images/banner-tablet.png"
          type="image/png"
          width={1024}
          height={527}
        />
        <Image
          src="/images/banner-desktop.png"
          alt="Banner"
          className="w-full object-cover"
          width={1920}
          height={988}
        />
      </picture>
    </div>
  );
};
