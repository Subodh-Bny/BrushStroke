import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import { requestError } from "./apiError";
import toast from "react-hot-toast";

export const useGetArtists = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<User[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.users + "artists");
        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<User[]>> =
          await axiosInstance.get<ApiResponse>(endPoints.users);
        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

interface UpdateUser extends SignupUser {
  _id?: string;
}
export const useUpdateUser = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: UpdateUser) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.put<ApiResponse>(
            endPoints.users + data._id,
            data
          );
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onSuccess && onSuccess();
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useAddUser = ({
  reset,
  onSuccess,
}: {
  reset: () => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: SignupUser) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.signup, data);
        toast.success("User added");
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["users"] });
        reset();
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["users"],
    mutationFn: async (userId: string) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.delete<ApiResponse>(endPoints.users + userId);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(response.data.message);
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
