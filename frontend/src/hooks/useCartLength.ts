import { useAppSelector } from "@/lib/redux/hooks";

export const useCartLength = () => {
  return useAppSelector((state) => state.cart.items.length);
};
