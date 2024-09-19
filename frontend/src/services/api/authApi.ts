import axiosInstance from "../axoisInstance";
import { useMutation } from "@tanstack/react-query";
import endPoints from "../endPoints";
import axios, { AxiosResponse, AxiosError } from "axios";
import toast from "react-hot-toast";

export const useSignup = ({ reset }: { reset: () => void }) => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: SignupUser) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.signup, data);
        toast.success(response.data.message);
        reset();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiResponse>;
          if (axiosError.response && axiosError.response.data) {
            const errorMessage = axiosError.response.data.message;
            toast.error(errorMessage);
          } else {
            toast.error("An unknown error occurred. Please try again.");
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    },
  });
};
