import { Store } from "redux";
import { EventObject, Interpreter, State } from "xstate";

export const createXStateSlice = <
  TContext,
  TEvent extends EventObject,
  TSelectedState,
>(
  service: Interpreter<TContext, any, TEvent>,
  getState: (state: State<TContext, TEvent>) => TSelectedState,
) => {
  /**
   * A reducer which you can use directly in Redux
   */
  const reducer = (
    _state: TSelectedState | undefined,
    event: TEvent,
  ): TSelectedState => {
    service.send(event);
    return getState(service.state);
  };

  /**
   * A function that allows the store to keep up to date
   * with changes in the running XState service
   */
  const subscribe = (store: Store) => {
    const { unsubscribe } = service.subscribe((state) => {
      if (state.changed) {
        try {
          store.dispatch({
            type: `__UPDATE_${state._sessionid}`,
            state: getState(state),
          });
        } catch (e) {
          /**
           * Uncomment this line and press 'decrement' to see
           * an error that I'd love feedback on. What am I
           * doing to cause this, and how can I mitigate it?
           */
          console.log(e);
        }
      }
    });
    return unsubscribe;
  };

  /**
   * TODO - potentially add action creators in here
   * to give it feature parity with redux-toolkit
   */
  return {
    reducer,
    subscribe,
  };
};
