"use client";
import React, { useState } from "react";
import Link from "next/link";
import routes from "@/config/routes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../ui/button";

const UserNav = ({
  isScrolled,
  pathname,
}: {
  isScrolled: boolean;
  pathname: string;
}) => {
  const [userType, setUserType] = useState("ARTIST");
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
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(userType === "ARTIST" || userType === "ADMIN") && (
            <DropdownMenuItem className="hover:cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>
                {userType === "ARTIST"
                  ? "Artist Panel"
                  : userType === "ADMIN" && "Admin Panel"}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Manage Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default UserNav;
