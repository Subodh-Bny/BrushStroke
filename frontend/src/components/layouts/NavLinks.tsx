import React from "react";
import Link from "next/link";
import routes from "@/config/routes";

const NavLinks = ({
  isScrolled,
  pathname,
}: {
  isScrolled: boolean;
  pathname: string;
}) => {
  return (
    <nav
      className={`flex gap-2 text-xl ${
        pathname === "/"
          ? isScrolled
            ? "text-black"
            : "text-white"
          : "text-black"
      }`}
    >
      {routes?.withName?.map((route) => (
        <Link key={route.href} href={route.href}>
          {route.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
