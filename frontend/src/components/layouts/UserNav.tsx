"use client";
import React, { useContext, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import routes from "@/config/routes";
import { useRouter } from "next/navigation";
import { StackIcon } from "@radix-ui/react-icons";

const UserNav = ({
  isScrolled,
  pathname,
}: {
  isScrolled: boolean;
  pathname: string;
}) => {
  const { logout, user } = useContext(AuthContext);
  const [userType, setUserType] = useState("");
  const router = useRouter();
  useEffect(() => {
    user && setUserType(user?.role || "");
  }, [user]);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <User
            className={`hover:cursor-pointer ${
              pathname === "/"
                ? isScrolled
                  ? "text-black"
                  : "text-white"
                : "text-black"
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`w-56   border-none shadow-lg ${
            isScrolled ? "bg-background" : "bg-background/50 backdrop-blur-sm"
          }`}
          align="end"
          side="bottom"
        >
          <DropdownMenuLabel className="font-semibold text-foreground">
            {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userType === "ADMIN" && (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(routes.admin.dashboard)}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />

              <span>Admin Panel</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(routes.manageProfile)}
            className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Manage Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer"
            onClick={() => router.push(routes.orders)}
          >
            <StackIcon className="mr-2 h-4 w-4" />
            <span>Your orders</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default UserNav;
