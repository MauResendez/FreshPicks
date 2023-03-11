import { createSlice } from "@reduxjs/toolkit"

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    farmer: null,
    user: null
  },
  reducers: {
    addToOrder: (state, action) => {
      state.items = [...state.items, action.payload.product];
      state.farmer = action.payload.farmer;
      state.user = action.payload.user;
    },
    removeFromOrder: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      let newOrder = [...state.items];

      if (index >= 0) {
        newOrder.splice(index, 1);
      } else {
        console.warn(`Can"t remove product ${action.payload.id} as it's not in basket`);
      }

      state.items = newOrder;

      if (state.items.length == 0) {
        state.farmer = null;
      }
    },
    clearOrder: (state) => {
      state.items = [];
      state.farmer = null;
    }
  }
});

export const { addToOrder, removeFromOrder, clearOrder } = orderSlice.actions

export const selectOrderItems = (state) => state.order.items;

export const selectOrderItemsWithId = (state, id) => state.order.items.filter((item) => item.id === id);

export const selectOrderTotal = (state) => state.order.items.reduce((total, item) => {
  return total + item.price;
}, 0);

export const getOrderFarmer = (state) => state.order.farmer;

export const getOrderUser = (state) => state.order.user;

export default orderSlice.reducer