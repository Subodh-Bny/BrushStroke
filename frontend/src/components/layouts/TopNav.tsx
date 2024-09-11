"use client";
import React, { useState, useEffect } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";
import UserLinks from "./UserLinks";

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full fixed top-0 z-40 backdrop-blur-[2px] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <header className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="#"
          className={`font-caveat text-4xl select-none justify-self-start cursor-pointer ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          <span className="text-red-500">Brush</span>
          <span className={`${isScrolled ? "text-black" : "text-white"}`}>
            Stroke
          </span>
          <span className="text-red-500">.</span>
        </Link>
        <NavLinks isScrolled={isScrolled} />
        <UserLinks isScrolled={isScrolled} />
      </header>
    </div>
  );
};

export default TopNav;
