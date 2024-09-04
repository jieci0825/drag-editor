<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import EditorBlock from './editor-block.vue'

const modelValue = defineModel({ type: Object, default: () => ({}) })
const containerStyle = computed(() => {
	return {
		width: modelValue.value.container.width + 'px',
		height: modelValue.value.container.height + 'px'
	}
})

const editorConfigInject = inject('editorConfig')

const curEvt = ref(null)
const containerRef = ref(null)
const curComponent = ref(null)

const handleDragEnter = e => {
	e.dataTransfer.dropEffect = 'move' // 设置拖拽效果
}
const handleDragOver = e => {
	e.preventDefault() // 阻止默认行为，防止无法触发 drop
}
const handleDragLeave = e => {
	e.dataTransfer.dropEffect = 'none' // 设置拖拽效果
}
const handleDrop = e => {
	// 添加一个渲染组件
	const blocks = modelValue.value.blocks
	const block = {
		type: curComponent.value.type,
		x: e.offsetX,
		y: e.offsetY,
		width: curComponent.value.width,
		height: curComponent.value.height,
		zIndex: 1,
		alignCenter: true
	}
	blocks.push(block)
	const data = { ...modelValue.value, blocks }

	modelValue.value = data
}

const handleDragEnd = e => {
	reset()
	containerRef.value.removeEventListener('dragenter', handleDragEnter)
	containerRef.value.removeEventListener('dragover', handleDragOver)
	containerRef.value.removeEventListener('dragleave', handleDragLeave)
	containerRef.value.removeEventListener('drop', handleDrop)
}

const handleDragStart = (e, comp) => {
	curEvt.value = e
	curComponent.value = comp
	setTargetStyle()
	// 添加移动的标识
	containerRef.value.addEventListener('dragenter', handleDragEnter)
	// 经过时阻止默认行为
	containerRef.value.addEventListener('dragover', handleDragOver)
	// 离开时增加一个禁用标识
	containerRef.value.addEventListener('dragleave', handleDragLeave)
	// drop 松开，根据拖拽的组件生成一个组件
	containerRef.value.addEventListener('drop', handleDrop)
}

function reset() {
	curEvt.value && resetTargetStyle()
	curEvt.value = null
	curComponent.value = null
}

function setTargetStyle() {
	curEvt.value.target.classList.add('dragging')
}

function resetTargetStyle() {
	curEvt.value.target.classList.remove('dragging')
}

const canvasSize = ref({
	width: modelValue.value.container.width,
	height: modelValue.value.container.height
})

onMounted(() => {})
</script>

<template>
	<div class="editor-container">
		<div class="editor-material">
			<div
				class="editor-material-item-wrap"
				v-for="(component, idx) in editorConfigInject.componentList"
				:key="idx">
				<div
					:draggable="true"
					@dragstart="handleDragStart($event, component)"
					@dragend="handleDragEnd"
					class="editor-material-item">
					<span>{{ component.label }}</span>
					<div>
						<component :is="component.preview()" />
					</div>
				</div>
			</div>
		</div>
		<div class="editor-main">
			<div class="editor-menu"></div>
			<div class="editor-content">
				<div class="editor-canvas-wrap">
					<div
						:style="containerStyle"
						ref="containerRef"
						class="editor-canvas">
						<EditorBlock
							v-for="block in modelValue.blocks"
							:key="block"
							:canvas-size="canvasSize"
							:block="block" />
					</div>
				</div>
			</div>
		</div>
		<div class="editor-controller">控制区</div>
	</div>
</template>

<style lang="less">
@import url('./editor.less');
</style>
