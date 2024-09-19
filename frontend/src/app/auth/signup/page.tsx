"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignup } from "@/services/api/authApi";
import ClipLoader from "react-spinners/ClipLoader";
import routes from "@/config/routes";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignupUser>();
  const { mutate, isPending: signupPending } = useSignup({ reset });

  const signupSubmitHandler: SubmitHandler<SignupUser> = (data) => {
    mutate(data);
  };

  return (
    <div className="lg:w-1/2 w-full flex flex-col gap-6  lg:px-4 justify-around">
      <h1 className="text-red-500 font-medium text-3xl">Create an Account</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(signupSubmitHandler)}
      >
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="John Doe"
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: 2,
            })}
          />
          {errors.username && (
            <span className="text-red-500 text-sm mt-1">
              {errors.username.type === "minLength"
                ? "Username should contain at least 2 letters"
                : errors.username?.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="example@email.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter valid email",
              },
            })}
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
            placeholder="Create Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">
              {errors.password.type === "minLength"
                ? "Password should contain at least 6 characters"
                : errors.password?.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            placeholder="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Passwords do not match",
              validate: (val: string) => {
                console.log(val);
                if (watch("password") !== val) {
                  return "Your passwords do no match";
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mt-1">
              {errors.confirmPassword?.message}
            </span>
          )}
        </div>
        <Button
          className="bg-red-500 hover:bg-red-600 font-semibold"
          disabled={signupPending}
        >
          {signupPending ? <ClipLoader size={20} color="white" /> : "Signup"}
        </Button>
      </form>
      <div className="flex justify-between ">
        <Link href={"#"} className="hover:underline">
          Forgot password ?
        </Link>
        <Link href={routes.auth.login} className="hover:underline">
          Login Instead
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
