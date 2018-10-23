<template>
  <div class="icon-selector-container">
    <el-input v-model.trim="needIcon" placeholder="输入英文关键字" auto-complete="off" />
    <el-row style="height: 32px; line-height: 32px;">
      <span>已选择：</span>
      <svg-icon :icon-class="selectedClassName" class-name="icon-style" />
      <span>{{ selectedClassName }}</span>
    </el-row>
    <el-tabs type="border-card">
      <el-tab-pane
        v-for="item in faClassNameList"
        :key="item.type"
        :label="item.type"
      >
        <el-scrollbar
          v-if="item.names.length > 0"
          tag="div"
          class="is-empty"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
        >
          <div
            v-for="(className, index) in item.names"
            :key="index"
            :class="['icon-area', selectedClassName == item.type + '_' + className ? 'icon-selected-style' : '']"
            @click="handleSelect(item.type + '_' + className)"
          >
            <svg-icon
              :icon-class="item.type + '_' + className"
              class-name="icon-style"
            />
          </div>
        </el-scrollbar>
        <span v-else>未找到图标</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FAClass from './FAClass'

export default {
  name: 'IconSelector',
  data() {
    return {
      faClassNameList: FAClass,
      selectedClassName: '',
      needIcon: ''
    }
  },
  watch: {
    needIcon(val) {
      this.searchIcon(val)
    }
  },
  methods: {
    handleSelect(selectedName) {
      this.selectedClassName = selectedName
    },
    searchIcon(val) {
      if (val === '') {
        this.faClassNameList = FAClass
        return
      }
      const resultList = []
      FAClass.filter(item => {
        const type = item.type
        const nameList = item.names
        const found = {
          type,
          names: []
        }
        nameList.filter(cls => {
          if (cls.indexOf(val) > -1) {
            found.names.push(cls)
          }
        })
        resultList.push(found)
      })
      this.faClassNameList = resultList
    },
    getSelectedClassName() {
      return this.selectedClassName
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-selector-container {
  .el-select-dropdown__wrap {
    height: 274px;
  }

  .icon-area {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;

    &:hover {
      // background-color: #409EFF;
      background-color: #409EFF ;
      color: white;
    }

  }

  .icon-style {
    font-size: 18px;
  }

  .icon-selected-style {
    background-color: #1C86EE;
    color: white;
  }
}
</style>
