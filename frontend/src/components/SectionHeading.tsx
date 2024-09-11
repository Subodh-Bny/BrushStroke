import React, { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-3xl font-bold mb-8 text-center">{children}</h1>;
};

export default Header;
