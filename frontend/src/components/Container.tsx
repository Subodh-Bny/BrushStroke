import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section className={cn("container mx-auto px-8 py-16", className)}>
      {children}
    </section>
  );
};

export default Container;
