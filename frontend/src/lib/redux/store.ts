import { configureStore } from "@reduxjs/toolkit";
//This function is part of Redux Toolkit and simplifies the store setup process. It automatically sets up the Redux DevTools and middleware like Redux Thunk for async actions.
import cartReducer from "./slices/cartSlice";

export const makeStore = () =>
  configureStore({
    // You specify the different slices (reducers) that will be combined into the root reducer. In this example, we have a cartReducer imported from cartSlice.ts.
    reducer: {
      cart: cartReducer,
    },
  });

//It exports types like AppStore, RootState, and AppDispatch, which are useful for typing your Redux hooks and ensuring type safety throughout the application.
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

//It sets up the root reducer and allows you to define the initial state and any middleware you might want to use.
