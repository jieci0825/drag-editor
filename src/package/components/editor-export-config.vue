<script setup>
import { ElButton, ElMessage } from 'element-plus'

const props = defineProps({
	content: {
		type: String,
		default: ``
	}
})

const emits = defineEmits(['close'])

const handleCopy = () => {
	navigator.clipboard
		.writeText(props.content)
		.then(() => {
			ElMessage.success('复制JSON成功')
		})
		.catch(() => {})
	emits('close')
}

const downFile = () => {
	// 创建一个 Blob 对象
	const blob = new Blob([props.content], { type: 'application/json' })
	// 创建一个 URL 对象
	const url = URL.createObjectURL(blob)

	// 创建一个 <a> 元素并模拟点击下载
	const a = document.createElement('a')
	a.href = url
	a.download = 'data.json'
	document.body.appendChild(a)
	a.click()

	// 清理
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
	emits('close')
}
</script>

<template>
	<div class="editor-export-config-box">
		<div class="content">
			<pre>
			<code>{{ props.content }}</code>
		</pre>
		</div>
		<div class="footer">
			<el-button @click="emits('close')">关闭</el-button>
			<el-button @click="downFile">保存为文件</el-button>
			<el-button
				@click="handleCopy"
				type="primary"
				>复制JSON</el-button
			>
		</div>
	</div>
</template>

<style scoped lang="less">
.editor-export-config-box {
	width: 100%;
	.content {
		border: 1px solid var(--el-border-color);
		overflow: auto;
		height: 400px;
		border-radius: 4px;
		pre {
			margin: 0;
			width: 100%;
			height: 100%;
			padding: 10px;
			// background-color: var(--el-bg-color-page);
			code {
				display: block;
				width: 100%;
				height: 100%;
				color: var(--el-text-color-primary);
				line-height: 1.4;
			}
		}
	}
	.footer {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}
</style>
