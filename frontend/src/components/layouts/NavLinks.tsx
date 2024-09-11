import React from "react";
import Link from "next/link";
import routes from "@/config/routes";

const NavLinks = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <nav
      className={`flex gap-2 text-xl ${
        isScrolled ? "text-black" : "text-white"
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
