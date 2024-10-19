import React, { ReactNode } from "react";
import { AuthContextProvider } from "./AuthContext";
import StoreProvider from "@/lib/redux/StoreProvider";

const AllContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthContextProvider>
  );
};

export default AllContextProvider;
