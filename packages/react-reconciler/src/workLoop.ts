// 完整的工作循环

import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNoe } from './fiber';

// 全局指针 指向正在工作的fiberNode
let workInProgress: FiberNoe | null = null;

// 初始化
function prepareFreshStack(fiber: FiberNoe) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNoe) {
	// 初始化 让workInProgress指向第一个fiberNode
	prepareFreshStack(root);
	// 递归
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop发生错误', e);
			workInProgress = null;
		}
	} while (true);
}
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNoe) {
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

function completeUnitOfWork(fiber: FiberNoe) {
	let node: FiberNoe | null = fiber;
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
