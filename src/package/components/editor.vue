<script setup>
import EditorBlock from './editor-block.vue'
import { ref, inject, computed } from 'vue'
import { useDragger } from '../hooks/use-dragger'
import { useBlockFocus } from '../hooks/use-block-focus'
import { useCanvasDrag } from '../hooks/use-canvas-drag'
import { useMarkLine } from '../hooks/use-mark-line'
import { useMenu } from '../hooks/use-menu'
import { useCommands } from '../hooks/use-commands'
import { emitter, events } from '../helpers/events'
import { ElMessage } from 'element-plus'

const modelValue = defineModel({ type: Object, default: () => ({}) })
const containerStyle = computed(() => {
	return {
		width: modelValue.value.container.width + 'px',
		height: modelValue.value.container.height + 'px'
	}
})

emitter.on(events.IMPORT_JSON, content => {
	try {
		const data = JSON.parse(content)
		modelValue.value = data
	} catch (error) {
		ElMessage.error('导入失败，请检查JSON格式是否正确')
	}
})

const containerRef = ref(null)
const editorConfigInject = inject('editorConfig')
const canvasSize = ref({
	width: modelValue.value.container.width,
	height: modelValue.value.container.height
})

const { commandState } = useCommands(modelValue)
const { menus } = useMenu(commandState)

const { markLine, setMarkLine, clearMarkLine } = useMarkLine()

// 物料区拖拽到画布
const { handleDragStart, handleDragEnd } = useDragger(modelValue, containerRef)

// 焦点
const { handleBlockMouseDown, focusData, handleCanvasMouseDown, lastSelectBlock } = useBlockFocus(modelValue, {
	callback: e => {
		// 画布内拖拽
		handleMouseDown(e)
	}
})

// 画布内拖拽
const { handleMouseDown } = useCanvasDrag(focusData, lastSelectBlock, { setMarkLine, clearMarkLine, canvasSize })
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
			<div class="editor-menu">
				<div
					@click="menu.handle"
					v-for="(menu, index) in menus"
					:key="index"
					:title="menu.title"
					:class="{ 'editor-menu-item': true, 'is-disabled': menu.disabled }">
					<span :class="['iconfont', menu.icon]"></span>
					<span>{{ menu.label }}</span>
				</div>
			</div>
			<div class="editor-content">
				<div class="editor-canvas-wrap">
					<div
						@mousedown="handleCanvasMouseDown"
						:style="containerStyle"
						ref="containerRef"
						class="editor-canvas">
						<EditorBlock
							@block-mouse-down="($event, blockRef) => handleBlockMouseDown($event, blockRef, block, index)"
							v-for="(block, index) in modelValue.blocks"
							:key="block"
							:canvas-size="canvasSize"
							:block="block" />
						<!-- 辅助线 -->
						<div
							v-if="markLine.y"
							:style="{ top: `${markLine.y}px` }"
							class="show-horizontal"></div>
						<div
							v-if="markLine.x"
							:style="{ left: `${markLine.x}px` }"
							class="show-vertical"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="editor-controller">控制区</div>
	</div>
</template>

<style lang="less">
@import url('../styles/editor.less');
</style>
