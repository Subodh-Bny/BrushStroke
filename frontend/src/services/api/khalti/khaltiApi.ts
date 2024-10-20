import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useMutation } from "@tanstack/react-query";
import { requestError } from "../apiError";
import { AxiosError } from "axios";

export const useKhaltiInitiate = () => {
  return useMutation({
    mutationFn: async (data: KhaltiInitiate) => {
      try {
        const response = await axiosInstance.post(
          endPoints.khaltiInitiate,
          data
        );
        const { pidx, payment_url: paymentUrl } = response.data;
        console.log(response.data);
        window.location.href = paymentUrl;
        console.log(pidx);
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
