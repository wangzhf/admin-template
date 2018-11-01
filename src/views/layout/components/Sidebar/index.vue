<template>
  <div>
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        active-text-color="#409EFF"
      >
        <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from '../Logo'
import _ from 'lodash'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // 如果是后端配置的路由，前端并未配置国际化内容，所以需要根据菜单的menuCode生成
    const messages = this.$i18n.messages
    this.handleRouter(this.permission_routers, messages)
    // refer: https://kazupon.github.io/vue-i18n/api/#methods
    this.$i18n.mergeLocaleMessage('zh', messages.zh)
    this.$i18n.mergeLocaleMessage('en', messages.en)
  },
  methods: {
    handleRouter(routers, messages) {
      routers.forEach(item => {
        const name = item.name
        const title = item.meta ? item.meta.title : null
        if (name && title && !messages.en.route[title]) {
          messages.en.route[title] = _.startCase(title)
          messages.zh.route[title] = name
        }
        if (item.children && item.children.length > 0) {
          this.handleRouter(item.children, messages)
        }
      })
    }
  }
}
</script>
