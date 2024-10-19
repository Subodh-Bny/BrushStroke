"use client";
import React from "react";
import Artworks from "./Artworks";
import { useGetArtworks } from "@/services/api/artworkApi";
import Container from "@/components/Container";

const ArtworksPage = () => {
  const { data: artworks, isLoading, isError } = useGetArtworks();

  return (
    <Container className="mt-11 min-h-screen">
      <Artworks
        artworks={artworks || []}
        isLoading={isLoading}
        isError={isError}
        title={"Artworks"}
      />
    </Container>
  );
};

export default ArtworksPage;
