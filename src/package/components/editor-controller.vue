<script setup>
import { ElButton, ElForm, ElFormItem, ElSelect, ElColorPicker, ElInputNumber, ElInput, ElOption } from 'element-plus'
import { computed, inject, ref, watch } from 'vue'
import deepcopy from 'deepcopy'

const props = defineProps({
	block: {
		type: Object
	},
	data: {
		type: Object,
		default: () => ({})
	},
	commandState: {
		type: Object
	}
})

const formDataRef = ref(null)
const formData = ref({})
const editorConfigInject = inject('editorConfig')
const blockControllers = computed(() => {
	if (!props.block)
		return [
			{
				label: '容器宽度',
				type: 'number',
				prop: 'width',
				elProps: { min: 100, max: 1000 }
			},
			{
				label: '容器高度',
				type: 'number',
				prop: 'height',
				props: {},
				elProps: { min: 100, max: 1000 }
			}
		]
	const _props = editorConfigInject.componentMap[props.block.type].props
	const controllers = Object.entries(_props).map(([key, value]) => {
		const conf = {
			label: value.label,
			type: value.type,
			prop: key,
			elProps: value.elProps
		}
		if (value.options) {
			conf.options = value.options
		}
		return conf
	})

	return controllers
})

watch(
	blockControllers,
	() => {
		resetFormData()
	},
	{ immediate: true }
)

function apply() {
	if (!props.block) {
		const containerData = Object.assign({}, props.data, { container: formData.value })
		// 更新整个容器
		props.commandState.commandMap.updateContainer(containerData)
	} else {
		const newBlock = Object.assign({}, props.block, { props: formData.value })
		// 更新单个 block
		props.commandState.commandMap.updateBlock(newBlock, props.block)
	}
}

function resetFormData() {
	let data = {}
	if (!props.block) {
		data = deepcopy(props.data.container)
	} else {
		blockControllers.value.forEach(item => {
			data[item.prop] = props.block.props[item.prop] || ''
		})
	}
	formData.value = data
}
</script>

<template>
	<div class="container-wrap">
		<div class="title">控制区</div>
		<div class="content">
			<el-form
				:model="formData"
				ref="formDataRef"
				label-position="top">
				<el-form-item
					v-for="(item, idx) in blockControllers"
					:key="idx"
					:label="item.label">
					<!-- 输入框 -->
					<template v-if="item.type === 'input'">
						<el-input
							v-model="formData[item.prop]"
							v-bind="item.elProps" />
					</template>
					<!-- 选择器 -->
					<template v-else-if="item.type === 'select'">
						<el-select
							v-model="formData[item.prop]"
							v-bind="item.elProps">
							<el-option
								v-for="it in item.options"
								:key="it.value"
								:label="it.label"
								:value="it.value" />
						</el-select>
					</template>
					<!-- 计数器 -->
					<template v-else-if="item.type === 'number'">
						<el-input-number
							v-model="formData[item.prop]"
							v-bind="item.elProps" />
					</template>
					<!-- 颜色选择器 -->
					<template v-else-if="item.type === 'color'">
						<el-color-picker
							v-model="formData[item.prop]"
							v-bind="item.elProps" />
					</template>
				</el-form-item>
				<el-form-item>
					<el-button @click="resetFormData">重置</el-button>
					<el-button
						type="primary"
						@click="apply"
						>应用</el-button
					>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<style scoped lang="less"></style>
