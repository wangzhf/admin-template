<template>
  <div class="content-container">
    <el-form :model="info" :rules="rules">
      <el-form-item label="活动名称" prop="first.one">
        <el-input v-model="info.first.one" />
      </el-form-item>
      <el-form-item label="活动形势" prop="second">
        <el-input v-model="info.second" />
      </el-form-item>
      <el-form-item :prop="'third.four[0].five'" label="活动内容">
        <el-input v-model="info.third.four[0].five" />
      </el-form-item>
      <el-form-item :prop="'third.four[1].six'" label="活动xx">
        <el-input v-model="info.third.four[1].six" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        first: {
          one: ''
        },
        second: '',
        third: {
          four: [
            {
              five: ''
            },
            {
              six: ''
            }
          ]
        }
      },
      rules: {
        'first.one': [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        second: [
          { required: true, message: '请输入活动形势', trigger: 'blur' }
        ],
        'third.four[0].five': [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ],
        'third.four[1].six': [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style>

</style>
