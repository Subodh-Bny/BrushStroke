import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],
    mutationFn: async (data: Category) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.createCategory, data);
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["category"] });
      } catch (error) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Category[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.getAllCategories);

        const categories: Category[] = response.data.data as Category[];
        return categories;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};
