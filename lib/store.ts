import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { subscribeStoreToXStateSlices } from "./subscribeStoreToXStateSlices";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

/**
 * You must add all XState slices to this list
 * in order for the store to be subscribed to its
 * internal updates
 */
subscribeStoreToXStateSlices(store, counterSlice);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
