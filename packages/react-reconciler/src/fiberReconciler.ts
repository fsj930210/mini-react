import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './UpdateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container: Container) {
	// 根DOM fiber
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// 全局根FiberRoot
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
	const hostRootFiber = root.current;
	// ReactDOM.createRoot(root).render(<App />)
	// element 就是 <App /> 组件的ReactElemrntType
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>, update);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
