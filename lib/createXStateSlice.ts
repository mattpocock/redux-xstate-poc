import { MiddlewareAPI, Store } from 'redux';
import {
	AnyEventObject,
	EventObject,
	interpret,
	Interpreter,
	State,
	StateMachine,
} from 'xstate';

/**
 * A 'slice' (to use the Redux Toolkit terminology)
 * of state which provides a reducer, and the required
 * functionality to
 */
export type XStateSlice<
	TContext = any,
	TEvent extends EventObject = AnyEventObject,
	TSelectedState = any
> = {
	_start: (store: MiddlewareAPI) => Interpreter<TContext, any, TEvent>;
	getService: () => Interpreter<TContext, any, TEvent>;
	reducer: (
		state: TSelectedState | undefined,
		action: TEvent
	) => TSelectedState;
};

/**
 * Create a 'slice' which can convert an XState machine
 * into a reducer which can be used in Redux
 */
export const createXStateSlice = <
	TContext,
	TEvent extends EventObject,
	TSelectedState
>(params: {
	name: string;
	machine: StateMachine<TContext, any, TEvent>;
	getSelectedState: (state: State<TContext, TEvent>) => TSelectedState;
}): XStateSlice<TContext, TEvent, TSelectedState> => {
	const { name } = params;

	let service: Interpreter<TContext, any, TEvent> | undefined = undefined;

	const initialReduxState = params.getSelectedState(
		params.machine.initialState
	);

	const updateEvent = (state: TSelectedState) => ({
		type: `${name}.xstate.update`,
		state,
	});

	/**
	 * A reducer which you should pass to redux
	 */
	const reducer = (
		state: TSelectedState | undefined = initialReduxState,
		event: any
	): TSelectedState => {
		switch (event.type) {
			case `${name}.xstate.update`:
				return event.state;
			default:
				return state as TSelectedState;
		}
	};

	/**
	 * A function designed to be called by the middleware,
	 * which starts the machine and subscribes it to the store
	 *
	 * There's no need to call this yourself - the middleware
	 * will call it when the slice is passed in
	 */
	const start = (store: MiddlewareAPI) => {
		service = interpret(params.machine, {
			parent: {
				send: (event: any) => {
					store.dispatch(event);
				},
				getSnapshot: () => {
					return store.getState();
				},
			} as any,
		}).start();

		service.subscribe(state => {
			if (!state.changed) return;
			store.dispatch(updateEvent(params.getSelectedState(state)));
		});

		return service;
	};

	/**
	 * A getter for the running XState service
	 */
	const getService = () => {
		if (!service) {
			throw new Error(
				`getService was called on ${name} slice before slice.start() was called. slice.start() is usually called by the middleware.`
			);
		}
		return service;
	};

	return {
		_start: start,
		reducer,
		getService,
	};
};
