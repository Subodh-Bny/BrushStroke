import React from "react";
import Link from "next/link";
import routes from "@/config/routes";

const links = [
  { name: "Home", href: routes.landing.home },
  { name: "About", href: routes.landing.about },
  { name: "Contact", href: routes.landing.contact },
];

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
      {links?.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            pathname === "/"
              ? isScrolled
                ? "hover:text-red-500"
                : "hover:text-white/80"
              : "hover:text-red-500"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
