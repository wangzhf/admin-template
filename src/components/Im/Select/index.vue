<template>
  <el-select v-model="selectedVal" placeholder="请选择" clearable @change="handleSelectionChange">
    <el-option
      v-for="item in dataList"
      :key="getNodeKey(item)"
      :label="getNodeLabel(item)"
      :value="getNodeValue(item)"
    />
  </el-select>
</template>

<script>
import commonAPI from '@/api/common'

export default {
  name: 'ImSelect',

  props: {
    keyProps: {
      type: Object,
      default: () => ({})
      // {
      //   return {
      //     // 唯一key
      //     key: 'value',
      //     // 显示
      //     label: 'label',
      //     // 需要获取的值
      //     value: 'value',
      //     // 依赖项参数名称, 用于请求加载
      //     pid: 'pid'
      //   }
      // }
    },
    // 依赖的值，可依赖多个，用于级联
    dependonKey: {
      type: String,
      default: null
    },
    dependonValue: {
      type: String,
      default: null
    },
    // 加载数据的url
    url: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      selectedVal: '',
      dataList: [],
      defaultKeyProps: {
        // 唯一key
        key: 'value',
        // 显示
        label: 'label',
        // 需要获取的值
        value: 'value',
        // 依赖项参数名称, 用于请求加载
        pid: 'pid'
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
    dependonValue(val) {
      this.selectedVal = ''
      this.$emit('select-change', '')
      if (val) {
        this.load()
      }
    }
  },

  created() {
    if (!this.dependonKey) {
      this.load()
    }
  },

  methods: {
    getNodeKey(item) {
      return item[this.mergedKeyProps.key]
    },
    getNodeLabel(item) {
      return item[this.mergedKeyProps.label]
    },
    getNodeValue(item) {
      return item[this.mergedKeyProps.value]
    },

    handleSelectionChange(val) {
      this.$emit('select-change', val)
    },

    load() {
      const params = {}
      if (this.dependonKey && this.dependonValue) {
        params[this.mergedKeyProps.pid] = this.dependonValue
      }
      commonAPI.Post(this.url, params).then(res => {
        this.dataList = res.data
      })
    }
  }
}
</script>

<style>

</style>
