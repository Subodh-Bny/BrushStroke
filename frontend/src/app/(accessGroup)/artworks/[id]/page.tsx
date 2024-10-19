"use client";
import Image from "next/image";
// import { Star } from "lucide-react";

import Container from "@/components/Container";
// import Header from "@/components/SectionHeading";
import useApiErrorHandler from "@/hooks/useApiErrorHandler";
import { useGetArtworkById } from "@/services/api/artworkApi";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/services/api/cartApi";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

const ArtworkPage = ({ params }: { params: { id: string } }) => {
  const { id: artworkId } = params;
  const { mutate: addToCart } = useAddToCart();
  const {
    data: artwork,
    isLoading,
    isError,
  } = useGetArtworkById({ id: artworkId });
  const errorHandler = useApiErrorHandler({
    isLoading,
    isError,
    message: "Couldn't find the Artwork, Please try again.",
  });
  if (isError || isLoading) {
    return errorHandler();
  }

  const addToCartHandler = (artwork: Artwork) => {
    addToCart(artwork);
  };

  return (
    <Container className="mt-11 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="w-full h-full min-h-[70vh] relative rounded-lg overflow-hidden">
            <Image
              src={artwork?.image || "/notFound.png"}
              alt={artwork?.title || "Artwork Image"}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-16 h-full">
            <div>
              <h1 className="text-3xl font-bold">{artwork?.title}</h1>
              {/* <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div> */}
              <p className="text-xl font-semibold">Rs. {artwork?.price}</p>
              <p className="text-gray-600">{artwork?.description}</p>
              {/* <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Color</h3>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-black border-2 border-gray-300"
                  aria-label="Black"
                ></button>
                <button
                  className="w-8 h-8 rounded-full bg-white border-2 border-gray-300"
                  aria-label="White"
                ></button>
                <button
                  className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300"
                  aria-label="Red"
                ></button>
              </div>
            </div> */}
              {/* <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Quantity</h3>
              <Select defaultValue="1">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => {
                artwork && addToCartHandler(artwork);
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ArtworkPage;
