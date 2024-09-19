"use client";
import React, { useState, useEffect, useContext } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserNav from "./UserNav";
import { Button } from "../ui/button";
import routes from "@/config/routes";
import { AuthContext } from "@/context/AuthContext";

const TopNav = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRoute = (route: string) => {
    router.push(route);
  };

  return (
    <div
      className={`w-full fixed top-0 z-40 backdrop-blur-[2px] transition-all duration-300 ${
        pathname === "/"
          ? isScrolled
            ? "bg-background shadow-lg"
            : "bg-background/5"
          : "bg-background shadow-lg"
      }`}
    >
      <header className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={routes.landing.home}
          className={`font-caveat text-4xl select-none cursor-pointer ${
            pathname === "/"
              ? isScrolled
                ? "text-black"
                : "text-white"
              : "text-black"
          }`}
        >
          <span className="text-red-500">Brush</span>
          <span
            className={`${
              pathname === "/"
                ? isScrolled
                  ? "text-black"
                  : "text-white"
                : "text-black"
            }`}
          >
            Stroke
          </span>
          <span className="text-red-500">.</span>
        </Link>
        <NavLinks isScrolled={isScrolled} pathname={pathname} />
        {!isLoggedIn ? (
          <div className="flex gap-2">
            <Button
              className={`bg-white font-bold hover:text-white hover:bg-red-500 ${
                pathname === "/"
                  ? isScrolled
                    ? "text-red-500 bg-transparent border border-red-500"
                    : "text-red-500"
                  : "bg-transparent border border-red-500 text-red-500"
              }`}
              onClick={() => handleRoute(routes.auth.login)}
            >
              Login
            </Button>
            <Button
              className="bg-red-500 font-bold hover:bg-red-600"
              onClick={() => handleRoute(routes.auth.signup)}
            >
              Signup
            </Button>
          </div>
        ) : (
          <UserNav isScrolled={isScrolled} pathname={pathname} />
        )}
      </header>
    </div>
  );
};

export default TopNav;
