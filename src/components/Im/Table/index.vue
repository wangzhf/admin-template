<template>
  <el-scrollbar
    tag="div"
    wrap-class="el-select-dropdown__wrap"
    view-class="el-select-dropdown__list"
    class="is-empty"
  >
    <el-table
      ref="table"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="handleTableRowClick"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column type="index" label="序号" />
      <el-table-column v-for="column in tableColumns" :key="column.propName" :prop="column.propName" :label="column.label" sortable />
    </el-table>
  </el-scrollbar>
</template>

<script>
import commonAPI from '@/api/common'

export default {
  name: 'ImTable',
  props: {
    url: {
      type: String,
      default: ''
    },
    shouldLoading: {
      type: Boolean,
      default: false
    },
    tableColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [],
      multipleSelection: [],
      loading: false
    }
  },

  // computed: {
  //   loading() {
  //     if (this.shouldLoading) {
  //       console.log('should loading changed.....: ' + this.shouldLoading)
  //       this.load()
  //     }
  //     return this.shouldLoading
  //   }
  // },

  watch: {
    shouldLoading: {
      handler(val, oldVal) {
        if (val) {
          this.load()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    load() {
      commonAPI.Post(this.url).then(res => {
        this.dataList = res.data.list
        // 生成默认选中值
        const defaultSelection = this.dataList[2]
        this.$nextTick(function() {
          this.toggleSelection([defaultSelection])
        })
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTableRowClick(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
    },

    getSelection() {
      return this.multipleSelection
    },

    close() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style>
</style>
