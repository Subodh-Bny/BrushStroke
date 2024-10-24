import axiosInstance from "@/services/axiosInstance";
import endPoints from "@/services/endPoints";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { requestError } from "../apiError";

// export const useEsewaPayment = () => {
//   return useMutation({
//     mutationFn: async (data: EsewaPayment) => {
//       try {
//         const response = await axiosInstance.post(endPoints.esewaPayment, data);
//         //   const { pidx, payment_url: paymentUrl } = response.data;
//         //   console.log(data);
//         //   console.log(paymentUrl);
//         // window.location.href = paymentUrl;
//         //   console.log(pidx);
//         console.log(response);
//       } catch (error) {
//         requestError(error as AxiosError<ApiResponse, unknown>);
//       }
//     },
//   });
// };

export const useCreateSignature = () => {
  return useMutation({
    mutationKey: ["esewa-signature"],
    mutationFn: async (paymentData: EsewaPayment) => {
      const response = await axiosInstance.post(endPoints.generateSignature, {
        ...paymentData,
      });

      return response.data.signature;
    },
    onError: (error) => {
      requestError(error as AxiosError<ApiResponse, unknown>);
    },
  });
};
