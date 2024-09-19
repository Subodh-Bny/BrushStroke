"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "../../../components/Container";
import Header from "../../../components/SectionHeading";
import { Button } from "@/components/ui/button";

const ProductsData: Product[] = [
  {
    id: 1,
    title: "hero2.jpg",
    artist: "Emma Stone",
    price: 450,
    image: "/hero2.jpg",
  },
  {
    id: 2,
    title: "hero-.jpg",
    artist: "John Doe",
    price: 550,
    image: "/hero-3.jpg",
  },
  {
    id: 3,
    title: "hero1.jpg",
    artist: "Alice Johnson",
    price: 380,
    image: "/hero1.jpg",
  },
  {
    id: 4,
    title: "hero1.jpg",
    artist: "Michael Brown",
    price: 620,
    image: "/hero1.jpg",
  },
  {
    id: 5,
    title: "hero1.jpg",
    artist: "Sarah Lee",
    price: 490,
    image: "/hero1.jpg",
  },
  {
    id: 6,
    title: "hero1.jpg",
    artist: "David Wilson",
    image: "/hero1.jpg",
    price: 580,
  },
];

export default function Products() {
  const handleAddToCart = (productId: number) => {
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <Container>
      <Header>Products</Header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        style={{
          gridAutoRows: "1px",
          gridAutoFlow: "dense",
        }}
      >
        {ProductsData.map((product, index) => (
          <Card
            key={product.id}
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
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 " />
              <CardContent className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 ">
                <div className="group-hover:opacity-100 opacity-0 ">
                  <h2 className="text-2xl font-bold mb-1">{product.title}</h2>
                  <p className="text-sm mb-1">by {product.artist}</p>
                  <p className="text-lg font-bold mb-2">${product.price}</p>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
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
