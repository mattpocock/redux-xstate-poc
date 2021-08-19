import { assign, createMachine, interpret } from "xstate";
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
        () => {
          console.log("DECREMENT");
        },
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
  interpret(counterMachine).start(),
  (state) => {
    return {
      count: state.context.count,
    };
  },
);
