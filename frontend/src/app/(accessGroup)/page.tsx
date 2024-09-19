"use client";
import HeroCarousel from "@/components/Home/HeroCarousel";
import React from "react";
import Category from "@/components/Home/Category";
import Featured from "@/components/Home/Featured";

export default function Page() {
  return (
    <div className="relative">
      <HeroCarousel />
      <Category />
      <Featured />
    </div>
  );
}
