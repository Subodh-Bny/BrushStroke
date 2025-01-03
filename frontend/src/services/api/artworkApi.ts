import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useGetArtworkById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["artworks", id],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Artwork>> =
          await axiosInstance.get<ApiResponse>(endPoints.artwork + id);
        return response?.data.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};
export const useGetArtworkByCategory = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  return useQuery({
    queryKey: ["artworks", categoryId],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Artwork[]>> =
          await axiosInstance.get<ApiResponse>(
            `${endPoints.artwork}category/${categoryId}`
          );
        return response.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["artworks"],
    mutationFn: async (data: Partial<Artwork>) => {
      try {
        const response: AxiosResponse<QueryResponse> = await axiosInstance.put(
          endPoints.artwork + data._id,
          data
        );
        toast.success(response.data?.message);
        queryClient.invalidateQueries({ queryKey: ["artworks"] });
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["artworks"],
    mutationFn: async (id: string) => {
      try {
        const response: AxiosResponse<QueryResponse> =
          await axiosInstance.delete(endPoints.artwork + id);
        toast.success(response.data?.message);
        queryClient.invalidateQueries({ queryKey: ["artworks"] });
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useGetFeaturedArtwork = () => {
  return useQuery({
    queryKey: ["featured-artwork"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<QueryResponse<Artwork>> =
          await axiosInstance.get<ApiResponse>(
            endPoints.featuredArtwork + "get"
          );
        return response?.data?.data;
      } catch (error) {
        requestError(error as AxiosError<ApiResponse>);
      }
    },
  });
};

export const useToggleFeaturedArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["featured-artworks"],
    mutationFn: async (artworkId: string) => {
      const response: AxiosResponse<QueryResponse<Artwork>> =
        await axiosInstance.patch(
          `${endPoints.featuredArtwork}${artworkId}/toggle-featured`
        );
      return response.data?.data;
    },
    onMutate: async (artworkId) => {
      await queryClient.cancelQueries({ queryKey: ["artworks"] });

      const previousArtworks =
        queryClient.getQueryData<Artwork[]>(["artworks"]) || [];

      // Optimistically set the selected artwork as featured and unfeature others
      queryClient.setQueryData<Artwork[]>(
        ["artworks"],
        previousArtworks.map((artwork) =>
          artwork._id === artworkId
            ? { ...artwork, isFeatured: !artwork.isFeatured }
            : { ...artwork, isFeatured: false }
        )
      );

      return { previousArtworks };
    },
    onError: (error, artworkId, context) => {
      if (context?.previousArtworks) {
        queryClient.setQueryData(["artworks"], context.previousArtworks);
      }
    },
  });
};
