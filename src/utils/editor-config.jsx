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
	// width: 65,
	// height: 22
})

editorConfig.register({
	label: '按钮',
	preview: () => <ElButton>预览按钮</ElButton>,
	render: () => <ElButton>渲染按钮</ElButton>,
	type: 'button',
	// width: 88,
	// height:32
})

editorConfig.register({
	label: '输入框',
	preview: () => <ElInput placeholder='预览输入框'></ElInput>,
	render: () => <ElInput placeholder='渲染输入框'></ElInput>,
	type: 'input',
	// width: 220,
	// height: 32
})
