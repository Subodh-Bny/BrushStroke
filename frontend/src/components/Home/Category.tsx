"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "../Container";
import Header from "../SectionHeading";
import { useGetCategories } from "@/services/api/categoryApi";
import { useGetArtworks } from "@/services/api/artworkApi";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";

export default function Category() {
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: artworks } = useGetArtworks();
  const router = useRouter();
  return (
    <Container>
      <Header>Categories</Header>
      {categoriesLoading ? (
        <div className="flex w-full items-centter justify-center">
          <ClipLoader size={50} />
        </div>
      ) : !categories || categories.length <= 0 ? (
        <div className="flex justify-center items-center w-full">
          <p>No categories at the moment! Try again later.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          style={{
            gridAutoRows: "1px",
            gridAutoFlow: "dense",
          }}
        >
          {categories?.map((category, index) => (
            <Card
              key={category._id}
              className={`relative overflow-hidden group hover:cursor-pointer ${
                index % 2 !== 0 && index <= 5 && "mt-4"
              }`}
              style={{
                gridRowEnd: `span ${Math.ceil(
                  (index % 2 === 0 ? 200 : 180) / 10
                )}`,
              }} // Adjusting height for masonry effect
              onClick={() =>
                router.push(routes.artworkByCategoryId + category?._id)
              }
            >
              <div className="relative w-full h-full">
                <Image
                  src={
                    artworks?.find(
                      (artwork) => artwork.category === category?._id
                    )?.image || "/noImage.jpg"
                  }
                  alt={"category.title"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
                <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 ">
                  <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
