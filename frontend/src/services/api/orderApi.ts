import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";
import { useKhaltiInitiate } from "./khalti/khaltiApi";
import routes from "@/config/routes";

interface OrderData {
  user: User;
  order: Order;
}
export const useCreateOrder = () => {
  const { mutate: khaltiInitiate } = useKhaltiInitiate();
  return useMutation({
    mutationKey: ["order"],
    mutationFn: async (data: Order) => {
      try {
        const response: AxiosResponse<QueryResponse<OrderData>> =
          await axiosInstance.post<ApiResponse>(endPoints.order, data);
        const order = response.data?.data?.order;
        const user = response.data.data?.user;
        if (order && user) {
          khaltiInitiate({
            returnUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.khaltiReturn,
            websiteUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.landing.home,
            amount: order?.totalPrice || 0,
            purchaseOrderId: order?._id || "",
            purchaseOrderName: "Artwork order",
            customerInfo: {
              name: "Subodh Adhikari",
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
