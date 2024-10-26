import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Cart = { userId: "", items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Artwork>) {
      const itemExists = state.items.find(
        (item) => item.artwork._id === action.payload._id
      );

      if (!itemExists) {
        state.items.push({ artwork: action.payload, quantity: 1 });
      }
    },
    // action to initialize cart with fetched data
    setCart(state, action: PayloadAction<Cart>) {
      return action.payload; // Replacing the state with the fetched cart items
    },

    //remove item
    removeItem(state, action: PayloadAction<string>) {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.artwork._id !== action.payload
        ),
      };
    },
  },
});

export const { addToCart, setCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
