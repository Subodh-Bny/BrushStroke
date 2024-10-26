import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestError } from "../apiError";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import { useCreateOrder } from "../orderApi";

export const useInitiateKhalti = () => {
  return useMutation({
    mutationFn: async ({
      data,
      user,
    }: {
      data: Order;
      user: Partial<User | undefined>;
    }) => {
      try {
        const khaltiData = {
          returnUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.khaltiReturn,
          websiteUrl: process.env.NEXT_PUBLIC_HOMEURL + routes.landing.home,
          amount: data.totalPrice || 0,
          purchaseOrderId: data?.cartId || "",
          purchaseOrderName: "Artwork order",
          customerInfo: {
            name: user?.username || "",
            email: user?.email || "",
            phone: user?.phoneNumber || "",
          },
        };

        const response = await axiosInstance.post(
          endPoints.khaltiInitiate,
          khaltiData
        );
        const { payment_url: paymentUrl } = response.data;

        window.location.href = paymentUrl;

        // const response: AxiosResponse<QueryResponse<OrderData>> =
        //   await axiosInstance.post<ApiResponse>(endPoints.order, data);

        // return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useVerifyKhalti = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createOrder } = useCreateOrder();
  return useMutation({
    mutationFn: async ({
      pidx,
      purchaseOrderId,
      data,
      userId,
    }: {
      pidx: string;
      purchaseOrderId: string;
      data: Order;
      userId: string;
    }) => {
      try {
        const response = await axiosInstance.post(endPoints.verifyKhalti, {
          pidx,
          purchase_order_id: purchaseOrderId,
          userId: userId,
        });

        const paymentDetails: PaymentDetails =
          response.data?.order?.paymentDetails;

        if (paymentDetails) {
          switch (paymentDetails.status) {
            case "Completed":
              toast.success("Payment completed successfully.");
              router.push(routes.cart);
              createOrder({ data });
              break;
            case "Pending":
              toast.error("Payment is currently pending.");
              break;
            case "Expired":
              toast.error("Payment has expired.");
              break;
            case "User canceled":
              toast.error("Payment was canceled by the user.");
              break;
            case "Refunded":
              toast.success("Payment has been refunded.");
              break;
            case "Partially Refunded":
              toast.error("Payment has been partially refunded.");
              break;
            default:
              toast.error("Unknown payment status.");
          }
        }
        queryClient.invalidateQueries({ queryKey: ["cart"] });

        return response.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
