import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffect = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;
	// 递归查找subtreeFlags 找到变更的节点
	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;
		// nextEffect节点的subtreeFlags包含了需要操作的节点 此时需要继续递归child找
		if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
			nextEffect = child;
		} else {
			// 向上遍历
			// 要么找到底了，要么是不包含subtreeFlags的节点 此时需要向上遍历找兄弟节点
			up: while (nextEffect !== null) {
				// 找到存在flags的节点
				commitMutationEffectOnFiber(nextEffect);
				const sibiling: FiberNode | null = nextEffect.sibling;
				if (sibiling !== null) {
					nextEffect = sibiling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flgs;
	// flags Placement
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		// 去除flags里面的Placement标记
		finishedWork.flgs &= ~Placement;
	}
	// flags Update
	// flags ChildDeletion
};

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	// 1. 找到父DOM
	const hostParent = getHostParent(finishedWork);
	// 2. 找到finishedWork对应的DOM节点 并挂载
	appendPlacementNodeIntoContainer(finishedWork, hostParent);
};
function getHostParent(fiber: FiberNode): Container {
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;
		// HostComponent HostRoot
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到host parent');
	}
	return null;
}
function appendPlacementNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
	// fiber host 找到后直接插入
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	// 没找到继续递归查找
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
