<script setup>
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['close', 'importJSON'])

const content = ref('')

const handleImportJSON = () => {
	emits('importJSON', content.value)
	emits('close')
}
</script>

<template>
	<div class="editor-import-config-box">
		<div class="content">
			<ElInput
				v-model="content"
				:rows="10"
				spellcheck="false"
				type="textarea"
				placeholder="请输入JSON配置"></ElInput>
		</div>
		<div class="footer">
			<el-button @click="emits('close')">取消</el-button>
			<el-button
				@click="handleImportJSON"
				type="primary"
				>导入</el-button
			>
		</div>
	</div>
</template>

<style scoped lang="less">
.editor-import-config-box {
	width: 100%;
	.content {
		overflow: auto;
		// height: 400px;
		border-radius: 4px;
		color: var(--el-text-color-regular);
		line-height: 1.4;
	}
	.footer {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}
</style>
