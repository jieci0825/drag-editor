import { computed, ref } from 'vue'

export function useBlockFocus(modelValue, { callback, preview }) {
	// 当前选中的block的index -1表示没有选中
	const curSelectIndex = ref(-1)

	// 当前选中的block，也就是最后最一个被选中的block
	const lastSelectBlock = computed(() => {
		return modelValue.value.blocks[curSelectIndex.value]
	})

	// 选中的block
	const focusData = computed(() => {
		const focus = modelValue.value.blocks.filter(block => block.focus)
		const unfocus = modelValue.value.blocks.filter(block => !block.focus)
		return {
			focus,
			unfocus
		}
	})

	const handleBlockMouseDown = (e, blockRef, block, index) => {
		if (preview.value) return

		e.preventDefault()
		e.stopPropagation()

		if (!block.focus) {
			if (!e.shiftKey) {
				clearBlockFocus()
			}
			block.focus = true
		}
		curSelectIndex.value = index
		callback && callback(e)
	}

	function clearBlockFocus() {
		modelValue.value.blocks.forEach(block => {
			block.focus = false
		})
	}

	// 画布点击
	const handleCanvasMouseDown = e => {
		if (preview.value) return

		e.preventDefault()
		e.stopPropagation()
		curSelectIndex.value = -1
		clearBlockFocus()
	}

	return {
		handleBlockMouseDown,
		handleCanvasMouseDown,
		focusData,
		lastSelectBlock,
		clearBlockFocus
	}
}
