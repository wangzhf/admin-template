<template>
  <div class="content-container">
    <el-button
      @click="handleDialogVisible"
    >
      弹框
    </el-button>

    <el-dialog
      v-el-drag-dialog
      ref="dialog"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :fullscreen="fullScreen"
      :top="top"
      @before-close="handleClose"
    >
      <template slot="title">
        <span>
          <span>弹框</span>
          <el-button
            :icon="resizeIcon"
            class="resize-icon"
            @click="handleResizeDailog"
          />
        </span>
      </template>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="visible = false">取消</el-button>
        <el-button type="primary" @click.native="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'

export default {
  name: 'Dialog',
  directives: { elDragDialog },
  data() {
    return {
      visible: false,
      fullScreen: false,
      top: '10vh',
      editForm: {

      }
    }
  },
  computed: {
    resizeIcon() {
      if (this.fullScreen) {
        return 'el-icon-minus'
      } else {
        return 'el-icon-circle-plus-outline'
      }
    }
  },
  methods: {
    handleDialogVisible() {
      this.visible = true
      this.resize()
    },
    handleResizeDailog() {
      this.fullScreen = !this.fullScreen
      this.resize()
    },
    submit() {
      console.log('submit')
    },
    handleClose() {
      // close, reset dialog
      this.resize()
    },
    resize() {
      const dialog = this.$refs.dialog.$refs.dialog
      const top = dialog.offsetTop
      const left = dialog.offsetLeft
      let text = ''
      if (top <= 0) {
        console.log('top: ' + top)
        text += ' top: 0px;'
      }
      if (left <= 0) {
        console.log('left: ' + left)
        text += ' left: 0px;'
      }
      this.$refs.dialog.$refs.dialog.style.cssText += text
      console.log(dialog)
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
