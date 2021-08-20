import { Middleware } from "redux";
import { XStateSlice } from "./createXStateSlice";

/**
 * Creates a middleware which can interface between
 * XState and Redux
 */
export const createXStateMiddleware = (
  ...slices: XStateSlice[]
): Middleware => {
  return function exampleMiddleware(storeAPI) {
    const services = slices.map((slice) => slice._start(storeAPI));

    return function wrapDispatch(next) {
      return function handleAction(action) {
        next(action);
        services.forEach((service) => {
          service.send(action);
        });
      };
    };
  };
};
