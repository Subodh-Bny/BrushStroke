"use client";
import Container from "@/components/Container";
import Header from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import routes from "@/config/routes";
import {
  useDeleteArtwork,
  useGetArtworks,
  useUpdateArtwork,
} from "@/services/api/artworkApi";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateArtworkModal from "./UpdateArtwork";

const ArtworksPage = () => {
  const { data: artworks, isLoading, isError } = useGetArtworks();
  const { mutate: updateMutate } = useUpdateArtwork();
  const { mutate: deleteMutate } = useDeleteArtwork();

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

  const handleDeleteArtwork = (id: string) => {
    deleteMutate(id);
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
              <AlertDialog>
                <AlertDialogTrigger>
                  <X
                    size={20}
                    className="absolute z-50 right-1 top-1  text-white font-bold transition-opacity duration-300 opacity-0 group-hover:opacity-100 "
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the artwork.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleDeleteArtwork(artwork?._id || "");
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
                    by{" "}
                    {typeof artwork.artist === "object" &&
                    "username" in artwork.artist
                      ? artwork.artist.username
                      : ""}
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
