import { ElButton, ElInput } from 'element-plus'

const createInputProp = (label, initValue, elProps) => ({
	type: 'input',
	initValue,
	label,
	elProps
})
const createColorProp = (label, initValue, elProps) => ({
	type: 'color',
	initValue,
	label,
	elProps
})
const createSelectProp = (label, initValue, options, elProps) => ({
	type: 'select',
	initValue,
	label,
	options,
	elProps
})
const createNumberProp = (label, initValue, elProps) => ({
	type: 'number',
	initValue,
	label,
	elProps
})

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
	render: props => {
		return (
			<>
				<span style={{ color: props.color, fontSize: props.size }}>{props.text || '渲染文本'}</span>
			</>
		)
	},
	type: 'text',
	props: {
		text: createInputProp('文本内容', 'Text', {
			placeholder: '输入文本内容'
		}),
		color: createColorProp('字体颜色', '#f40', {
			showAlpha: false
		}),
		size: createSelectProp(
			'字体大小',
			16,
			[
				{ label: '较大的', value: 18 },
				{ label: '正常的', value: 16 },
				{ label: '较小的', value: 14 }
			],
			{
				placeholder: '选择字体大小'
			}
		)
	}
})

editorConfig.register({
	label: '按钮',
	preview: () => <ElButton>一个按钮</ElButton>,
	render: props => {
		return (
			<ElButton
				type={props.type}
				size={props.size}>
				{props.text || '点击一下'}
			</ElButton>
		)
	},
	type: 'button',
	props: {
		text: createInputProp('按钮内容', 'Button', {
			elProps: {
				placeholder: '输入按钮内容'
			}
		}),
		type: createSelectProp(
			'按钮类型',
			'default',
			[
				{ label: '主要', value: 'primary' },
				{ label: '成功', value: 'success' },
				{ label: '警告', value: 'warning' },
				{ label: '危险', value: 'danger' },
				{ label: '默认', value: 'default' }
			],
			{
				placeholder: '选择按钮类型'
			}
		),
		size: createSelectProp(
			'按钮尺寸',
			'default',
			[
				{ label: '大型', value: 'large' },
				{ label: '默认', value: 'default' },
				{ label: '小型', value: 'small' }
			],
			{
				placeholder: '选择按钮尺寸'
			}
		)
	}
})

editorConfig.register({
	label: '输入框',
	preview: () => <ElInput placeholder='输入框'></ElInput>,
	render: () => <ElInput placeholder='输入内容...'></ElInput>,
	type: 'input',
	props: []
})
