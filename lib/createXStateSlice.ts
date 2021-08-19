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
  const reducer = (
    _state: TSelectedState | undefined,
    event: TEvent,
  ): TSelectedState => {
    service.send(event);
    return getState(service.state);
  };

  const subscribe = (store: Store) => {
    const { unsubscribe } = service.subscribe((state) => {
      if (state.changed) {
        try {
          store.dispatch({
            type: `__UPDATE_${state._sessionid}`,
          });
        } catch (e) {}
      }
    });
    return unsubscribe;
  };

  return {
    reducer,
    subscribe,
  };
};
