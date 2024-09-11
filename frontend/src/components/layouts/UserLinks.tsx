import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import routes from "@/config/routes";

const UserLinks = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <nav
      className={`flex gap-2 justify-self-end${
        isScrolled ? "text-black" : "text-white"
      }`}
    >
      <Link
        href={routes.withoutName?.href || "#"}
        className={isScrolled ? "text-black" : "text-white"}
      >
        <User />
      </Link>
    </nav>
  );
};

export default UserLinks;
