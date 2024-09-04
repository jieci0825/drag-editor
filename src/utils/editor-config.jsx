import { ElButton, ElInput } from 'element-plus'

function createEditorConfig() {
	const componentList = []
	const componentMap = {}

	return {
		componentList,
		componentMap,
		register: component => {
			componentList.push(component)
			componentMap[component.type] = component
		}
	}
}

export const editorConfig = createEditorConfig()

editorConfig.register({
	label: '文本',
	preview: () => <span>预览文本</span>,
	render: () => <span>渲染文本</span>,
	type: 'text',
})

editorConfig.register({
	label: '按钮',
	preview: () => <ElButton>一个按钮</ElButton>,
	render: () => <ElButton>点击一下</ElButton>,
	type: 'button',
})

editorConfig.register({
	label: '输入框',
	preview: () => <ElInput placeholder='输入框'></ElInput>,
	render: () => <ElInput placeholder='输入内容...'></ElInput>,
	type: 'input',
})
