import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="lg:w-1/2 w-full flex flex-col gap-6  px-3 justify-around">
      <h1 className="text-red-500 font-medium text-3xl">
        Login to your Account
      </h1>
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Enter your Email" type="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Enter your password" type="email" />
        </div>
        <Button className="bg-red-500 hover:bg-red-600 font-semibold">
          Login
        </Button>
      </form>
      <div className="flex justify-between flex-col md:flex-row gap-2">
        <Link href={"#"} className="hover:underline">
          Forgot password ?
        </Link>
        <Link href={"#"} className="hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
