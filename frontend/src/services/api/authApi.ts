/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "../axiosInstance";
import { useMutation } from "@tanstack/react-query";
import endPoints from "../endPoints";
import axios, { AxiosResponse, AxiosError } from "axios";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import { requestError } from "./apiError";

export const useSignup = ({ reset }: { reset: () => void }) => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: SignupUser) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.signup, data);
        toast.success(response.data.message);
        router.push(routes.auth.login);
        reset();
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

type LoginResponse = {
  success: boolean;
  message: string;
  data?: User;
  token?: string;
};
export const useLogin = ({
  reset,
  setUser,
  setIsLoggedIn,
  setToken,
  onSuccess,
}: {
  reset: () => void;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}) => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: LoginUser) => {
      try {
        const response: AxiosResponse<LoginResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.login, data);
        toast.success(response.data.message);
        console.log(response.data);

        const user: User | undefined = response.data.data;
        const token: string | undefined = response.data.token;
        if (user) {
          Cookies.set("user", JSON.stringify(user), { sameSite: "Lax" });
          setUser(user);
        }
        if (token) {
          // Cookies.set("jwt", token, { sameSite: "Lax" });
          setToken(token);
          // NextResponse.redirect(new URL(routes.landing.home));
        }

        user && token && setIsLoggedIn(true);

        reset();
        onSuccess();
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
