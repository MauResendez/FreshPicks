import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "../features/order-slice";

export const store = configureStore({
  reducer: {
    order: orderReducer
  }
});