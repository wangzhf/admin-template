<template>
  <div class="content-container">
    <el-button
      @click="handleDialogVisible"
    >
      弹框
    </el-button>

    <im-dialog
      :is-visible.sync="visible"
      :is-full-screen.sync="fullScreen"
      :top="top"
      :before-close="beforeClose"
      title="弹框"
      @submit="submit"
    >
      <template slot="body">
        <el-form ref="editForm" :model="editForm" label-width="80px">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="editForm.userName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="editForm.userCode" auto-complete="off" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="editForm.sex">
              <el-radio :label="1" class="radio">男</el-radio>
              <el-radio :label="0" class="radio">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="editForm.age" :min="0" :max="200" />
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="editForm.address" type="textarea" />
          </el-form-item>
        </el-form>
      </template>
    </im-dialog>
  </div>
</template>

<script>
import ImDialog from '@/components/Im/Dialog'

export default {
  name: 'Dialog',
  components: {
    ImDialog
  },
  data() {
    return {
      visible: false,
      fullScreen: false,
      top: '10vh',
      editForm: {

      }
    }
  },
  methods: {
    handleDialogVisible() {
      this.visible = true
    },
    submit() {
      console.log('submit')
      console.log(this.editForm)
      this.visible = false
    },
    beforeClose(done) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        done()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.resize-icon {
  position: absolute;
  top: 20px;
  right: 60px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px;
}
</style>
