<template>
  <div class="comment-form">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="content">
        <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="写下您的评论..."
        />
      </el-form-item>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button v-if="parentId" type="primary" @click="$emit('cancel')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  parentid: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  content: ''
})

const rules = ref({
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' }
  ]
})

const formRef = ref(null)

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const commentData = {
      content: form.value.content
    }


    emit('submit', commentData)
    form.value.content = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped lang="less">

@import "@/assets/css/container.less";
@import "@/assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";

.comment-form {
  padding: 8px;
  background-color: @theme-second-color;
  border-radius: 4px;
}
.text-area{

}
.form-actions {
  display: flex;
  justify-content: flex-end;
}

:deep .el-textarea__inner{
  --el-input-bg-color: @theme-background-color-light ;
  --el-input-text-color: @theme-background-color-light;
  background-color: @theme-background-color-light;
  --el-input-text-color: @font-color;
  --el-input-border-color: @border-color  ;
  --el-input-focus-border-color: @theme-highlight-color;
}

</style>