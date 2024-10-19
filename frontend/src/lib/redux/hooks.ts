import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import type { RootState, AppDispatch, AppStore } from "@/lib/redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

//This file provides typed versions of the useDispatch, useSelector, and useStore hooks from React-Redux. These hooks are essential for accessing the Redux store and dispatching actions while maintaining TypeScript type safety.
