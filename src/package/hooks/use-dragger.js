import { ref } from 'vue'
import { emitter, events } from '../helpers/events'
import { isFunction } from 'element-plus/es/utils/types.mjs'

export function useDragger(modelValue, containerRef, editorConfigInject) {
	const curEvt = ref(null)
	const curComponent = ref(null)

	const handleDragEnter = e => {
		e.dataTransfer.dropEffect = 'move' // 设置拖拽效果
	}
	const handleDragOver = e => {
		e.preventDefault() // 阻止默认行为，防止无法触发 drop
	}
	const handleDragLeave = e => {
		e.dataTransfer.dropEffect = 'none' // 设置拖拽效果
	}
	const handleDrop = e => {
		// 添加一个渲染组件
		const blocks = modelValue.value.blocks
		const block = {
			type: curComponent.value.type,
			x: e.offsetX,
			y: e.offsetY,
			width: curComponent.value.width,
			height: curComponent.value.height,
			zIndex: 1,
			alignCenter: true,
			props: initProps(curComponent.value.type, editorConfigInject)
		}
		blocks.push(block)
		const data = { ...modelValue.value, blocks }

		modelValue.value = data

		emitter.emit(events.DRAG_END)
	}

	const handleDragEnd = e => {
		reset()
		containerRef.value.removeEventListener('dragenter', handleDragEnter)
		containerRef.value.removeEventListener('dragover', handleDragOver)
		containerRef.value.removeEventListener('dragleave', handleDragLeave)
		containerRef.value.removeEventListener('drop', handleDrop)
	}

	const handleDragStart = (e, comp) => {
		curEvt.value = e
		curComponent.value = comp
		setTargetStyle()
		// 添加移动的标识
		containerRef.value.addEventListener('dragenter', handleDragEnter)
		// 经过时阻止默认行为
		containerRef.value.addEventListener('dragover', handleDragOver)
		// 离开时增加一个禁用标识
		containerRef.value.addEventListener('dragleave', handleDragLeave)
		// drop 松开，根据拖拽的组件生成一个组件
		containerRef.value.addEventListener('drop', handleDrop)

		emitter.emit(events.DRAG_START)
	}

	function reset() {
		curEvt.value && resetTargetStyle()
		curEvt.value = null
		curComponent.value = null
	}

	function setTargetStyle() {
		curEvt.value.target.classList.add('dragging')
	}

	function resetTargetStyle() {
		curEvt.value.target.classList.remove('dragging')
	}

	return {
		handleDragStart,
		handleDragEnd
	}
}

function initProps(type, editorConfigInject) {
	const _props = {}
	const p = editorConfigInject.componentMap[type].props
	for (const key in p) {
		_props[key] = isFunction(p[key].initValue) ? p[key].initValue() : p[key].initValue ?? ''
	}
	return _props
}
