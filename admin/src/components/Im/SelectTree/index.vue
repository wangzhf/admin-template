<template>
  <el-select-tree
    :tree-data="treeDataList"
    :prop-names="mergedKeyProps"
    :default-expand-all="true"
    v-model="selectValue"
    clearable
    placeholder="请选择" />
</template>

<script>
import selectTree from '@/components/Tree/selectTree.vue'
import commonAPI from '@/api/common'

export default {
  name: 'ImSelectTree',
  components: {
    'el-select-tree': selectTree
  },
  props: {
    // 数据来源的url
    url: {
      type: String,
      default: ''
    },
    // 显示属性
    keyProps: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      treeDataList: [],
      selectValue: null,
      defaultKeyProps: {
        children: 'children',
        label: 'menuName',
        id: 'id'
      }
    }
  },
  computed: {
    mergedKeyProps() {
      return {
        ...this.defaultKeyProps,
        ...this.keyProps
      }
    }
  },
  watch: {
    selectValue(val) {
      this.$emit('select-change', val)
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      commonAPI.Post(this.url, {}).then(res => {
        this.treeDataList = []
        this.treeDataList.push(...res.data)
      })
    }
  }
}
</script>

<style>

</style>
