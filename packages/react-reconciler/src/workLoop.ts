// 完整的工作循环

import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

// 全局指针 指向正在工作的fiberNode
let workInProgress: FiberNode | null = null;

// 初始化
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}
// 调度更新
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root as FiberRootNode);
}
// 从传入的fiber向上遍历到直到root
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}
function renderRoot(root: FiberRootNode) {
	// 初始化 让workInProgress指向第一个fiberNode
	prepareFreshStack(root);
	// 递归
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
	// 完成后更新finishedWork为当前的wip树，后续这颗树会作为current树
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	// wip fiberNode树 树中的flags
	// commitRoot(root);
}
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// next 可能是其子fiber或者为null 若为null则其没有子fiber
	const next = beginWork(fiber);
	// 执行完成后将pendingProps赋值给memoizedProps
	fiber.memoizedProps = fiber.pendingProps;
	// 等于null该fiber遍历完成实现递归中的归遍历兄弟节点
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		// 反之继续递归
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		const sibling = completeWork(fiber);
		// 如果还有兄弟节点则继续递归遍历
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 如果没有则返回父节点
		node = node.return;
		workInProgress = node;
	} while (node);
}
