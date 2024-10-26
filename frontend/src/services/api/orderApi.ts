import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";

// import { useEsewaPayment } from "./payment/esewaApi";

export const useCreateOrder = () => {
  return useMutation({
    mutationKey: ["order"],
    mutationFn: async ({ data }: { data: Order }) => {
      try {
        const response: AxiosResponse<QueryResponse<OrderData>> =
          await axiosInstance.post<ApiResponse>(endPoints.order, data);

        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useCreateOrderEsewa = () => {
  return useMutation<Order | undefined, AxiosError<ApiResponse>, Order>({
    mutationKey: ["order"],
    mutationFn: async (data: Order): Promise<Order | undefined> => {
      try {
        const response: AxiosResponse<QueryResponse<OrderData>> =
          await axiosInstance.post<ApiResponse>(endPoints.order, data);
        const order = response.data?.data?.order;

        return order;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useGetOrderByUserId = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Order[]>> =
          await axiosInstance.get<ApiResponse>(
            endPoints.getOrderByUserId + userId
          );
        // console.log(response.data);
        return response.data?.data || [];
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Order[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.order);
        // console.log(response.data);
        return response.data?.data || [];
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
