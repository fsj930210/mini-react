import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: FiberNode | FiberRootNode | null;
	type: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;

	pendingProps: Props | null;
	memoizedProps: Props | null;
	memoizedState: any;

	alternate: FiberNode | null;
	flgs: Flags;
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 作为实例用到的属性
		this.tag = tag;
		this.key = key;
		// HostComponent DOM节点
		this.stateNode = null;
		// 类型本身 如 FunctionComponent 则它是 () => {}
		this.type = null;

		// 构成树状结构
		// 父节点
		this.return = null;
		// 下一个节点
		this.sibling = null;
		// 子节点
		this.child = null;
		// 索引 如 <ul><li></li><li></li></ul> 中 li的索引
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		// 刚开始工作时的props
		this.pendingProps = pendingProps;
		// 工作完之后的props 确定的props
		this.memoizedProps = null;
		// 工作完之后的state 确定的state
		this.memoizedState = null;
		this.updateQueue = null;

		// 缓存的另一个fiberNode current 和 workInprogress之间切换
		// current -> 与视图中真实UI对应的fiberNode树
		// workInprogress -> 触发更新后，正在reconciler中计算的fiberNode树
		// 如果当前是current树，则alternate指向workInprogress树
		this.alternate = null;

		// 副作用
		// 对于同一个节点，比较其ReactElement与fiberNode，生成子fiberNode。
		// 并根据比较的结果生成不同标记（插入、删除、移动......），对应不同宿主环境API的执行
		this.flgs = NoFlags;
	}
}

// 全局唯一的根fiberNode
export class FiberRootNode {
	// 这个contanier是跟数组环境有关的，不能只设置为DOMElement
	container: Container;
	// 指向 hostRootFiber
	current: FiberNode;
	// 更新完成后指向的hostRootFiber
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flgs = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		// <div /> type: 'div
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
