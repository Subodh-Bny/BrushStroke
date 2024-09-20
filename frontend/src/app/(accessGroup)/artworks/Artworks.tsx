"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "../../../components/Container";
import Header from "../../../components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useGetArtworks } from "@/services/api/artworkApi";
import ClipLoader from "react-spinners/ClipLoader";

export default function Artworks() {
  const { data: artworks, isLoading, isError } = useGetArtworks();

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        Failed to load artworks. Please try again later.
      </Container>
    );
  }
  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <Container>
      <Header>Artworks</Header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        style={{
          gridAutoRows: "1px",
          gridAutoFlow: "dense",
        }}
      >
        {artworks?.map((product, index) => (
          <Card
            key={product._id}
            className={`relative overflow-hidden group hover:cursor-pointer ${
              index % 2 !== 0 && index <= 5 && "mt-4"
            }`}
            style={{
              gridRowEnd: `span ${Math.ceil(
                (index % 2 === 0 ? 150 : 140) / 10
              )}`,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={product.image || "/notFound.jpg"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
              <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 ">
                <div className="group-hover:opacity-100 opacity-0 ">
                  <h2 className="text-2xl font-bold mb-1">{product.title}</h2>
                  <p className="text-sm mb-1">
                    by {product.artist && product?.artist.username}
                  </p>
                  <p className="text-lg font-bold mb-2">${product.price}</p>
                  <Button
                    onClick={() => handleAddToCart(product._id || "")}
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
