"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUpdateUser } from "@/services/api/userApi";
import { SubmitHandler, useForm } from "react-hook-form";

const ManageProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm<SignupUser>();

  const userCookie = Cookies.get("user");
  const user: User | null = userCookie ? JSON.parse(userCookie) : null;

  const { mutate: userUpdate, isSuccess: updateSuccess } = useUpdateUser();

  useEffect(() => {
    setValue("username", user?.username || "");
    setValue("email", user?.email || "");
  }, [user]);

  const updateSubmitHandler: SubmitHandler<SignupUser> = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const updateData = {
      username: data.username || "",
      email: data.email || "",
      password: data.password || "",
      confirmPassword: data.confirmPassword || "",
      _id: user?._id,
    };

    userUpdate(updateData);
    if (updateSuccess) {
      setValue("password", "");
      setValue("confirmPassword", "");
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Your Profile</CardTitle>
        <CardDescription>
          Update your account information and settings.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(updateSubmitHandler)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register("username")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ManageProfile;
