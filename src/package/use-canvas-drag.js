import { ref } from 'vue'

export function useCanvasDrag(focusData) {
	// 获取焦点后实现拖拽
	const dragState = ref({
		isDrag: false,
		startX: 0, // 鼠标按下的x坐标
		startY: 0, // 鼠标按下的y坐标
		blockStartPos: []
	})
	function handleMouseDown(e) {
		dragState.value.isDrag = true
		dragState.value.startX = e.clientX
		dragState.value.startY = e.clientY
		dragState.value.blockStartPos = focusData.value.focus.map(({ x, y }) => {
			return { x, y }
		})
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseMove(e) {
		// 获取鼠标移动的坐标
		const moveX = e.clientX - dragState.value.startX
		const moveY = e.clientY - dragState.value.startY

		// 处理block的坐标
		focusData.value.focus.forEach((block, idx) => {
			block.x = dragState.value.blockStartPos[idx].x + moveX
			block.y = dragState.value.blockStartPos[idx].y + moveY
		})
	}

	function handleMouseUp(e) {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	return {
		handleMouseDown
	}
}
