"use client";
import React, { useContext } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import routes from "@/config/routes";
import { useLogin } from "@/services/api/authApi";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { setUser, setIsLoggedIn, setToken } = useContext(AuthContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUser>();
  const { mutate: loginMutate, isPending: loginPending } = useLogin({
    reset,
    setUser,
    setIsLoggedIn,
    setToken,
    onSuccess: () => {
      router.push(routes.landing.home);
    },
  });
  const loginSubmit: SubmitHandler<LoginUser> = (data) => {
    loginMutate(data);
  };

  return (
    <div className="lg:w-1/2 w-full flex flex-col gap-6  px-3 justify-around">
      <h1 className="text-red-500 font-medium text-3xl">
        Login to your Account
      </h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(loginSubmit)}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your Email"
            type="email"
            {...register("email", { required: "Enter your email" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            {...register("password", { required: "Enter your pasword" })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </span>
          )}
        </div>
        <Button
          className="bg-red-500 hover:bg-red-600 font-semibold"
          disabled={loginPending}
        >
          {loginPending ? <ClipLoader size={20} color="white" /> : "Login"}
        </Button>
      </form>
      <div className="flex justify-between flex-col md:flex-row gap-2">
        <Link href={"#"} className="hover:underline">
          Forgot password ?
        </Link>
        <Link href={routes.auth.signup} className="hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
