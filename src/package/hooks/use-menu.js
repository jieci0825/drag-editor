import { computed, reactive, h } from 'vue'
import { $dialog } from '../helpers/dialog'
import EditorExportConfig from '../components/editor-export-config.vue'
import EditorImportConfig from '../components/editor-import-config.vue'

export function useMenu({ commandState, modelValue, focusData }) {
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
			handle: () => {
				const { onDestroy } = $dialog({
					title: '导入JSON配置',
					content: h(EditorImportConfig, {
						onClose() {
							onDestroy()
						},
						onImportJSON(content) {
							try {
								const data = JSON.parse(content)
								commandState.commandMap.updateContainer(data)
							} catch (error) {
								ElMessage.error('导入失败，请检查JSON格式是否正确')
							}
						}
					})
				})
			}
		},
		{
			label: '导出',
			icon: 'icon-export',
			handle: () => {
				const { onDestroy } = $dialog({
					title: '导出JSON配置',
					content: h(EditorExportConfig, {
						content: JSON.stringify(modelValue.value, null, 2),
						onClose() {
							onDestroy()
						}
					})
				})
			}
		},
		{
			label: '置顶',
			icon: 'icon-top',
			disabled: computed(() => {
				return focusData.value.focus.length === 0
			}),
			handle: commandState.commandMap.placeTop
		},
		{
			label: '置底',
			icon: 'icon-bottom',
			disabled: computed(() => {
				return focusData.value.focus.length === 0
			}),
			handle: commandState.commandMap.placeBottom
		},
		{
			label: '删除',
			icon: 'icon-delete',
			disabled: computed(() => {
				return focusData.value.focus.length === 0
			}),
			handle: commandState.commandMap.deleteBlock
		}
	])

	return {
		menus
	}
}
