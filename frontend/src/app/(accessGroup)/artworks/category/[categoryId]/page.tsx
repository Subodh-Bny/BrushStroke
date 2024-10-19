"use client";
import Container from "@/components/Container";
import { useGetArtworkByCategory } from "@/services/api/artworkApi";
import { useGetCategories } from "@/services/api/categoryApi";
import React from "react";
import Artworks from "../../Artworks";

const ArtworksByCategoryPage = ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const { categoryId } = params;
  const { data: categories } = useGetCategories();
  const {
    data: artworks,
    isLoading: artworksLoading,
    isError: artworksError,
  } = useGetArtworkByCategory({ categoryId });
  const categoryName = categories?.find(
    (category) => category?._id === categoryId
  )?.name;
  return (
    <Container className="mt-11 min-h-screen">
      <Artworks
        artworks={artworks || []}
        isLoading={artworksLoading}
        isError={artworksError}
        title={categoryName || ""}
      />
    </Container>
  );
};

export default ArtworksByCategoryPage;
