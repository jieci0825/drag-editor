<script setup>
const props = defineProps({
	title: {
		type: String,
		default: '对话框标题'
	},
	content: {
		type: [String, Object, Function],
		default: '这是内容区域'
	},
	onDestroy: {
		type: Function,
		default: () => {}
	}
})
</script>

<template>
	<div class="dialog-mask">
		<div class="dialog-wrap">
			<div class="dialog-header">
				<div class="header-title">{{ props.title }}</div>
				<div class="header-btns">
					<div
						class="header-btn"
						@click="props.onDestroy">
						<span class="iconfont icon-close"></span>
					</div>
				</div>
			</div>
			<div class="dialog-body">
				<slot>
					<div>这是内容部分</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
.dialog-mask {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: flex-start;
	.dialog-wrap {
		margin-top: 120px;
		border-radius: 6px;
		width: 50%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: var(--el-text-color-regular);
		.dialog-header {
			padding: 10px 20px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: var(--el-color-primary-light-9);
			.header-title {
				font-size: 18px;
			}
			.header-btns {
				display: flex;
				align-items: center;
				.header-btn {
					.iconfont {
						font-size: 22px;
						&:hover {
							color: var(--el-color-primary);
						}
					}
				}
			}
		}
		.dialog-body {
			padding: 20px;
			background-color: var(--el-bg-color);
			font-size: 16px;
		}
	}
}
</style>
