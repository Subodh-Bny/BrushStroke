import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { requestError } from "./apiError";
import { AxiosError, AxiosResponse } from "axios";

export const useGetAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.get<ApiResponse>(endPoints.analytics);
        return response.data?.data;
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
