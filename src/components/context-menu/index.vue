<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
	evt: {
		type: Object,
		default: () => ({})
	},
	pos: {
		type: Object,
		default: () => ({
			top: 0,
			left: 0
		})
	},
	onDestroy: {
		type: Function,
		default: () => {}
	},
	menus: {
		type: Array,
		default: () => [
			{ label: '菜单1', value: 'menu1' },
			{ label: '菜单2', value: 'menu2' },
			{ label: '菜单3', value: 'menu3' }
		]
	}
})

const containerStyle = computed(() => {
	return {
		top: `${props.pos.top}px`,
		left: `${props.pos.left}px`
	}
})

const elRef = ref(null)

const onMouseDown = e => {
	if (elRef.value && !elRef.value.contains(e.target)) {
		props.onDestroy()
	}
}

onMounted(() => {
	document.addEventListener('mousedown', onMouseDown, true)
})

onUnmounted(() => {
	document.removeEventListener('mousedown', onMouseDown)
})
</script>

<template>
	<div
		:style="containerStyle"
		ref="elRef"
		class="context-menu-wrap">
		<div class="menu-list">
			<div
				class="menu-item"
				v-for="item in props.menus"
				:key="item.value">
				{{ item.label }}
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
.context-menu-wrap {
	position: fixed;
	background-color: var(--el-bg-color);
	padding: 5px;
	border-radius: 2px;
	box-shadow: 0 0 2px 1px #ccc;
	.menu-list {
		.menu-item {
			padding: 5px 10px;
			cursor: pointer;
			font-size: 14px;
			border-bottom: 1px solid var(--el-border-color);
			&:last-child {
				border-bottom-color: transparent;
			}
			&:hover {
				background-color: var(--el-color-primary-light-9);
			}
		}
	}
}
</style>
