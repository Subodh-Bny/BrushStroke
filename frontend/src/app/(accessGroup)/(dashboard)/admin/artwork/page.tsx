"use client";
import Container from "@/components/Container";
import Header from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import routes from "@/config/routes";
import { useGetArtworks, useUpdateArtwork } from "@/services/api/artworkApi";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import UpdateArtworkModal from "./UpdateArtwork";

const ArtworksPage = () => {
  const { data: artworks, isLoading, isError } = useGetArtworks();
  const { mutate: updateMutate } = useUpdateArtwork();

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center">
        <ClipLoader size={50} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>Failed to load artworks. Please try again later.</Container>
    );
  }

  const handleArtworkUpdate = (artwork: Partial<Artwork>) => {
    updateMutate(artwork);
  };

  return (
    <Container>
      <div className="flex w-full justify-between px-2">
        <Header>Artworks</Header>
        <Link href={routes.admin.artworks.add}>
          <span className="text-sm flex gap-1 select-none cursor-pointer items-center">
            <PlusCircle className="h-4 w-4" />
            Add New
          </span>
        </Link>
      </div>
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
          >
            <div className="relative w-full h-full">
              <Image
                src={artwork.image || "/notFound.jpg"}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (min-width: 769px) 25vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
              <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 ">
                <div className="group-hover:opacity-100 opacity-0 ">
                  <h2 className="text-2xl font-bold mb-1">{artwork.title}</h2>
                  <p className="text-sm mb-1">
                    by {artwork.artist && artwork.artist.username}
                  </p>
                  <p className="text-lg font-bold mb-2">${artwork.price}</p>
                  <UpdateArtworkModal
                    artwork={artwork}
                    onUpdate={handleArtworkUpdate}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default ArtworksPage;
