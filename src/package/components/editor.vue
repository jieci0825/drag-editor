<script setup>
import EditorBlock from './editor-block.vue'
import EditorController from './editor-controller.vue'
import { ref, inject, computed } from 'vue'
import { useDragger } from '../hooks/use-dragger'
import { useBlockFocus } from '../hooks/use-block-focus'
import { useCanvasDrag } from '../hooks/use-canvas-drag'
import { useMarkLine } from '../hooks/use-mark-line'
import { useMenu } from '../hooks/use-menu'
import { useCommands } from '../hooks/use-commands'
import { useContextMenu } from '../hooks/use-context-menu'
import { ElButton } from 'element-plus'
import { isFunction } from '@/utils/check-type'

const isPreview = ref(false) // 是否开启预览
const isEdit = ref(false) // 是否编辑

const props = defineProps({})

const modelValue = defineModel({ type: Object, default: () => ({}) })
const containerStyle = computed(() => {
	return {
		width: modelValue.value.container.width + 'px',
		height: modelValue.value.container.height + 'px'
	}
})

const containerRef = ref(null)
const editorConfigInject = inject('editorConfig')
const canvasSize = ref({
	width: modelValue.value.container.width,
	height: modelValue.value.container.height
})

const { markLine, setMarkLine, clearMarkLine } = useMarkLine()

// 物料区拖拽到画布
const { handleDragStart, handleDragEnd } = useDragger(modelValue, containerRef, editorConfigInject)

// 焦点
const { handleBlockMouseDown, focusData, handleCanvasMouseDown, lastSelectBlock, clearBlockFocus } = useBlockFocus(
	modelValue,
	{
		callback: e => {
			// 画布内拖拽
			handleMouseDown(e)
		},
		isPreview
	}
)

// 画布内拖拽
const { handleMouseDown } = useCanvasDrag(focusData, lastSelectBlock, { setMarkLine, clearMarkLine, canvasSize })

const { commandState } = useCommands({ modelValue, focusData })
const { menus } = useMenu({ commandState, modelValue, focusData, isPreview, clearBlockFocus, isEdit })

const { handleBlockContextMenu } = useContextMenu({ commandState, lastSelectBlock })
</script>

<template>
	<div class="editor-container">
		<template v-if="!isEdit">
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
						@click="() => !menu.disabled && menu.handle()"
						v-for="(menu, index) in menus"
						:key="index"
						:title="menu.title"
						:class="{ 'editor-menu-item': true, 'is-disabled': menu.disabled }">
						<span :class="['iconfont', isFunction(menu.icon) ? menu.icon() : menu.icon]"></span>
						<span>{{ isFunction(menu.label) ? menu.label() : menu.label }}</span>
					</div>
				</div>
				<div class="editor-content">
					<div class="editor-canvas-wrap">
						<div
							@contextmenu.prevent
							@mousedown="handleCanvasMouseDown"
							:style="containerStyle"
							ref="containerRef"
							class="editor-canvas">
							<EditorBlock
								@blockContextMenu="($event, blockRef) => handleBlockContextMenu($event, blockRef, block, index)"
								@block-mouse-down="($event, blockRef) => handleBlockMouseDown($event, blockRef, block, index)"
								v-for="(block, index) in modelValue.blocks"
								:key="block"
								:isPreview="isPreview"
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
			<div class="editor-controller">
				<EditorController
					:command-state="commandState"
					:block="lastSelectBlock"
					:data="modelValue" />
			</div>
		</template>
		<template v-else>
			<div
				:class="{ 'is-preview': isEdit }"
				class="editor-main">
				<div class="actions">
					<el-button
						type="primary"
						@click="isEdit = false"
						>继续编辑</el-button
					>
				</div>
				<div class="editor-content">
					<div class="editor-canvas-wrap">
						<div
							:style="containerStyle"
							ref="containerRef"
							class="editor-canvas">
							<EditorBlock
								v-for="(block, index) in modelValue.blocks"
								:key="block"
								:isPreview="true"
								:canvas-size="canvasSize"
								:block="block" />
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="less">
@import url('../styles/editor.less');
</style>
