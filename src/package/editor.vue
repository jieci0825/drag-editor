<script setup>
import EditorBlock from './editor-block.vue'
import { ref, inject, computed } from 'vue'
import { useDragger } from './use-dragger'
import { useBlockFocus } from './use-block-focus'
import { useCanvasDrag } from './use-canvas-drag'

const modelValue = defineModel({ type: Object, default: () => ({}) })
const containerStyle = computed(() => {
	return {
		width: modelValue.value.container.width + 'px',
		height: modelValue.value.container.height + 'px'
	}
})

const containerRef = ref(null)
const editorConfigInject = inject('editorConfig')

// 物料区拖拽到画布
const { handleDragStart, handleDragEnd } = useDragger(modelValue, containerRef)

// 焦点
const { handleBlockMouseDown, focusData, handleCanvasMouseDown } = useBlockFocus(modelValue, {
	callback: e => {
		// 画布内拖拽
		handleMouseDown(e)
	}
})

// 画布内拖拽
const { handleMouseDown } = useCanvasDrag(focusData)

const canvasSize = ref({
	width: modelValue.value.container.width,
	height: modelValue.value.container.height
})
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
						@mousedown="handleCanvasMouseDown"
						:style="containerStyle"
						ref="containerRef"
						class="editor-canvas">
						<EditorBlock
							@block-mouse-down="($event, blockRef) => handleBlockMouseDown($event, blockRef, block)"
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
