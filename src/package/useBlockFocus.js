import { computed } from 'vue'

export function useBlockFocus(modelValue) {
	// 选中的block
	const focusData = computed(() => {
		const focus = modelValue.value.blocks.filter(block => block.focus)
		const unfocus = modelValue.value.blocks.filter(block => !block.focus)
		return {
			focus,
			unfocus
		}
	})

	// 获取选中的block
	const handleBlockMouseDown = (e, blockRef, block) => {
		e.preventDefault()
		e.stopPropagation()

		if (e.shiftKey) {
			block.focus = !block.focus
		} else {
			clearBlockFocus()
			if (!block.focus) {
				block.focus = true
			} else {
				block.focus = false
			}
		}
	}

	// 画布点击
	const handleCanvasMouseDown = e => {
		e.preventDefault()
		e.stopPropagation()
		clearBlockFocus()
	}

	function clearBlockFocus() {
		modelValue.value.blocks.forEach(block => {
			block.focus = false
		})
	}

	return {
		handleBlockMouseDown,
		handleCanvasMouseDown,
		focusData
	}
}
