"use client";
import React, { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 mt-16">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } pt-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out relative`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-5 top-[30%] z-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <nav className="space-y-2 p-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Dashboard</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingCart className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Orders</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Package className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Artworks</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Users</span>}
          </Button>
        </nav>
      </aside>
      {children}
    </div>
  );
};

export default Layout;
