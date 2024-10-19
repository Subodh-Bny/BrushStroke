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

interface Artwork {
  image: string;
  title: string;
  artist: string;
  description: string;
  price: string;
}

export default function HeroArtworkCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const [textVisible, setTextVisible] = useState<boolean>(true);
  //@ts-expect-error given by v0
  const autoplayRef = useRef<Autoplay>(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  const artworks: Artwork[] = [
    {
      image: "/hero1.jpg",
      title: "Ethereal Dreams",
      artist: "Alexandra Rivers",
      description:
        "A mesmerizing abstract piece that captures the essence of dreams and imagination.",
      price: "$1,200",
    },
    {
      image: "/hero2.jpg",
      title: "Urban Rhythm",
      artist: "Marcus Steel",
      description:
        "A vibrant cityscape that pulses with the energy of modern urban life.",
      price: "$950",
    },
    {
      image: "/hero-3.jpg",
      title: "Serene Horizons",
      artist: "Olivia Sky",
      description:
        "A calming landscape that invites viewers to lose themselves in distant horizons.",
      price: "$1,500",
    },
  ];

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
    console.log(`Viewing artwork: ${artworks[index].title}`);
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
          {artworks.map((artwork, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[600px] md:h-screen">
                <Image
                  src={artwork.image}
                  alt={`Artwork: ${artwork.title} by ${artwork.artist}`}
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
            {artworks[currentIndex].title}
          </h2>
          <p className="text-lg md:text-xl mb-2">
            by {artworks[currentIndex].artist}
          </p>
          <p className="text-sm md:text-base mb-4">
            {artworks[currentIndex].description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl md:text-2xl font-bold">
              {artworks[currentIndex].price}
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
