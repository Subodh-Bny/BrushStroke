import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import routes from "@/config/routes";

const UserLinks = ({
  isScrolled,
  pathname,
}: {
  isScrolled: boolean;
  pathname: string;
}) => {
  return (
    <nav
      className={`flex gap-2 justify-self-end${
        pathname === "/"
          ? isScrolled
            ? "text-black"
            : "text-white"
          : "text-black"
      }`}
    >
      <Link
        href={routes.withoutName?.href || "#"}
        className={
          pathname === "/"
            ? isScrolled
              ? "text-black"
              : "text-white"
            : "text-black"
        }
      >
        <User />
      </Link>
    </nav>
  );
};

export default UserLinks;
