"use client";
import React, { useState, useEffect, useContext } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import UserNav from "./UserNav";
import { Button } from "../ui/button";
import routes from "@/config/routes";
import { AuthContext } from "@/context/AuthContext";
import { useCartLength } from "@/hooks/useCartLength";
import { Badge } from "../ui/badge";
import { useGetCart } from "@/services/api/cartApi";
import ClipLoader from "react-spinners/ClipLoader";

const TopNav = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isLoading: cartLoading } = useGetCart();
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

  const cartLength = useCartLength();
  return (
    <div
      className={`w-full fixed top-0 z-50 backdrop-blur-[2px] transition-all duration-300 ${
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
        <div className="flex gap-2 items-center justify-center">
          <div className="relative">
            {isLoggedIn &&
              (cartLoading ? (
                <ClipLoader
                  size={15}
                  className={`hover:cursor-pointer ${
                    pathname === "/"
                      ? isScrolled
                        ? "text-black"
                        : "text-white"
                      : "text-black"
                  }`}
                />
              ) : (
                <Link
                  href={routes.cart}
                  className={`hover:cursor-pointer ${
                    pathname === "/"
                      ? isScrolled
                        ? "text-black"
                        : "text-white"
                      : "text-black"
                  }`}
                >
                  <ShoppingCart className="hover:cursor-pointer" />
                  {cartLength > 0 && (
                    <Badge className="absolute hover:cursor-pointer -top-1 -right-2 bg-red-500 text-white rounded-full text-xs font-bold px-1 py-0">
                      {cartLength}
                    </Badge>
                  )}
                </Link>
              ))}
          </div>
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
        </div>
      </header>
    </div>
  );
};

export default TopNav;
