import { computed, defineComponent, inject, ref } from 'vue'
import './editor.less'
import EditorBlock from './editor-block'

export default defineComponent({
	name: 'Editor',
	props: {
		modelValue: {
			typeo: Object,
			default: () => ({})
		}
	},
	setup(props, { emit }) {
		const modelValue = computed({
			get: () => props.modelValue,
			set: val => emit('update:modelValue', val)
		})

		const containerStyle = computed(() => {
			return {
				width: modelValue.value.container.width + 'px',
				height: modelValue.value.container.height + 'px'
			}
		})

		const editorConfigInject = inject('editorConfig')

		const canvasContainerRef = ref()

		const handleDragStart = (e, comp) => {
			console.log(1111)
			console.log(canvasContainerRef.value)
		}

		const handleDrap = ()=>{
			console.log('拖拽中')
		}

		return () => (
			<>
				<div class='editor-container'>
					{/* 物料 */}
					<div class='editor-material'>
						{editorConfigInject.componentList.map(component => {
							return (
								<div
									draggable
									onDrag={e=>handleDrap(e,component)}
									onDragStart={e => handleDragStart(e, component)}
									class='editor-material-item'>
									<span>{component.label}</span>
									<div>{component.preview()}</div>
								</div>
							)
						})}
					</div>
					{/* 主区域 */}
					<div class='editor-main'>
						{/* 菜单 */}
						<div class='editor-menu'>
						</div>
						{/* 内容 */}
						<div class='editor-content'>
							{/* 画布包 */}
							<div class='editor-canvas-wrap'>
								{/* 画布内容 */}
								<div
									style={containerStyle.value}
									ref={canvasContainerRef}
									class='editor-canvas'>
									{modelValue.value.blocks.map(block => {
										return <EditorBlock v-model={block} />
									})}
								</div>
							</div>
						</div>
					</div>
					{/* 控制 */}
					<div class='editor-controller'>控制区</div>
				</div>
			</>
		)
	}
})
