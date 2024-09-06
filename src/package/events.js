import mitt from 'mitt'

export const events = {
	DRAG_START: 'drag_start', // 拖拽开始事件
	DRAG_END: 'drag_end', // 拖拽结束事件
	DROP: 'drop' // 拖拽生成控件事件
}

export const emitter = mitt()
