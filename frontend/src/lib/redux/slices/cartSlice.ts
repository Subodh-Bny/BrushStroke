import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Artwork>) {
      const itemExists = state.find(
        (item) => item.artwork._id === action.payload._id
      );

      if (!itemExists) {
        state.push({ artwork: action.payload, quantity: 1 });
      }
    },
    // action to initialize cart with fetched data
    setCart(state, action: PayloadAction<CartItem[]>) {
      return action.payload; // Replacing the state with the fetched cart items
    },

    //remove item
    removeItem(state, action: PayloadAction<string>) {
      return state.filter((item) => item.artwork._id !== action.payload);
    },
  },
});

export const { addToCart, setCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
