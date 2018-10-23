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
          v-if="resourceTree"
          ref="resourceTree"
          :data="resourceTree"
          :render-content="renderContent"
          :props="defaultProps"
          :default-expanded-keys="defaultExpandIds"
          :filter-node-method="filterNode"
          show-checkbox
          highlight-current
          node-key="id"
          clearable
          class="resource-tree"
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
                  :tree-data="resourceTree"
                  :prop-names="defaultProps"
                  v-model="form.parentId"
                  clearable
                  placeholder="请选择父级" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="名称">
                <el-input v-model="form.name" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="代码">
                <el-input v-model="form.code" auto-complete="off" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="类型">
                <el-radio v-model="form.type" :label="1" class="radio">菜单</el-radio>
                <el-radio v-model="form.type" :label="2" class="radio">按钮</el-radio>
                <el-radio v-model="form.type" :label="3" class="radio">功能</el-radio>
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
  </div>
</template>

<script>
import selectTree from '@/components/Tree/selectTree.vue'
import treeter from '@/components/Tree/treeter'
import merge from 'element-ui/src/utils/merge'
import * as resourceAPI from '@/api/system/resource'

export default {
  name: 'ResourceManager',

  components: {
    'el-select-tree': selectTree
  },
  mixins: [treeter],
  data() {
    return {
      filterText: '',
      formLabelWidth: '100px',
      defaultExpandIds: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      resourceTree: [],
      maxId: 700000,
      form: {
        id: null,
        parentId: null,
        name: '',
        code: '',
        type: 1,
        sort: 0,
        usable: '1',
        remarks: ''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.resourceTree.filter(val)
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
        name: '',
        code: '',
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
      const params = { resId: this.form.id }
      resourceAPI.deleteResource(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        const tmp = merge([], this.resourceTree)
        this.deleteFromTree(tmp, this.form.id)
        this.resourceTree = tmp
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
      var checkKeys = this.$refs.resourceTree.getCheckedKeys()
      if (checkKeys == null || checkKeys.length <= 0) {
        this.$message.warning('请选择要删除的资源')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { resIds: checkKeys.join(',') }
        resourceAPI.batchDeleteResource(params).then(res => {
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
        resourceAPI.addResource(this.form).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.form.id = res.data.id
          const tmp = merge([], this.resourceTree)
          this.appendTreeNode(tmp, res.data)
          this.resourceTree = tmp
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      } else {
        resourceAPI.updateResource(this.form).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          const tmp = merge([], this.resourceTree)
          this.updateTreeNode(tmp, this.form)
          this.resourceTree = tmp
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
      resourceAPI.listResource().then(res => {
        console.log(res)
        this.resourceTree = []
        this.resourceTree.push(...res.data)
      })
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

  .resource-tree {
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

    .el-tree-node__content>.el-tree-node__expand-icon {
      font-size: 20px;
    }
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
