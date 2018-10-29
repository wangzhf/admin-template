<template>
  <div class="content-container">
    <table-template v-if="pageType == 0" />
    <tree-template v-else-if="pageType == 1" />
    <error-template v-else />
  </div>
</template>

<script>
import TableTemplate from './Table'
import TreeTemplate from './Tree'
import ErrorTemplate from './Error'
import commonAPI from '@/api/common'

export default {
  name: 'CommonTemplate',

  components: {
    TableTemplate,
    TreeTemplate,
    ErrorTemplate
  },

  data() {
    return {
      // 页面类型
      pageType: null
    }
  },

  created() {
    this.loadPageConfig()
  },

  methods: {
    // 加载页面配置
    loadPageConfig() {
      commonAPI.Get('/template/page/user').then(res => {
        this.pageType = res.data.pageType
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>
