import { assign, createMachine, interpret, sendParent } from "xstate";
import { createXStateSlice } from "./createXStateSlice";

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

export const counterSlice = createXStateSlice(
  "counter",
  counterMachine,
  (state) => {
    return {
      count: state.context.count,
    };
  },
);
