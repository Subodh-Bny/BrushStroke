import React from "react";
import Container from "../Container";
import Header from "../SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useGetFeaturedArtwork } from "@/services/api/artworkApi";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";

const Featured = () => {
  const { data: featuredArtwork, isLoading: featuredArtworkLoading } =
    useGetFeaturedArtwork();
  const router = useRouter();
  return (
    <Container>
      <Header>Featured This Week</Header>
      {featuredArtworkLoading ? (
        <div className="flex w-full items-centter justify-center">
          <ClipLoader size={50} />
        </div>
      ) : featuredArtwork ? (
        <Card
          className={`relative overflow-hidden group hover:cursor-pointer h-[500px] flex-1`}
          onClick={() =>
            router.push(routes.artworks + "/" + featuredArtwork._id)
          }
        >
          <div className="relative w-full h-full">
            <Image
              src={
                featuredArtwork
                  ? featuredArtwork.image || "/hero1.jpg"
                  : "/hero1.jpg"
              }
              alt={"Featured image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
            <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 group-hover:items-center  group-hover:justify-center ">
              <div className=" group-hover:opacity-100 opacity-0 text-center">
                <p className="text-2xl mb-1">{`Created By ${
                  typeof featuredArtwork.artist === "object" &&
                  "username" in featuredArtwork.artist
                    ? featuredArtwork.artist.username
                    : "Unknown artist"
                }`}</p>

                <p className="text-lg font-bold mb-2">
                  Rs&nbsp;{featuredArtwork.price}
                </p>
                {/* <p className="text-lg font-bold mb-2">{"1.M+ Likes"}</p> */}
              </div>
              <h2 className="text-2xl font-bold mb-1 group-hover:hidden">
                {featuredArtwork.title}
              </h2>
            </CardContent>
          </div>
        </Card>
      ) : (
        <p className="text-center">{"No artworks featured this week."}</p>
      )}
    </Container>
  );
};

export default Featured;
