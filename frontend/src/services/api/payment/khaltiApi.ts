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
        if (pidx === "undefined" || !pidx) {
          toast.error("Purchase incomplete");
          router.push(routes.orders);
          return;
        }

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
              router.push(routes.orders);
              break;
            case "Pending":
              toast.error("Payment is currently pending.");
              router.push(routes.orders);
              break;
            case "Expired":
              toast.error("Payment has expired.");
              router.push(routes.orders);
              break;
            case "User canceled":
              toast.error("Payment was canceled by the user.");
              router.push(routes.orders);
              break;
            case "Refunded":
              toast.success("Payment has been refunded.");
              router.push(routes.orders);
              break;
            case "Partially Refunded":
              toast.error("Payment has been partially refunded.");
              router.push(routes.orders);
              break;
            default:
              toast.error("Unknown payment status.");
              router.push(routes.orders);
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
