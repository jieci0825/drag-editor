import mitt from 'mitt'

export const events = {
	DRAG_START: 'drag_start', // 拖拽开始事件
	DRAG_END: 'drag_end', // 拖拽结束事件
	IMPORT_JSON: 'import_json' // 导入json
}

export const emitter = mitt()
