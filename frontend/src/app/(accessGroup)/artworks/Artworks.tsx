"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "../../../components/Container";
import Header from "../../../components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useGetArtworks } from "@/services/api/artworkApi";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import useApiErrorHandler from "@/hooks/useApiErrorHandler";
import { useAddToCart } from "@/services/api/cartApi";

export default function Artworks() {
  const { data: artworks, isLoading, isError } = useGetArtworks();
  const router = useRouter();
  const { mutate: addToCart } = useAddToCart();
  const errorHandler = useApiErrorHandler({
    isLoading,
    isError,
    message: "Failed to load artworks. Please try again later",
  });

  if (isLoading || isError) {
    return errorHandler();
  }

  const handleAddToCart = (artwork: Artwork) => {
    addToCart(artwork);
  };

  return (
    <Container className="mt-11">
      <Header>Artworks</Header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        style={{
          gridAutoRows: "1px",
          gridAutoFlow: "dense",
        }}
      >
        {artworks?.map((artwork, index) => (
          <Card
            key={artwork._id}
            className={`relative overflow-hidden group hover:cursor-pointer ${
              index % 2 !== 0 && index <= 5 && "mt-4"
            }`}
            style={{
              gridRowEnd: `span ${Math.ceil(
                (index % 2 === 0 ? 150 : 140) / 10
              )}`,
            }}
            onClick={() => router.push(routes.artworks + "/" + artwork?._id)}
          >
            <div className="relative w-full h-full">
              <Image
                src={artwork.image || "/notFound.jpg"}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
              <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 ">
                <div className="group-hover:opacity-100 opacity-0 ">
                  <h2 className="text-2xl font-bold mb-1">{artwork.title}</h2>
                  <p className="text-sm mb-1">
                    by {artwork.artist && artwork?.artist.username}
                  </p>
                  <p className="text-lg font-bold mb-2">${artwork.price}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      artwork && handleAddToCart(artwork);
                    }}
                    className="w-full bg-white text-black hover:bg-gray-200"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
