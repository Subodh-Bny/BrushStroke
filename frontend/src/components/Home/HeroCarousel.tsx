"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGetArtworks } from "@/services/api/artworkApi";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import toast from "react-hot-toast";

interface Artwork {
  image: string;
  title: string;
  artist: string;
  description: string;
  price: string;
}

const artworksData: Artwork[] = [
  {
    image: "/hero1.jpg",
    title: "Ethereal Dreams",
    artist: "Alexandra Rivers",
    description:
      "A mesmerizing abstract piece that captures the essence of dreams and imagination.",
    price: "1,200",
  },
  {
    image: "/hero2.jpg",
    title: "Urban Rhythm",
    artist: "Marcus Steel",
    description:
      "A vibrant cityscape that pulses with the energy of modern urban life.",
    price: "950",
  },
  {
    image: "/hero-3.jpg",
    title: "Serene Horizons",
    artist: "Olivia Sky",
    description:
      "A calming landscape that invites viewers to lose themselves in distant horizons.",
    price: "1,500",
  },
];

export default function HeroArtworkCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const [textVisible, setTextVisible] = useState<boolean>(true);
  const router = useRouter();
  //@ts-expect-error given by v0
  const autoplayRef = useRef<Autoplay>(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  const { data: artworks } = useGetArtworks();

  const onSelect = useCallback(() => {
    if (!api) return;
    setTextVisible(false);
    setTimeout(() => {
      setCurrentIndex(api.selectedScrollSnap());
      setTextVisible(true);
    }, 500);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    onSelect();
    api.on("select", onSelect);
    api.on("pointerDown", () => {
      autoplayRef.current.stop();
    });
    api.on("pointerUp", () => {
      autoplayRef.current.reset();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const handleViewArtwork = (index: number) => {
    artworks
      ? artworks.length > 0
        ? router.push(`${routes.artworks}/${artworks[index]._id}`)
        : toast.error("Couldnot view artwork! Please Try again Later.")
      : toast.error("Couldnot view artwork! Please Try again Later.");
  };

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        plugins={[autoplayRef.current]}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full  "
      >
        <CarouselContent>
          {artworks && artworks.length > 0
            ? artworks.map((artwork, index) => {
                return (
                  <CarouselItem key={index}>
                    <div className="relative h-[600px] md:h-screen">
                      <Image
                        src={artwork.image || "noImage.jpg"}
                        alt={`Artwork ${artwork.title}`}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                );
              })
            : artworksData.map((artwork, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[600px] md:h-screen">
                    <Image
                      src={artwork.image || "noImage.jpg"}
                      alt={`Artwork ${artwork.title}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute inset-0 flex flex-col items-start justify-end  hover:cursor-pointer p-8 md:p-16 text-white bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <div
          className={`max-w-2xl transition-all duration-1000  ${
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {artworks && artworks.length > 0
              ? artworks[currentIndex].title
              : artworksData[currentIndex].title}
          </h2>
          <p className="text-lg md:text-xl mb-2">
            by&nbsp;
            {artworks &&
              artworks.length > 0 &&
              typeof artworks[currentIndex]?.artist === "object" &&
              "username" in artworks[currentIndex]?.artist &&
              artworks[currentIndex]?.artist.username}
          </p>
          <p className="text-sm md:text-base mb-4">
            {artworks && artworks.length > 0
              ? artworks[currentIndex].description
              : artworksData[currentIndex].description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xl md:text-2xl font-bold">
              Rs&nbsp;
              {artworks && artworks.length > 0
                ? artworks[currentIndex].price
                : artworksData[currentIndex].price}
            </span>
            <Button
              className="bg-white text-black hover:bg-gray-200 pointer-events-auto"
              onClick={() => handleViewArtwork(currentIndex)}
            >
              View Artwork
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
