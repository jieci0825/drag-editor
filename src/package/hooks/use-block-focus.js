import { computed, ref } from 'vue'

export function useBlockFocus(modelValue, { callback, isPreview }) {
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
		if (isPreview.value) return

		// e.preventDefault()
		e.stopPropagation() // 阻止冒泡到画布导致取消选中

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
		if (isPreview.value) return
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
