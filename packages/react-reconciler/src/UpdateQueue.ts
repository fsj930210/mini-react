import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}
// 创建更新
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};
// 创建更新队列
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};
// 往更新队列里添加新的更新
export const enqueueUpdate = <State>(updateQueue: UpdateQueue<State>, update: Update<State>) => {
	updateQueue.shared.pending = update;
};
// 消费更新队列
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): {
	memoziedState: State;
} => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoziedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState=1 update=(x)=> 2x -> memoziedState=2x
			result.memoziedState = action(baseState);
		} else {
			// baseState=1 update=2 -> memoziedState=2
			result.memoziedState = baseState;
		}
	}
	return result;
};
