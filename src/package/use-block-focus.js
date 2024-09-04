import { computed } from 'vue'

export function useBlockFocus(modelValue, { callback }) {
	// 选中的block
	const focusData = computed(() => {
		const focus = modelValue.value.blocks.filter(block => block.focus)
		const unfocus = modelValue.value.blocks.filter(block => !block.focus)
		return {
			focus,
			unfocus
		}
	})

	const handleBlockMouseDown = (e, blockRef, block) => {
		e.preventDefault()
		e.stopPropagation()

		if (!block.focus) {
			if (!e.shiftKey) {
				clearBlockFocus()
			}
			block.focus = true
		}
		callback && callback(e)
	}

	function clearBlockFocus() {
		modelValue.value.blocks.forEach(block => {
			block.focus = false
		})
	}

	// 画布点击
	const handleCanvasMouseDown = e => {
		e.preventDefault()
		e.stopPropagation()
		clearBlockFocus()
	}

	return {
		handleBlockMouseDown,
		handleCanvasMouseDown,
		focusData
	}
}
