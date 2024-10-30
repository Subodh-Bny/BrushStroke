import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";
import { useKhaltiInitiate } from "./payment/khaltiApi";
import routes from "@/config/routes";
// import { useEsewaPayment } from "./payment/esewaApi";

interface OrderData {
  user: User;
  order: Order;
}
export const useCreateOrderKhalti = () => {
  const { mutate: khaltiInitiate } = useKhaltiInitiate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["order"],
    mutationFn: async (data: Order) => {
      try {
        const response: AxiosResponse<QueryResponse<OrderData>> =
          await axiosInstance.post<ApiResponse>(endPoints.order, data);
        const order = response.data?.data?.order;
        const user = response.data.data?.user;
        queryClient.invalidateQueries({ queryKey: ["order"] });
        if (order && user) {
          khaltiInitiate({
            returnUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.khaltiReturn,
            websiteUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.landing.home,
            amount: order?.totalPrice || 0,
            purchaseOrderId: order?._id || "",
            purchaseOrderName: "Artwork order",
            customerInfo: {
              name: user?.username,
              email: user?.email,
              phone: user?.phoneNumber || "",
            },
          });
        } else {
          throw new Error("Couldnot redirect you to payment");
        }

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
