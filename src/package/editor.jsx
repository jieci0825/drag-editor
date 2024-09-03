import { computed, defineComponent } from "vue";
import './editor.less'

export default defineComponent({
    name: 'Editor',
    props:{
        modelValue:{
            typeo:Object,
            default:()=>({})
        }
    },
    setup(props,{emit}){
        const modelValue = computed({
            get:()=>props.modelValue,
            set:(val)=>emit('update:modelValue',val)
        })

        const containerStyle = computed(()=>{
            return {
                width:modelValue.value.container.width + 'px',
                height:modelValue.value.container.height+ 'px'
            }
        })

        return ()=><>
        <div class="editor-container">
            {/* 物料 */}
            <div class="editor-material"></div>
            {/* 主区域 */}
            <div class="editor-main">
                {/* 菜单 */}
                <div class="editor-menu"></div>
                {/* 内容 */}
                <div class="editor-content">
                    {/* 画布包 */}
                    <div class="editor-canvas-wrap">
                        {/* 画布内容 */}
                        <div style={containerStyle.value} class="editor-canvas"></div>
                    </div>
                </div>
            </div>
            {/* 控制 */}
            <div class="editor-controller"></div>
        </div>
        </>
    }
})