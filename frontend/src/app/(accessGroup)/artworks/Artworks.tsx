"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../../../components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import useApiErrorHandler from "@/hooks/useApiErrorHandler";
import { useAddToCart } from "@/services/api/cartApi";
import Link from "next/link";

export default function Artworks({
  artworks,
  isLoading,
  isError,
  title,
}: {
  artworks: Artwork[];
  isLoading: boolean;
  isError: boolean;
  title: string;
}) {
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
    <>
      <Header>{title}</Header>
      {!artworks || artworks.length <= 0 ? (
        <div className="flex w-full justify-center items-center">
          No artworks for the selected category at the moment. Explore other
          categories&nbsp;
          <Link
            href={routes.landing.home + "#categories"}
            className="text-red-500 underline"
          >
            here
          </Link>
          .
        </div>
      ) : (
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
                      by{" "}
                      {typeof artwork.artist === "object" &&
                      "username" in artwork.artist
                        ? artwork.artist.username
                        : ""}
                    </p>
                    <p className="text-lg font-bold mb-2">Rs {artwork.price}</p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        artwork && handleAddToCart(artwork);
                      }}
                      disabled={!artwork.availability}
                      className="w-full bg-white text-black hover:bg-gray-200"
                    >
                      {!artwork.availability
                        ? "Artwork not available"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
