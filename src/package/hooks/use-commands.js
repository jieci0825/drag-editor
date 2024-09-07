import { onUnmounted, reactive } from 'vue'
import { emitter, events } from '../helpers/events'
import deepcopy from 'deepcopy'

export function useCommands({ modelValue, focusData }) {
	const commandState = reactive({
		curIndex: -1, // 前进后退的索引
		queue: [], // 所有命令的操作队列
		commandMap: {}, // 制作命令和执行功能的一个映射表
		commandArray: [], // 存储命令的数组
		destrotyArray: [] // 存储销毁函数的数组
	})

	const register = command => {
		commandState.commandMap[command.name] = (...args) => {
			const { redo, undo } = command.execute(...args)
			redo()
			// 不需要添加到队列的命令，直接执行即可，如果需要添加到队列的，则不需要执行
			if (!command.pushQueue) return

			if (commandState.queue.length > 0) {
				// 如果队列长度大于0，则截取当前索引后面的所有元素，避免中途进行撤销或者多次拖拽导致队列混乱
				commandState.queue = commandState.queue.slice(0, commandState.curIndex + 1)
			}

			commandState.queue.push({ redo, undo })
			// 每次存入一个命令，索引加一
			commandState.curIndex++
		}
		commandState.commandArray.push(command)
	}

	register({
		name: 'undo', // 命令名称
		keyboard: 'ctrl+z', // 快捷键
		execute() {
			return {
				redo() {
					if (commandState.curIndex === -1) return
					// 根据索引在队列中获取对应的数据
					const item = commandState.queue[commandState.curIndex]
					if (item) {
						// 如果存在，则直接调用对应的撤销操作函数，恢复上一步的数据
						item.undo && item.undo()
						// 撤销操作完成之后，索引-1
						commandState.curIndex--
					}
				}
			}
		}
	})
	register({
		name: 'redo', // 命令名称
		keyboard: 'ctrl+y', // 快捷键
		execute() {
			return {
				redo() {
					// 根据索引在队列中获取对应的数据
					const item = commandState.queue[commandState.curIndex + 1]
					if (item) {
						// 如果存在，则直接调用对应的前进操作函数，恢复下一步的数据
						item.redo && item.redo()
						// 撤销操作完成之后，索引+1
						commandState.curIndex++
					}
				}
			}
		}
	})
	register({
		name: 'drag',
		keyboard: '',
		pushQueue: true,
		init() {
			this._beforeBlocks = null //  保存拖拽前的数据

			const dragStart = () => {
				// 保存本次拖拽开始前画布中的 block
				this._beforeBlocks = deepcopy(modelValue.value.blocks)
			}

			const dragEnd = () => {
				// 拖拽完成之后触发对应的指令，将相关的数据进行存储
				commandState.commandMap.drag()
			}

			emitter.on(events.DRAG_START, dragStart)
			emitter.on(events.DRAG_END, dragEnd)

			return () => {
				emitter.off(events.DRAG_START, dragStart)
				emitter.off(events.DRAG_END, dragEnd)
			}
		},
		execute() {
			// 拖拽完成后会执行这里，
			//  - 利用闭包，将每次拖拽前的数据保存起来
			const beforeBlocks = deepcopy(this._beforeBlocks)
			//  - 并将拖拽完成之后的，画布中最新的block数据保存起来
			const afterBlocks = deepcopy(modelValue.value.blocks)
			return {
				// 前进
				redo() {
					// 更新画布中的数据
					modelValue.value.blocks = afterBlocks
				},
				// 后退
				undo() {
					// 撤销操作，将画布中的数据还原到拖拽前的数据
					modelValue.value.blocks = beforeBlocks
				}
			}
		}
	})
	register({
		name: 'updateContainer',
		pushQueue: true,
		execute(newValue) {
			const state = {
				before: deepcopy(modelValue.value),
				after: deepcopy(newValue)
			}
			return {
				redo() {
					modelValue.value = state.after
				},
				undo() {
					modelValue.value = state.before
				}
			}
		}
	})
	register({
		name: 'placeTop',
		pushQueue: true,
		execute() {
			const before = deepcopy(modelValue.value.blocks)
			const after = (() => {
				const { focus, unfocus } = focusData.value
				// 寻找最大的zIndex
				const maxZindex = unfocus.reduce((prev, block) => {
					return Math.max(prev, block.zIndex)
				}, -Infinity)
				focus.forEach(block => {
					block.zIndex = maxZindex + 1
				})
				return deepcopy(modelValue.value.blocks)
			})()
			return {
				redo() {
					modelValue.value.blocks = after
				},
				undo() {
					modelValue.value.blocks = before
				}
			}
		}
	})
	register({
		name: 'placeBottom',
		pushQueue: true,
		execute() {
			const before = deepcopy(modelValue.value.blocks)
			const after = (() => {
				const { focus, unfocus } = focusData.value
				let minZindex = unfocus.reduce((prev, block) => {
					return Math.min(prev, block.zIndex)
				}, +Infinity)

				// ec处理：zIndex 的值为负数则会导致元素被画布覆盖，无法选中，所以若 minZindex 为负数，则将其改为 0，其他的 block +1
				if (minZindex < 0) {
					unfocus.forEach(block => (block.zIndex = block.zIndex + 1))
					minZindex = 0
				} else {
					minZindex--
				}

				focus.forEach(block => (block.zIndex = minZindex))

				return deepcopy(modelValue.value.blocks)
			})()
			return {
				redo() {
					modelValue.value.blocks = after
				},
				undo() {
					modelValue.value.blocks = before
				}
			}
		}
	})
	register({
		name: 'deleteBlock',
		pushQueue: true,
		execute() {
			const before = deepcopy(modelValue.value.blocks)
			const after = deepcopy(focusData.value.unfocus)
			return {
				redo() {
					modelValue.value.blocks = after
				},
				undo() {
					modelValue.value.blocks = before
				}
			}
		}
	})

	const keyboardEvent = (() => {
		const keyMap = {
			90: 'z',
			89: 'y'
		}

		const onKeydown = e => {
			const { ctrlKey, keyCode } = e
			const keyCodes = []
			if (ctrlKey) keyCodes.push('ctrl')
			keyMap[keyCode] && keyCodes.push(keyMap[keyCode])
			const keyString = keyCodes.join('+')

			commandState.commandArray.forEach(command => {
				if (!command.keyboard) return
				if (command.keyboard === keyString) {
					const fn = commandState.commandMap[command.name]
					fn && fn()
					e.preventDefault()
				}
			})
		}

		const init = () => {
			window.addEventListener('keydown', onKeydown)
			return () => {
				// 注销快捷键监听事件
				window.removeEventListener('keydown', onKeydown)
			}
		}
		return init
	})()

	;(() => {
		commandState.destrotyArray.push(keyboardEvent())
		commandState.commandArray.forEach(command => {
			command.init && commandState.destrotyArray.push(command.init())
		})
	})()

	onUnmounted(() => {
		commandState.destrotyArray.forEach(fn => fn && fn())
	})

	return {
		commandState
	}
}
