import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "../apiError";

export const useGetPaymentDetails = () => {
  return useQuery({
    queryKey: ["payment-details"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<PaymentDetails[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.getPaymentDetails);
        return response?.data?.data;
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
