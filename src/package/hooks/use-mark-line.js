import { reactive } from 'vue'

export function useMarkLine() {
	// 辅助线坐标
	const markLine = reactive({
		x: null,
		y: null
	})

	const setMarkLine = (x, y) => {
		markLine.x = x
		markLine.y = y
	}

	const clearMarkLine = () => {
		markLine.x = null
		markLine.y = null
	}

	return {
		markLine,
		setMarkLine,
		clearMarkLine
	}
}
