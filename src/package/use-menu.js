import { computed, reactive } from 'vue'

export function useMenu(commandState) {
	const menus = reactive([
		{
			label: '撤销',
			icon: 'icon-undo',
			disabled: computed(() => commandState.curIndex === -1),
			handle: commandState.commandMap.undo
		},
		{
			label: '重做',
			icon: 'icon-redo',
			disabled: computed(
				() => commandState.curIndex === commandState.queue.length - 1 || commandState.queue.length === 0
			),
			handle: commandState.commandMap.redo
		}
	])

	return {
		menus
	}
}
