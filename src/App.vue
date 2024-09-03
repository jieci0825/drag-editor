<script setup>
import Editor from './package/editor'
import data from './data'
import { ref } from 'vue'

const state = ref(data)
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
