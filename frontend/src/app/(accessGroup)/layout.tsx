import Footer from "@/components/layouts/Footer";
import TopNav from "@/components/layouts/TopNav";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <div>{children}</div>
      <Footer />
    </>
  );
}
