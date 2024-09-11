import React from "react";
import Container from "../Container";
import Header from "../SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Featured = () => {
  return (
    <Container>
      <Header>Featured This Week</Header>

      <Card
        className={`relative overflow-hidden group hover:cursor-pointer h-[500px] flex-1`}
      >
        <div className="relative w-full h-full">
          <Image
            src={"/hero1.jpg"}
            alt={"Featured image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
          <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 group-hover:items-center  group-hover:justify-center ">
            <div className=" group-hover:opacity-100 opacity-0 text-center">
              <p className="text-2xl mb-1">{"Created By Subodh"}</p>
              <p className="text-lg font-bold mb-2">{"$1000"}</p>
              <p className="text-lg font-bold mb-2">{"1.M+ Likes"}</p>
            </div>
            <h2 className="text-2xl font-bold mb-1 group-hover:hidden">
              {"Scenary"}
            </h2>
          </CardContent>
        </div>
      </Card>
    </Container>
  );
};

export default Featured;
