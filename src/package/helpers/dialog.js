import { render, h, isVNode } from 'vue'
import { isFunction } from '@/utils/check-type'
import Dialog from '@/components/dialog/index.vue'

export function $dialog(options) {
	const config = Object.assign(
		{
			title: '这是一个对话框的标题',
			content: '这是一个对话框的内容',
			zInedx: 3000
		},
		options
	)

	// 创建容器
	const container = document.createElement('div')

	// 卸载元素
	const onDestroy = () => {
		render(null, container)
	}

	const props = { ...config, onDestroy }
	const slots =
		isFunction(props.content) || isVNode(props.content)
			? {
					default: isFunction(props.content) ? props.content : () => props.content
			  }
			: null

	const vnode = h(Dialog, props, slots)
	// 渲染挂载
	render(vnode, container)
	// 只加入第一个子元素，避免这个多余的 div 容器插入
	document.body.appendChild(container.firstElementChild)

	return {
		onDestroy
	}
}
