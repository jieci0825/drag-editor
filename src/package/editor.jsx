import { defineComponent } from "vue";

export default defineComponent({
    name: 'Editor',
    setup(){
        return ()=><>
        <div class="editor-container">
            <h1>编辑器</h1>
        </div>
        </>
    }
})