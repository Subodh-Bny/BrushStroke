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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],

    mutationFn: async (data: Partial<Category>) => {
      try {
        const categoryId = data._id;
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.put<ApiResponse>(
            endPoints.updateCategory + categoryId,
            data
          );
        toast.success("Category updated.");
        queryClient.invalidateQueries({ queryKey: ["category"] });

        return response.data.data || {};
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],

    mutationFn: async (categoryId: string) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.delete<ApiResponse>(
            endPoints.deleteCategory + categoryId
          );
        queryClient.invalidateQueries({ queryKey: ["category"] });
        toast.success("Category deleted.");
        return response.data.data || {};
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};
