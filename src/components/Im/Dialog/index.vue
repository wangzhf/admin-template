<template>
  <el-dialog
    v-el-drag-dialog
    ref="dialog"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :fullscreen="fullScreen"
    :top="top"
    :before-close="handleWrapperBeforeClose"
    @dragDialog="handleDragDialog"
    @closed="handleWrapperClosed"
  >
    <template slot="title">
      <span>
        <span>{{ title }}</span>
        <el-button
          :icon="resizeIcon"
          class="resize-icon"
          @click="handleResizeDailog"
        />
      </span>
    </template>
    <slot name="body" />
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleWrapperBeforeClose">取消</el-button>
      <el-button type="primary" @click.native="handleSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'

export default {
  name: 'Dialog',
  directives: { elDragDialog },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '10vh'
    },
    beforeClose: {
      type: Function,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      fullScreen: false,
      isDestroy: false
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
  watch: {
    isVisible() {
      this.visible = this.isVisible
    },
    isFullScreen() {
      this.fullScreen = this.isFullScreen
    }
  },
  beforeDestroy() {
    this.isDestroy = true
    this.$refs.dialog.handleClose()
  },
  methods: {
    handleResizeDailog() {
      this.fullScreen = !this.fullScreen
      this.$nextTick(() => {
        this.resize()
      })
    },
    handleWrapperBeforeClose(done) {
      console.log('done: ' + done)
      if (!this.isDestroy && typeof this.beforeClose === 'function') {
        this.beforeClose(() => {
          this.needHide(done)
        })
      } else {
        this.needHide(done)
      }
    },
    needHide(done) {
      this.$emit('update:isVisible', false)
      this.$emit('update:isFullScreen', false)
      done()
    },
    handleWrapperClosed() {
      this.fullScreen = false
      this.$nextTick(() => {
        this.resize()
      })
    },
    resize() {
      const dialog = this.$refs.dialog.$refs.dialog
      const top = dialog.offsetTop
      const left = dialog.offsetLeft
      let text = ''
      // 防止左边界超出屏幕
      if (top <= 0) {
        text += ' top: 0px;'
      }
      if (left <= 0) {
        text += ' left: 0px;'
      }
      // 防止右边界超出屏幕
      if (this.fullScreen) {
        text = ' top: 0px; left: 0px; '
      }
      this.$refs.dialog.$refs.dialog.style.cssText += text
    },
    handleDragDialog(e) {
      if (this.fullScreen) {
        this.fullScreen = false
      }
    },
    handleSubmit() {
      this.$emit('submit')
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
