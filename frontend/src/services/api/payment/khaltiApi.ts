import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestError } from "../apiError";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";

export const useKhaltiInitiate = () => {
  return useMutation({
    mutationFn: async (data: KhaltiInitiate) => {
      try {
        const response = await axiosInstance.post(
          endPoints.khaltiInitiate,
          data
        );
        const { payment_url: paymentUrl } = response.data;

        window.location.href = paymentUrl;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useVerifyKhalti = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pidx,
      orderId,
    }: {
      pidx: string;
      orderId: string;
    }) => {
      try {
        const response = await axiosInstance.post(endPoints.verifyKhalti, {
          pidx,
          purchase_order_id: orderId,
        });

        const paymentDetails: PaymentDetails =
          response.data?.order?.paymentDetails;

        if (paymentDetails) {
          switch (paymentDetails.status) {
            case "Completed":
              toast.success("Payment completed successfully.");
              router.push(routes.cart);
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
