import { assign, createMachine, interpret, sendParent } from "xstate";
import { createXStateSlice } from "./createXStateSlice";

/**
 * Create a machine in the normal XState way, using
 * any feature you like
 */
const counterMachine = createMachine<{ count: number }>({
  context: {
    count: 1,
  },
  on: {
    increment: {
      actions: assign((context, event) => {
        return {
          count: context.count + 1,
        };
      }),
    },
    decrement: {
      actions: [
        assign((context, event) => {
          return {
            count: context.count - 1,
          };
        }),
      ],
    },
  },
  invoke: {
    src: () => (sendBack) => {
      setInterval(() => {
        sendBack({
          type: "decrement",
        });
      }, 1000);
    },
  },
});

export const counterSlice = createXStateSlice({
  // Pass in a unique, descriptive name for the slice
  name: "counter",
  // Pass in the machine
  machine: counterMachine,
  /**
   * Get the state we want to pass from the machine
   * to Redux.
   */
  getSelectedState: (state) => {
    return {
      count: state.context.count,
    };
  },
});
