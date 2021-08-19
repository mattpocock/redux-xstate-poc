import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

/**
 * TODO - add a function which allows you to subscribe multiple
 * slices to the store, or potentially find a way to do this
 * through middleware?
 */
counterSlice.subscribe(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
