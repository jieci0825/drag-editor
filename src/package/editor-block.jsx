import { computed, defineComponent, inject } from 'vue'

export default defineComponent({
	name: 'EditorBlock',
	props: {
		modelValue: {
			type: Object,
			required: true
		}
	},
	setup(props, { emit }) {
		const modelValueBlock = computed({
			get() {
				return props.modelValue
			},
			set(val) {
				emit('update:block', val)
			}
		})

		const blockStyle = computed(() => {
			return {
				left: modelValueBlock.value.x + 'px',
				top: modelValueBlock.value.y + 'px',
				width: modelValueBlock.value.width + 'px',
				height: modelValueBlock.value.height + 'px',
				zIndex: modelValueBlock.value.zIndex
			}
		})

		const editorConfigInject = inject('editorConfig')

		return () => {
			// 找到对应的组件
			const comp = editorConfigInject.componentMap[modelValueBlock.value.type]
			// 获取组件的渲染函数
			const compRender = comp.render()
			return (
				<>
					<div
						style={blockStyle.value}
						class='editor-block'>
						{compRender}
					</div>
				</>
			)
		}
	}
})
