export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

// 函数组件
export const FunctionComponent = 0;
// 项目挂载的根结点
export const HostRoot = 3;
// DOM节点
export const HostComponent = 5;
// DOM节点中的文本节点
export const HostText = 6;
