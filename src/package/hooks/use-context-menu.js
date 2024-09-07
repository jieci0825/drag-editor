import { h } from 'vue'
import { $contextMenu } from '../helpers/context-menu'
import { $dialog } from '../helpers/dialog'
import EditorExportConfig from '../components/editor-export-config.vue'
import EditorImportConfig from '../components/editor-import-config.vue'

export function useContextMenu({ commandState, lastSelectBlock }) {
	const menus = [
		{
			label: '删除',
			handle: commandState.commandMap.deleteBlock
		},
		{
			label: '置顶',
			handle: commandState.commandMap.placeTop
		},
		{
			label: '置底',
			handle: commandState.commandMap.placeBottom
		},
		{
			label: '查看',
			icon: 'icon-preview-full',
			handle: () => {
				const { onDestroy } = $dialog({
					title: '查看当前block的配置',
					content: h(EditorExportConfig, {
						content: JSON.stringify(lastSelectBlock.value, null, 2),
						onClose() {
							onDestroy()
						}
					})
				})
			}
		},
		{
			label: '编辑',
			handle: () => {
				const { onDestroy } = $dialog({
					title: '编辑当前block的配置',
					content: h(EditorImportConfig, {
						onClose() {
							onDestroy()
						},
						onImportJSON(content) {
							try {
								const newBlock = JSON.parse(content)
								commandState.commandMap.updateBlock(newBlock, lastSelectBlock.value)
							} catch (error) {
								ElMessage.error('导入失败，请检查JSON格式是否正确')
							}
						}
					})
				})
			}
		}
		// todo：可以补充复制、粘贴、剪切等操作
	]

	const handleBlockContextMenu = e => {
		$contextMenu({ evt: e, menus })
	}

	return {
		handleBlockContextMenu
	}
}
