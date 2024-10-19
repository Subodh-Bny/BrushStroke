import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import endPoints from "../endPoints";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { requestError } from "./apiError";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart, removeItem, setCart } from "@/lib/redux/slices/cartSlice";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAddToCart = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationKey: ["cart"],
    mutationFn: async (artwork: Artwork) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.post<ApiResponse>(endPoints.cart, {
            artworkId: artwork._id,
          });
        dispatch(addToCart(artwork));
        toast.success(response.data.message);
        return response.data?.data || {};
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};

export const useGetCart = () => {
  const dispatch = useAppDispatch();
  const auth = useContext(AuthContext);
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Cart>> =
          await axiosInstance.get<ApiResponse>(endPoints.cart);
        // console.log(response.data);
        console.log("api", response.data?.data?.items);
        dispatch(setCart(response.data?.data?.items || []));
        return response.data?.data || {};
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
    enabled: auth.isLoggedIn,
  });
};

export const useRemoveCartItem = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationKey: ["cart"],
    mutationFn: async (artworkId: string) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.delete<ApiResponse>(endPoints.cart + artworkId);
        dispatch(removeItem(artworkId));
        return response.data?.data || {};
      } catch (error: unknown) {
        requestError(error as AxiosError<ApiResponse, unknown>);
      }
    },
  });
};
