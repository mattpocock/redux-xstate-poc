import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

counterSlice.subscribe(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
