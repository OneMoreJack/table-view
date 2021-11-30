<template>
  <ElForm
    :model="formData"
    inline>
    <ElFormItem label="Name">
      <ElInput v-model="formData.name"></ElInput>
    </ElFormItem>

    <ElFormItem label="Age">
      <ElInput v-model="formData.age"></ElInput>
    </ElFormItem>

    <ElFormItem label="Address">
      <ElInput v-model="formData.address"></ElInput>
    </ElFormItem>

    <ElFormItem>
      <ElButton type="primary" @click="handleSearch">搜索</ElButton>
      <ElButton @click="handleReset">重置</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script>
function getInitFormData() {
  return {
    name: '',
    age: '',
    address: ''
  }
}
export default {
  name: 'ListFilter',

  data() {
    return {
      formData: getInitFormData()
    }
  },

  methods: {
    handleSearch() {
      this.$emit('search', { ...this.formData })
    },

    handleReset() {
      this.formData = getInitFormData()
      this.$emit('reset', { ...this.formData })
    }
  }
}
</script>

<style>

</style>