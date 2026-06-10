import Image from "next/image";

type ProductResponsiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

function getMobileSrc(src: string) {
  return src.endsWith("-desktop.webp") ? src.replace("-desktop.webp", "-mobile.webp") : null;
}

export function ProductResponsiveImage({ src, alt, sizes, className, priority = false }: ProductResponsiveImageProps) {
  const mobileSrc = getMobileSrc(src);

  if (!mobileSrc) {
    return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }

  return (
    <picture className="absolute inset-0 block">
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className || ""}`}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}
