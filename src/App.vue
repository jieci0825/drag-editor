<script setup>
import Editor from './package/editor.vue'
import data from './data'
import { provide, ref } from 'vue'
import { editorConfig } from './utils/editor-config'

const state = ref(data)

provide('editorConfig', editorConfig)
</script>

<template>
	<div class="container">
		<Editor v-model="state"></Editor>
	</div>
</template>

<style scoped lang="less">
.container {
	padding: 20px;
	position: fixed;
	inset: 0;
	overflow: hidden;
}
</style>
