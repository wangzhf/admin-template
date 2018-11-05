<template>
  <div class="select-tree">
    <el-scrollbar
      tag="div"
      class="is-empty"
      wrap-class="el-select-dropdown__wrap"
      view-class="el-select-dropdown__list">
      <el-tree
        ref="tree"
        :data="treeDataList"
        :props="mergedKeyProps"
        :check-on-click-node="true"
        :default-checked-keys="defaultCheckedKeys"
        node-key="id"
        show-checkbox
        @check-change="handleCheckChange"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import commonAPI from '@/api/common'

export default {
  name: 'ImTree',
  props: {
    url: {
      type: String,
      default: ''
    },
    keyProps: {
      type: Object,
      default: () => ({})
      // {
      //   return {
      //     children: 'children',
      //     label: 'name'
      //   }
      // }
    },
    queryData: {
      type: Object,
      default: null
    },
    isTreeDialogLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedList: [],
      treeDataList: [],
      defaultCheckedKeys: [],
      defaultKeyProps: {
        children: 'children',
        label: 'name'
      },
      linkId: null
      // loading: this.isTreeDialogLoading
    }
  },

  computed: {
    loading() {
      if (this.isTreeDialogLoading) {
        this.load()
      }
      return this.isTreeDialogLoading
    },
    mergedKeyProps() {
      return {
        ...this.defaultKeyProps,
        ...this.keyProps
      }
    }
  },

  watch: {
    // not work
    loading(val) {
      if (val) {
        this.load()
      }
    }
    // isTreeDialogLoading: {
    //   immediate: true,
    //   handler: (val, vm) => {
    //     if (val) {
    //       console.log('will loading data')
    //       vm.load()
    //     }
    //   }
    // }
  },

  methods: {
    load() {
      const params = Object.assign({}, this.queryData)
      commonAPI.Post(this.url, params).then(res => {
        this.treeDataList = res.data.allData
        this.defaultCheckedKeys = res.data.data
      })
    },
    handleCheckChange(currentNode, selected, childHasSelected) {
      const selection = this.$refs.tree.getCheckedNodes()
      this.selectedList = selection
    },
    getSelection() {
      return this.selectedList
    },

    close() {
      this.defaultCheckedKeys = []
      this.selectedList = []
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style>

</style>
