import { onUnmounted, reactive } from 'vue'
import { emitter, events } from './events'
import deepcopy from 'deepcopy'

export function useCommands(modelValue) {
	const commandState = reactive({
		curIndex: -1, // 前进后退的索引
		queue: [], // 所有命令的操作队列
		commandMap: {}, // 制作命令和执行功能的一个映射表
		commandArray: [], // 存储命令的数组
		destrotyArray: [] // 存储销毁函数的数组
	})

	const register = command => {
		commandState.commandMap[command.name] = () => {
			const { redo, undo } = command.execute()

			// 不需要添加到队列的命令，直接执行即可，如果需要添加到队列的，则不需要执行
			if (!command.pushQueue) return redo()

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

			const drop = () => {
				// 拖拽完成之后触发对应的指令，将相关的数据进行存储
				commandState.commandMap.drag()
			}

			emitter.on(events.DRAG_START, dragStart)
			emitter.on(events.DROP, drop)

			return () => {
				emitter.off(events.DRAG_START, dragStart)
				emitter.off(events.DROP, drop)
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
					modelValue.value = { ...modelValue.value, blocks: afterBlocks }
				},
				// 后退
				undo() {
					// ! 存疑
					// 撤销操作，将画布中的数据还原到拖拽前的数据
					modelValue.value = { ...modelValue.value, blocks: beforeBlocks }
				}
			}
		}
	})
	;(() => {
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
