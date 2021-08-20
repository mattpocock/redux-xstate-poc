import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { createXStateMiddleware } from "./createXStateMiddleware";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
  middleware: [createXStateMiddleware(counterSlice)],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
