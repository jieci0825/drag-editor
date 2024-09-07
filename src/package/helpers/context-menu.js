import { render, h, reactive } from 'vue'
import ContextMenu from '@/components/context-menu/index.vue'

let vnode
const container = document.createElement('div')

export function $contextMenu(options) {
	const state = Object.assign({}, options)

	const pos = { left: 0, top: 0 }

	if (options.evt) {
		pos.left = options.evt.clientX
		pos.top = options.evt.clientY
	}

	const onDestroy = () => {
		render(null, container)
	}

	const props = Object.assign({ pos, onDestroy }, state)

	if (vnode) {
		onDestroy()
	}

	vnode = h(ContextMenu, props)
	// 渲染挂载
	render(vnode, container)
	// 只加入第一个子元素，避免这个多余的 div 容器插入
	document.body.appendChild(container.firstElementChild)

	return {
		onDestroy
	}
}
