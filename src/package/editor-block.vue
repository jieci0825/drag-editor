<script setup>
import { computed, inject } from 'vue'
const props = defineProps({
	block: {
		type: Object,
		default: () => ({})
	}
})

const blockStyle = computed(() => {
	return {
		left: props.block.x + 'px',
		top: props.block.y + 'px',
		width: props.block.width + 'px',
		zIndex: props.block.zIndex
	}
})

const editorConfigInject = inject('editorConfig')
const comp = editorConfigInject.componentMap[props.block.type]
</script>

<template>
	<div
		:style="blockStyle"
		class="editor-block">
		<component :is="comp.render()" />
	</div>
</template>

<style lang="less"></style>
