import { computed, reactive } from 'vue'

export function useMenu(commandState) {
	const menus = reactive([
		{
			label: '撤销',
			icon: 'icon-undo',
			title: 'ctrl + z',
			disabled: computed(() => commandState.curIndex === -1),
			handle: commandState.commandMap.undo
		},
		{
			label: '重做',
			icon: 'icon-redo',
			title: 'ctrl + y',
			disabled: computed(
				() => commandState.curIndex === commandState.queue.length - 1 || commandState.queue.length === 0
			),
			handle: commandState.commandMap.redo
		},
		{
			label: '导入',
			icon: 'icon-import',
			handle: commandState.commandMap.importConfig
		},
		{
			label: '导出',
			icon: 'icon-export',
			handle: commandState.commandMap.exportConfig
		}
	])

	return {
		menus
	}
}
