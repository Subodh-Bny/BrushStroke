import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";
import toast from "react-hot-toast";

export const useAddArtwork = ({ reset }: { reset: () => void }) => {
  return useMutation({
    mutationKey: ["artworks"],
    mutationFn: async (data: Artwork) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.artwork, data);
        toast.success(response.data.message);
        reset();
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useGetArtworks = () => {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Artwork[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.artwork);
        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};
