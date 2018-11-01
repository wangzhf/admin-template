<template>
  <div class="content-container">
    <el-row>
      <el-form v-if="pageData && pageData.searchArea && pageData.searchArea.columns && pageData.searchArea.columns.length > 0" ref="searchForm" :inline="true" label-width="80px">
        <el-col v-for="searchItem in pageData.searchArea.columns" :key="searchItem.field" :span="8">
          <el-form-item :label="searchItem.title">
            <el-input v-if="searchItem.type == 'input'" v-model.trim="searchForm[searchItem.field]" clearable />

            <im-select
              v-if="searchItem.type == 'select'"
              :dependon-value="searchItem.dependon ? searchForm[searchItem.dependon] + '' : ''"
              :dependon-key="searchItem.dependon ? searchItem.dependon : ''"
              :key-props="searchItem.dependon ? searchItem.keyProps : null"
              :url="searchItem.url"
              @select-change="(val) => $set(searchForm, searchItem.field, val)"
            />

            <im-el-select-tree
              v-if="searchItem.type == 'selectTree'"
              :url="searchItem.url"
              @select-change="(val) => $set(searchForm, searchItem.field, val)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-col :span="24">
      <el-button-group>
        <span v-for="action in pageData.actions" v-if="action.place == 'toolbar'" :key="action.name">
          <el-button
            v-if="action.type == 'addDialog'"
            :type="action.theme ? action.theme : ''"
            :icon="action.icon ? action.icon : ''"
            @click="handleAdd(action.name)"
          >{{ action.title }}</el-button>
          <el-button
            v-else-if="action.type == 'deleteConfirm'"
            :type="action.theme ? action.theme : ''"
            :icon="action.icon ? action.icon : ''"
            :disabled="disabledBatchBtn"
            @click="batchDelete(action.dialog.confirmUrl)"
          >{{ action.title }}</el-button>
        </span>
        <el-button v-if="needExpand" :icon="expandBtn.icon" type="primary" @click="handleChildExpand">{{ expandBtn.text }}</el-button>
      </el-button-group>
    </el-col>

    <el-table
      ref="multipleTable"
      :data="list"
      :border="true"
      :highlight-current-row="true"
      :expand-row-keys="expandRowKeys"
      row-key="id"
      tooltip-effect="dark"
      class="tab-container"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @expand-change="handleRowChange"
    >
      <el-table-column v-if="needExpand" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="child-table-expand">
            <!-- 遍历显示子列 -->
            <el-form-item
              v-for="childColumn in pageData.table.childColumns"
              :key="childColumn.field"
              :span="childColumnWidth"
              :label="childColumn.title"
            >
              <span v-text="props.row[childColumn.field]" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" align="center" label="序号" />
      <!-- 遍历显示普通列 -->
      <el-table-column
        v-for="column in pageData.table.columns"
        :key="column.field"
        :prop="column.field"
        :label="column.title"
        header-align="center"
        sortable
      />
      <el-table-column v-if="pageData.actions && pageData.actions.length > 0" align="center" label="操作" >
        <template slot-scope="scope">
          <span v-for="action in pageData.actions" v-if="action.place == 'tableCell'" :key="action.name" style="padding-left: 5px;">
            <el-button
              v-if="action.type == 'treeDialog'"
              :type="action.theme ? action.theme : ''"
              :icon="action.icon ? action.icon : ''"
              :class="action.mini ? 'mini-btn-style' : ''"
              @click.stop="handleDialogVisible(scope.$index, scope.row, action.name)"
            >{{ action.mini ? '' : action.title }}</el-button>
            <el-button
              v-else-if="action.type == 'tableDialog'"
              :type="action.theme ? action.theme : ''"
              :icon="action.icon ? action.icon : ''"
              :class="action.mini ? 'mini-btn-style' : ''"
              @click.stop="handleDialogVisible(scope.$index, scope.row, action.name)"
            >{{ action.mini ? '' : action.title }}</el-button>
            <el-button
              v-else-if="action.type == 'editDialog'"
              :type="action.theme ? action.theme : ''"
              :icon="action.icon ? action.icon : ''"
              :class="action.mini ? 'mini-btn-style' : ''"
              @click.stop="handleEdit(scope.$index, scope.row, action.name)"
            >{{ action.mini ? '' : action.title }}</el-button>
            <el-button
              v-else-if="action.type == 'deleteConfirm'"
              :type="action.theme ? action.theme : ''"
              :icon="action.icon ? action.icon : ''"
              :class="action.mini ? 'mini-btn-style' : ''"
              @click.stop="handleDelete(scope.$index, scope.row, action.name, action.dialog.confirmUrl)"
            >{{ action.mini ? '' : action.title }}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="float: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div v-for="action in pageData.actions" v-if="action.dialog" :key="action.name">
      <!-- form dialog -->
      <el-dialog
        v-el-drag-dialog
        v-if="action.dialog.type == 'form'"
        :visible.sync="action.dialog.visible"
        :close-on-click-modal="false"
        :title="action.dialog.title"
      >
        <el-form
          v-if="action.dialog.columns && action.dialog.columns.length > 0"
          :ref="action.name + 'Form'"
          :model="action.dialog.formData"
          :rules="action.dialog.formRules"
          label-width="80px"
        >
          <el-form-item v-for="item in action.dialog.columns" :key="item.field" :label="item.title" :prop="item.field">
            <el-input
              v-if="item.type == 'input'"
              v-model="action.dialog.formData[item.field]"
              auto-complete="off"
            />
            <el-radio-group v-else-if="item.type == 'radio'" v-model="action.dialog.formData[item.field]">
              <el-radio v-for="option in item.options" :key="option.value" :label="option.value" class="radio">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-input-number
              v-else-if="item.type == 'number'"
              v-model="action.dialog.formData[item.field]"
              :min="item.option.min"
              :max="item.option.max"
            />
            <el-date-picker
              v-else-if="item.type == 'date'"
              v-model="action.dialog.formData[item.field]"
              :type="item.type"
              placeholder="选择日期"
            />
            <el-input
              v-else-if="item.type == 'textarea'"
              v-model="action.dialog.formData[item.field]"
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="action.dialog.visible = false; $refs[action.name + 'Form'][0].resetFields();">取消</el-button>
          <el-button type="primary" @click.native="formDialogSubmit(action.name)">提交</el-button>
        </div>
      </el-dialog>

      <!-- tree dialog -->
      <el-dialog
        v-el-drag-dialog
        v-if="action.dialog.type == 'tree'"
        :visible.sync="action.dialog.visible"
        :close-on-click-modal="false"
        :title="action.dialog.title"
      >
        <im-tree
          :ref="action.name + 'TreeDialog'"
          :query-data="action.dialog.queryData"
          :is-tree-dialog-loading="action.dialog.loading"
          :key-props="action.dialog.keyProps"
          :url="action.dialog.listUrl"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="action.dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm(action.name, action.name + 'TreeDialog')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- table dialog -->
      <el-dialog
        v-el-drag-dialog
        v-if="action.dialog.type == 'table'"
        :visible.sync="action.dialog.visible"
        :close-on-click-modal="false"
        :title="action.dialog.title"
      >
        <im-table
          :ref="action.name + 'TableDialog'"
          :should-loading="action.dialog.loading"
          :table-columns="action.dialog.columnProps"
          :url="action.dialog.listUrl"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="action.dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm(action.name, action.name + 'TableDialog')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import ImSelect from '@/components/Im/Select'
import commonAPI from '@/api/common'
import selectTree from '@/components/Im/SelectTree'
import ImTree from '@/components/Im/Tree'
import ImTable from '@/components/Im/Table'
// import treeter from '@/components/Tree/treeter'

export default {
  name: 'Table',
  directives: { elDragDialog },
  components: {
    ImSelect,
    'im-el-select-tree': selectTree,
    ImTree,
    ImTable
  },
  props: {
    // 页面配置数据
    pageData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 列表集合
      list: [],
      searchForm: {},

      // 列表默认展开的keys
      expandRowKeys: [],
      childColumnWidth: 4,

      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10,

      // 是否需要子表格
      needExpand: this.pageData.table && this.pageData.table.childColumns && this.pageData.table.childColumns.length > 0,

      // 记录多选记录
      multipleSelection: [],
      searchLoading: false
    }
  },

  computed: {
    disabledBatchBtn() {
      return this.multipleSelection.length === 0
    },
    expandBtn() {
      let text = ''
      let icon = ''
      if (this.expandRowKeys && this.expandRowKeys.length > 0) {
        text = '关闭所有行'
        icon = 'el-icon-arrow-down'
      } else {
        text = '展开所有行'
        icon = 'el-icon-arrow-right'
      }
      return {
        text,
        icon
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    // load the list.
    handleSearch() {
      this.searchLoading = true
      this.load()
    },
    load() {
      const params = {
        ...this.searchForm,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      const searchUrl = this.pageData.searchArea.url
      commonAPI.Post(searchUrl, params).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.searchLoading = false
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '数据加载失败，请稍后重试'
        })
        this.searchLoading = false
      })
    },
    handleAdd(type) {
      const actions = this.pageData.actions
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          const dialog = action.dialog
          if (dialog && dialog.title) {
            if (dialog.type === 'form' && action.name === type) {
              dialog.visible = true
            }
          }
        })
      }
    },
    handleEdit(index, row, type) {
      const actions = this.pageData.actions
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          const dialog = action.dialog
          if (dialog && dialog.title) {
            if (dialog.type === 'form' && action.name === type) {
              dialog.formData = Object.assign({}, row)
              dialog.visible = true
            }
          }
        })
      }
    },
    handleDelete(index, row, type, url) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        commonAPI.Post(url, { id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.load()
        })
      }).catch(() => {
        // cancel
      })
    },
    // 批量删除
    batchDelete(url) {
      const ids = this.multipleSelection.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        commonAPI.Post(url, { ids: ids }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        this.load()
      }).catch(() => {
        // ... cancel
      })
    },

    // other event
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRowClick(row) {
      if (this.needExpand) {
        this.$refs.multipleTable.toggleRowExpansion(row)
      }
    },
    handleRowChange(row, expandedRows) {
      if (expandedRows.length > 0) {
        this.expandRowKeys = expandedRows.map(function(val) {
          return val.id
        })
      } else {
        this.expandRowKeys = []
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.load()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.load()
    },
    // 展开子表格
    handleChildExpand() {
      if (this.expandRowKeys.length > 0) {
        this.expandRowKeys = []
      } else {
        if (this.list && this.list.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.expandRowKeys.push(this.list[i].id)
          }
        }
      }
    },
    // 编辑提交
    formDialogSubmit(type) {
      const actions = this.pageData.actions
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          const dialog = action.dialog
          if (dialog && dialog.title) {
            if (dialog.type === 'form' && action.name === type) {
              const form = action.name + 'Form'
              this.$refs[form][0].validate(valid => {
                if (valid) {
                  this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    const param = Object.assign({}, dialog.formData)
                    commonAPI.Post(dialog.confirmUrl, param).then(res => {
                      this.$message({
                        type: 'success',
                        message: '操作成功'
                      })
                      this.$refs[form][0].resetFields()
                      dialog.visible = false
                      this.load()
                    })
                  }).catch(() => {
                    // cancel
                  })
                }
              })
            }
          }
        })
      }
    },
    // dialog 显示
    handleDialogVisible(index, row, type) {
      const actions = this.pageData.actions
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          const dialog = action.dialog
          if (dialog && dialog.title) {
            if (action.name === type) {
              dialog.linkId = row.id
              const param = {
                id: row.id
              }
              dialog.queryData = param
              dialog.loading = true
              dialog.visible = true
            }
          }
        })
      }
    },
    // dialog 确认事件
    handleDialogConfirm(type, ref) {
      const checkedKeys = this.$refs[ref][0].getSelection().map(item => {
        return item.id
      })

      const actions = this.pageData.actions
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          const dialog = action.dialog
          if (dialog && dialog.title) {
            if (action.name === type) {
              const params = {
                id: dialog.linkId,
                data: checkedKeys
              }
              commonAPI.Post(dialog.confirmUrl, params).then(res => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                dialog.visible = false
                dialog.linkId = null
                dialog.loading = false
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-container{
  margin-top: 20px;
}
.page-block {
  padding-right: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
  height: 100px;

}
.child-table-expand {
  font-size: 0;
}
.child-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.child-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.mini-btn-style {
  /deep/ span {
    margin-left: 0px;
  }
}
</style>
