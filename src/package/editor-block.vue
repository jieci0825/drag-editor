<script setup>
import { ref, computed, inject, onMounted } from 'vue'
const props = defineProps({
	block: {
		type: Object,
		default: () => ({})
	},
	canvasSize: {
		type: Object,
		default: () => ({})
	}
})

const emits = defineEmits(['blockMouseDown'])

const blockStyle = computed(() => {
	return {
		left: props.block.x + 'px',
		top: props.block.y + 'px',
		width: props.block.width + 'px',
		height: props.block.height + 'px',
		zIndex: props.block.zIndex
	}
})

const editorConfigInject = inject('editorConfig')
const comp = editorConfigInject.componentMap[props.block.type]

const blockRef = ref(null)

// 处理边界情况
const handleEagePos = () => {
	const w = blockRef.value.offsetWidth
	const h = blockRef.value.offsetHeight

	const maxLeft = props.canvasSize.width - w
	const maxTop = props.canvasSize.height - h

	let left = props.block.x - w / 2
	let top = props.block.y - h / 2
	if (left < 0) {
		left = 0
	}
	if (top < 0) {
		top = 0
	}
	if (left > maxLeft) {
		left = maxLeft
	}
	if (top > maxTop) {
		top = maxTop
	}

	props.block.x = left
	props.block.y = top

	blockRef.value.style.left = left + 'px'
	blockRef.value.style.top = top + 'px'
}

onMounted(() => {
	if (props.block.alignCenter) {
		handleEagePos()
		props.block.alignCenter = false
	}
})
</script>

<template>
	<div
		@mousedown="emits('blockMouseDown', $event, blockRef)"
		ref="blockRef"
		:style="blockStyle"
		:class="{ 'editor-block-focus': props.block.focus }"
		class="editor-block">
		<component :is="comp.render()" />
	</div>
</template>

<style lang="less"></style>
