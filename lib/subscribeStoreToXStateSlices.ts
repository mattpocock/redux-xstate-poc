import { Store } from "redux";

export type Slice = {
  subscribe: (store: Store) => () => void;
};

/**
 * Used to register the services with the
 * store in order to update the store when
 * the services change
 */
export const subscribeStoreToXStateSlices = (
  store: Store,
  ...slices: Slice[]
) => {
  for (const slice of slices) {
    slice.subscribe(store);
  }
};
