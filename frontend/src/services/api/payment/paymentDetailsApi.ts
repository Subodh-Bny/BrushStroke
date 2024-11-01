import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["payment-details"],
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.put<ApiResponse>(
            `${endPoints.updatePaymentStatus}${orderId}/${status}`
          );
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        return response.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
