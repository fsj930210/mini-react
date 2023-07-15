import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNoe {
	tag: WorkTag;
	key: Key;
	stateNode: FiberNoe | null;
	type: any;

	return: FiberNoe | null;
	sibling: FiberNoe | null;
	child: FiberNoe | null;
	index: number;
	ref: Ref;

	pendingProps: Props | null;
	memoizedProps: Props | null;

	alternate: FiberNoe | null;
	flgs: Flags;
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
