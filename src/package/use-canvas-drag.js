import { ref } from 'vue'
import { emitter, events } from './events'

/**
 * 生成辅助线
 * @param {array} unfocus 未选中的 block
 * @param {object} lastSelectBlock 最后选中的 block
 */
function genLines(unfocus, lastSelectBlock) {
	// 存储辅助线的位置
	//  - 横线的位置根据 y 轴来确定
	//  - 竖线的位置根据 x 轴来确定
	// - 拖动 b 控件，当 b 控件的顶部坐标与 a 控件的顶部坐标相等时，辅助线出现
	const lines = { x: [], y: [] }

	// 根据选中的block，计算没选中block辅助线的位置，循环所有未选中节点，计算出他们的辅助线位置
	unfocus.forEach(block => {
		// 处理横向辅助线位置
		handleHorizontalLine(block, lines, lastSelectBlock)
		// 处理竖向辅助线位置
		handleVerticalLine(block, lines, lastSelectBlock)
	})

	return lines
}

/**
 * 处理横线
 * @param {object} block
 * @param {object} lines
 * @param {object} lastSelectBlock
 */
function handleHorizontalLine(block, lines, lastSelectBlock) {
	// * b 控件表示拖动的控件，a 控件表示未拖动的控件
	const { y: aBlockY, height: aBlockHeight } = block
	const { y: bBlockY, height: bBlockHeight } = lastSelectBlock

	// * showHorizontal 表示横线辅助线出现时的位置
	// * horizontalTop 表示拖动的控件顶部坐标与这个 horizontalTop 相等时，辅助线出现
	// * block 表示出现辅助线时，对标的控件

	// 1. b顶 对 a顶
	//  - 当拖动的控件的顶部坐标 与 未选中控件的顶部坐标相等时，辅助线出现
	lines.y.push({
		showHorizontal: aBlockY,
		horizontalTop: aBlockY,
		block
	})
	// 2. b底 对 a顶 辅助线
	//  - 当拖动的控件的底部位置 与 未选中控件的顶部坐标相等时，辅助线出现
	lines.y.push({
		showHorizontal: aBlockY,
		horizontalTop: aBlockY - bBlockHeight,
		block
	})
	// 3. b中 对 a中 辅助线
	//  - 当拖动的控件的中部坐标 与 未选中控件的中部坐标相等时，辅助线出现
	lines.y.push({
		showHorizontal: aBlockY + aBlockHeight / 2,
		horizontalTop: aBlockY + aBlockHeight / 2 - bBlockHeight / 2,
		block
	})
	// 4. b顶 对 a底 辅助线
	//  - 当拖动的控件的顶部坐标 与 未选中控件的底部坐标相等时，辅助线出现
	lines.y.push({
		showHorizontal: aBlockY + aBlockHeight,
		horizontalTop: aBlockY + aBlockHeight,
		block
	})
	// 5. b底 对 a底 辅助线
	//  - 当拖动的控件的底部坐标 与 未选中控件的底部坐标相等时，辅助线出现
	lines.y.push({
		showHorizontal: aBlockY + aBlockHeight,
		horizontalTop: aBlockY + aBlockHeight - bBlockHeight,
		block
	})
}

/**
 * 处理竖线
 * @param {object} block
 * @param {object} lines
 * @param {object} lastSelectBlock
 */
function handleVerticalLine(block, lines, lastSelectBlock) {
	// * b 控件表示拖动的控件，a 控件表示未拖动的控件
	const { x: aBlockX, width: aBlockWidth } = block
	const { x: bBlockX, width: bBlockWidth } = lastSelectBlock

	// * showVertical 表示竖线辅助线出现时的位置
	// * verticalLeft 表示拖动的控件左侧坐标与这个 verticalLeft 相等时，辅助线出现

	// 1. b左 对 a左 辅助线
	//  - 当拖动的控件的左侧坐标 与 未选中控件的左侧坐标相等时，辅助线出现
	lines.x.push({
		showVertical: aBlockX,
		verticalLeft: aBlockX,
		block
	})
	// 2. b右 对 a左 辅助线
	lines.x.push({
		showVertical: aBlockX,
		verticalLeft: aBlockX - bBlockWidth,
		block
	})
	// 3. b中 对 a中 辅助线
	lines.x.push({
		showVertical: aBlockX + aBlockWidth / 2,
		verticalLeft: aBlockX + aBlockWidth / 2 - bBlockWidth / 2,
		block
	})
	// 4. b左 对 a右 辅助线
	lines.x.push({
		showVertical: aBlockX + aBlockWidth,
		verticalLeft: aBlockX + aBlockWidth,
		block
	})
	// 5. b右 对 a右 辅助线
	lines.x.push({
		showVertical: aBlockX + aBlockWidth,
		verticalLeft: aBlockX + aBlockWidth - bBlockWidth,
		block
	})
}

/**
 * 根据当前选中的block的坐标，找到符合条件的辅助线
 * @param {object} lines 所有辅助线数组
 * @param {number} curBlockX  当前选中的block的x坐标
 * @param {number} curBlockY  当前选中的block的y坐标
 * @param {number} curBlockWidth  当前选中的block的宽度
 * @param {number} curBlockHeight  当前选中的block的高度
 * @param {number} gap 精度-当前选中的block的坐标与辅助线的坐标的差值小于等于这个值时，认为符合条件
 */
function findLine(lines, curBlockX, curBlockY, curBlockWidth, curBlockHeight, gap = 5) {
	const { x: verticalLines, y: horizontalLines } = lines

	// 拖动过程中，找到符合条件的辅助线
	const horizontalLine = horizontalLines.find(line => {
		return Math.abs(line.horizontalTop - curBlockY) <= gap
	})
	//  - 左右两边至少匹配一次
	const verticalLine = verticalLines.find(line => {
		return Math.abs(line.verticalLeft - curBlockX) <= gap
	})

	return { horizontalLine, verticalLine }
}

export function useCanvasDrag(focusData, lastSelectBlock, { setMarkLine, clearMarkLine, canvasSize }) {
	// 获取焦点后实现拖拽
	const dragState = ref({
		startX: 0, // 鼠标按下的x坐标
		startY: 0, // 鼠标按下的y坐标
		curBlockX: 0, // 当前选中的block的x坐标
		curBlockY: 0, // 当前选中的block的y坐标
		curBlockWidth: 0, // 当前选中的block的宽度
		curBlockHeight: 0, // 当前选中的block的高度
		blockStartPos: [], // 选中的block的初始坐标
		lines: {}, // 辅助线
		draging: false // 是否正在拖拽
	})

	function handleMouseDown(e) {
		dragState.value.draging = false
		dragState.value.startX = e.clientX
		dragState.value.startY = e.clientY
		dragState.value.curBlockX = lastSelectBlock.value.x
		dragState.value.curBlockY = lastSelectBlock.value.y
		dragState.value.curBlockWidth = lastSelectBlock.value.width
		dragState.value.curBlockHeight = lastSelectBlock.value.height
		dragState.value.blockStartPos = focusData.value.focus.map(({ x, y }) => {
			return { x, y }
		})

		// 将容器也加入进去，容器对齐时设置辅助线
		const unfocus = [
			{
				x: 0,
				y: 0,
				width: canvasSize.value.width,
				height: canvasSize.value.height
			},
			...focusData.value.unfocus
		]

		dragState.value.lines = genLines(unfocus, lastSelectBlock.value)

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseMove(e) {
		const _dragState = dragState.value
		if (!_dragState.draging) {
			emitter.emit(events.DRAG_START) // 触发事件，记住拖拽之前的位置
			_dragState.draging = true
		}

		// 获取鼠标移动的坐标
		let moveX = e.clientX
		let moveY = e.clientY

		// 计算当前选中的block的最新的坐标
		const curBlockX = moveX - _dragState.startX + _dragState.curBlockX
		const curBlockY = moveY - _dragState.startY + _dragState.curBlockY

		// 并根据最新的坐标去生成好的辅助线数据里面找符合条件的辅助线
		const lines = _dragState.lines

		const { horizontalLine, verticalLine } = findLine(
			lines,
			curBlockX,
			curBlockY,
			_dragState.curBlockWidth,
			_dragState.curBlockHeight
		)

		// 处理辅助线
		//  1. 直接处理当前移动元素的坐标，并且这里会存在间隔，符合这个间隔值就让他直接对齐；
		//   - 以计算横向辅助线为例：
		//    - 鼠标开始按下的Y坐标 - 拖拽元素开始时的Y坐标(即旧的Y坐标) = 容器距离顶部的高度
		//    - 然后利用容器距离顶部的高度 + 辅助线出现的Y坐标值 = 当前拖拽元素应该对齐的Y坐标值(即新的Y坐标值)
		//    - 新的Y坐标值 - 旧的Y坐标 = 拖拽元素应该移动的距离
		//  2. 生成辅助线元素，插入到容器中

		if (horizontalLine) {
			moveY = _dragState.startY - _dragState.curBlockY + horizontalLine.horizontalTop
		}

		// 横向-左边
		if (verticalLine) {
			moveX = _dragState.startX - _dragState.curBlockX + verticalLine.verticalLeft
		}

		// 处理线条的坐标
		const y = horizontalLine?.showHorizontal
		const x = verticalLine?.showVertical

		setMarkLine(x, y)

		const durX = moveX - _dragState.startX
		const durY = moveY - _dragState.startY

		// 处理block的坐标
		focusData.value.focus.forEach((block, idx) => {
			block.x = _dragState.blockStartPos[idx].x + durX
			block.y = _dragState.blockStartPos[idx].y + durY
		})
	}

	function handleMouseUp() {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
		clearMarkLine()
		if (dragState.value.draging) {
			emitter.emit(events.DRAG_END) // 触发事件，记住拖拽之后的位置
			dragState.value.draging = false
		}
	}

	return {
		handleMouseDown
	}
}
