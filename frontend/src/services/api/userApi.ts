import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";

export const useGetArtists = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<User[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.getArtists);
        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};
