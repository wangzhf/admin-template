<template>
  <div class="content-container">
    <table-template v-if="pageType == 0" :page-data="pageData" />
    <tree-template v-else-if="pageType == 1" />
    <!-- <error-template v-else /> -->
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
      pageType: null,
      pageData: {}
    }
  },

  created() {
    this.loadPageConfig()
  },

  methods: {
    // 加载页面配置
    loadPageConfig() {
      const pageType = this.getPageType()
      const params = {
        pageType
      }
      commonAPI.Get('/template/page/user', params).then(res => {
        console.log(res)
        this.pageType = res.data.pageType
        this.pageData = res.data.pageData
        console.log(this.$store.state.tagsView.visitedViews)
        console.log(this.$route.path)
      }).catch(err => {
        console.log(err)
      })
    },
    getPageType() {
      const path = this.$route.path
      const arr = path.split('/')
      return arr[arr.length - 1]
    }
  }
}
</script>

<style>

</style>
