<template>
  <div class="content-container">
    <el-row style="margin-left: 10px;">
      <el-button type="primary" @click="newAdd" v-text="'新增'" />
      <el-button type="danger" @click="batchDelete" v-text="'删除'" />
    </el-row>
    <el-row slot="body" :gutter="24" class="tree-area">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          v-if="menuTree"
          ref="menuTree"
          :data="menuTree"
          :render-content="renderContent"
          :props="defaultProps"
          :default-expanded-keys="defaultExpandIds"
          :filter-node-method="filterNode"
          show-checkbox
          highlight-current
          node-key="id"
          clearable
          class="menu-tree"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div class="text item">
            <el-form ref="form" :model="form">
              <el-form-item :label-width="formLabelWidth" label="父级">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
                <el-select-tree
                  :tree-data="menuTree"
                  :prop-names="defaultProps"
                  v-model="form.parentId"
                  clearable
                  placeholder="请选择父级" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="菜单名称">
                <el-input v-model="form.menuName" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="英文名称">
                <el-input v-model="form.menuCode" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="类型">
                <el-radio v-model="form.type" label="menu" class="radio">菜单</el-radio>
                <el-radio v-model="form.type" label="button" class="radio">按钮</el-radio>
                <el-radio v-model="form.type" label="action" class="radio">功能</el-radio>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="图标">
                <svg-icon :icon-class="form.icon" />
                <el-button type="text" @click="selectIconDialog=true">选择</el-button>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="URI">
                <el-input v-model="form.path" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="组件路径">
                <el-input v-model="form.component" auto-complete="off">
                  <template slot="prepend">@/views</template>
                </el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="是否生效">
                <el-radio v-model="form.usable" class="radio" label="1">是</el-radio>
                <el-radio v-model="form.usable" class="radio" label="0">否</el-radio>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="排序">
                <el-slider v-model="form.sort" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="备注">
                <el-input v-model="form.remarks" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="">
                <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'" />
                <el-button v-show="form.id && form.id!=null" icon="delete" type="danger" @click="deleteSelected">删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 选择图标 -->
    <el-dialog v-el-drag-dialog :visible.sync="selectIconDialog" :close-on-click-modal="false" title="选择图标">
      <icon-selector
        ref="iconSelector"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="selectIconDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSelectIcon">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from '@/components/Tree/selectTree.vue'
import treeter from '@/components/Tree/treeter'
import merge from 'element-ui/src/utils/merge'
import * as menuAPI from '@/api/system/menu'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import IconSelector from '@/components/FAIcon/IconSelector'

export default {
  name: 'MenuManager',
  directives: { elDragDialog },
  components: {
    'el-select-tree': selectTree,
    'icon-selector': IconSelector
  },
  mixins: [treeter],
  data() {
    return {
      filterText: '',
      formLabelWidth: '100px',
      defaultExpandIds: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        id: 'id'
      },
      menuTree: [],
      maxId: 700000,
      form: {
        id: null,
        parentId: null,
        menuName: '',
        menuCode: '',
        uri: '',
        icon: '',
        component: '',
        type: 1,
        sort: 0,
        usable: '1',
        remarks: ''
      },
      // 选择图标
      selectIconDialog: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.load()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    newAdd() {
      this.form = {
        id: null,
        parentId: null,
        menuName: '',
        menuCode: '',
        uri: '',
        icon: '',
        component: '',
        type: 1,
        sort: 0,
        usable: '1',
        remarks: ''
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
        </span>)
    },
    deleteSelected() {
      const params = { id: this.form.id }
      menuAPI.deleteMenu(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        const tmp = merge([], this.menuTree)
        this.deleteFromTree(tmp, this.form.id)
        this.menuTree = tmp
        this.newAdd()
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      })
    },
    batchDelete() {
      var checkKeys = this.$refs.menuTree.getCheckedKeys()
      console.log('check keys: ')
      console.log(checkKeys)
      if (checkKeys == null || checkKeys.length <= 0) {
        this.$message.warning('请选择要删除的资源')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { ids: checkKeys.join(',') }
        menuAPI.batchDeleteMenu(params).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.load()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
          console.log(checkKeys)
          console.log(err)
        })
      })
    },
    handleNodeClick(data) {
      this.form = merge({}, data)
    },
    onSubmit() {
      if (this.form.id == null) {
        menuAPI.addMenu(this.form).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.form.id = res.data.id
          const tmp = merge([], this.menuTree)
          this.appendTreeNode(tmp, res.data)
          this.menuTree = tmp
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      } else {
        menuAPI.updateMenu(this.form).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          const tmp = merge([], this.menuTree)
          this.updateTreeNode(tmp, this.form)
          this.menuTree = tmp
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      }
    },
    load() {
      menuAPI.listMenu().then(res => {
        console.log(res)
        this.menuTree = []
        this.menuTree.push(...res.data)
      })
    },
    handleSelectIcon() {
      const selectedClassName = this.$refs.iconSelector.getSelectedClassName()
      this.form.icon = selectedClassName
      this.selectIconDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-area {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 10px;
  font-size: 14px;

  .menu-tree {
    margin-top: 10px;
    height: 384px;
    overflow-y: auto;
  }

  .el-tree {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    padding: 10px 0;
    border-radius: 4px;

  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
