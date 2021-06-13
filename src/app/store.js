import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

// GLOBAL store
export const store = configureStore({
  reducer: {
    basket: basketReducer,
  },
});
