<template>
  <div class="content-container">
    <el-row>
      <el-form v-if="pageData && pageData.searchArea && pageData.searchArea.length > 0" ref="searchForm" :inline="true" label-width="100px">
        <el-col v-for="searchItem in pageData.searchArea" :key="searchItem.field" :span="8">
          <el-form-item :label="searchItem.title">
            <el-input v-if="searchItem.type == 'input'" v-model.trim="searchForm[searchItem.field]" clearable />

            <im-select
              v-if="searchItem.type == 'select'"
              :dependon-value="searchItem.dependon ? searchForm[searchItem.dependon] + '' : ''"
              :dependon-key="searchItem.dependon ? searchItem.dependon : ''"
              :key-props="searchItem.dependon ? searchItem.keyProps : null"
              :url="searchItem.url"
              @select-change="(val) => searchForm[searchItem.field] = val"
            />

            <im-el-select-tree
              v-if="searchItem.type == 'selectTree'"
              :url="searchItem.url"
              @select-change="(val) => searchForm[searchItem.field] = val"
            />
          </el-form-item>
        </el-col>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form>
    </el-row>
    <el-col :span="24">
      <el-button-group>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
        <el-button :disabled="disabledBatchBtn" icon="el-icon-delete" type="primary" @click="batchDelete">批量删除</el-button>
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
      <el-table-column type="index" label="序号" />
      <!-- 遍历显示普通列 -->
      <el-table-column
        v-for="column in pageData.table.columns"
        :key="column.field"
        :prop="column.field"
        :label="column.title"
        sortable
      />
      <el-table-column v-if="pageData.actions && pageData.actions.length > 0" label="操作" >
        <template slot-scope="scope">
          <el-button
            v-if="hasAction('treeDialog')"
            @click.stop="handleTreeDialog(scope.$index, scope.row)"
          >{{ getAction('treeDialog').title }}</el-button>
          <el-button
            v-if="hasAction('tableDialog')"
            @click.stop="handleTableDialog(scope.$index, scope.row)"
          >{{ getAction('tableDialog').title }}</el-button>
          <el-button
            v-if="hasAction('editDialog')"
            @click.stop="handleEdit(scope.$index, scope.row)"
          >{{ getAction('editDialog').title }}</el-button>
          <el-button
            v-if="hasAction('deleteDialog')"
            @click.stop="handleDelete(scope.$index, scope.row)"
          >{{ getAction('deleteDialog').title }}</el-button>
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

    <div v-for="dialog in pageData.dialogs" :key="dialog.name">
      <!-- form dialog -->
      <el-dialog
        v-el-drag-dialog
        v-if="dialog.type == 'form'"
        :visible.sync="dialog[dialog.name + 'FormVisible']"
        :close-on-click-modal="false"
        :title="dialog.title"
      >
        <el-form
          v-if="dialog.columns && dialog.columns.length > 0"
          :ref="dialog.name + 'Form'"
          :model="dialog[dialog.name + 'Form']"
          :rules="dialog[dialog.name + 'FormRules']"
          label-width="80px"
        >
          <el-form-item v-for="item in dialog.columns" :key="item.field" :label="item.title" :prop="item.field">
            <el-input
              v-if="item.type == 'input'"
              v-model="dialog[dialog.name + 'Form'][item.field]"
              auto-complete="off"
            />
            <el-radio-group v-else-if="item.type == 'radio'" v-model="dialog[dialog.name + 'Form'][item.field]">
              <el-radio v-for="option in item.options" :key="option.value" :label="option.value" class="radio">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-input-number
              v-else-if="item.type == 'number'"
              v-model="dialog[dialog.name + 'Form'][item.field]"
              :min="item.option.min"
              :max="item.option.max"
            />
            <el-date-picker
              v-else-if="item.type == 'date'"
              v-model="dialog[dialog.name + 'Form'][item.field]"
              :type="item.type"
              placeholder="选择日期"
            />
            <el-input
              v-else-if="item.type == 'textarea'"
              v-model="dialog[dialog.name + 'Form'].address"
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialog[dialog.name + 'FormVisible'] = false">取消</el-button>
          <el-button type="primary" @click.native="formDialogSubmit(dialog.name)">提交</el-button>
        </div>
      </el-dialog>

      <!-- tree dialog -->
      <el-dialog
        v-el-drag-dialog
        v-if="dialog.type == 'tree'"
        :visible.sync="dialog[dialog.name + 'FormVisible']"
        :close-on-click-modal="false"
        :title="dialog.title"
      >
        <im-tree
          :ref="dialog.name + 'treeDialog'"
          :query-data="dialog.queryData"
          :is-tree-dialog-loading="dialog.loading"
          :key-props="dialog.keyProps"
          url="/user/role"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="dialog[dialog.name + 'FormVisible'] = false">取 消</el-button>
          <el-button type="primary" @click="handleTreeDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>

    </div>

    <!-- table dialog -->
    <el-dialog v-el-drag-dialog :visible.sync="tableDialogVisible" :close-on-click-modal="false" title="用户列表">
      <im-table
        ref="tableDialog"
        :should-loading="shouldLoading"
        :table-columns="tableDialogColumns"
        url="/user/userList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="tableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTableDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
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

// 定义请求链接地址
const AddUrl = '/user/add'
const UpdateUrl = '/user/edit'
const DeleteUrl = '/user/delete'
const BatchDeleteUrl = '/user/batchDelete'
const SearchUrl = '/user/userList'
// const listTreeDataUrl = '/user/role'
const addTreeDataUrl = '/user/role/add'
const addTableDataUrl = '/user/add'

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
      searchForm: {
        userName: '',
        userCode: '',
        province: null,
        city: null,
        menuId: null
      },
      // 关联下拉被依赖项参数(请求参数名)
      cityKeyProps: {
        pid: 'pid'
      },

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

      // tree dialog
      treeDialogVisible: false,
      treeDataList: [],
      treeProps: {
        children: 'children',
        label: 'roleName'
      },
      defaultCheckedKeys: [],
      // 当前选中行ID
      linkId: null,

      // table dialog
      tableDialogVisible: false,
      shouldLoading: false,
      tableLinkId: null,
      // table dialog中column显示列
      tableDialogColumns: [
        {
          propName: 'userName',
          label: '姓名'
        },
        {
          propName: 'userCode',
          label: '代码'
        }
      ]
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
      this.load()
    },
    load() {
      const params = {
        userName: this.searchForm.userName,
        userCode: this.searchForm.userCode,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      commonAPI.Post(SearchUrl, params).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '数据加载失败，请稍后重试'
        })
      })
    },
    handleAdd() {
      const data = this.pageData
      data.dialogs.forEach(item => {
        if (item.type === 'form' && item.name === 'add') {
          item[item.name + 'FormVisible'] = true
        }
      })
    },
    handleEdit(index, row) {
      const data = this.pageData
      data.dialogs.forEach(item => {
        if (item.type === 'form' && item.name === 'edit') {
          item[item.name + 'Form'] = Object.assign({}, row)
          item[item.name + 'FormVisible'] = true
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        commonAPI.Post(DeleteUrl, { id: row.id }).then(res => {
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
    batchDelete() {
      const ids = this.multipleSelection.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        commonAPI.Get(BatchDeleteUrl, { ids: ids }).then(res => {
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
      let requestUrl = UpdateUrl
      if (type === 'add') {
        requestUrl = AddUrl
      }
      this.pageData.dialogs.forEach(item => {
        if (item.type === 'form' && item.name === type) {
          const form = item.name + 'Form'
          this.$refs[form][0].validate(valid => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                const param = Object.assign({}, item[form])
                commonAPI.Post(requestUrl, param).then(res => {
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  this.$refs[form][0].resetFields()
                  item[item.name + 'FormVisible'] = false
                  this.load()
                })
              }).catch(() => {
                // cancel
              })
            }
          })
        }
      })
    },
    // tree dialog 显示
    handleTreeDialog(index, row) {
      this.linkId = row.id
      const param = {
        id: row.id
      }
      this.treeDialogQueryData = param
      this.isTreeDialogLoading = true
      this.treeDialogVisible = true
    },
    // tree dialog 确认事件
    handleTreeDialogConfirm() {
      const checkedKeys = this.$refs.treeDialog.getSelection().map(item => {
        return item.id
      })
      const params = {
        id: this.linkId,
        data: checkedKeys
      }
      commonAPI.Post(addTreeDataUrl, params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.treeDialogVisible = false
        this.linkId = null
      })
    },

    // table dialog
    handleTableDialog(index, row) {
      this.tableLinkId = row.id
      this.tableDialogVisible = true
      this.shouldLoading = true
    },
    handleTableDialogConfirm() {
      const selection = this.$refs.tableDialog.getSelection()
      console.log(selection)
      const params = {
        id: this.tableLinkId,
        keys: selection.map(item => {
          return item.id
        })
      }
      commonAPI.Post(addTableDataUrl, params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.tableDialogVisible = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
        console.log(err)
      })
    },
    hasAction(type) {
      const actions = this.pageData.actions
      return actions.some(item => {
        return item.type === type
      })
    },
    getAction(type) {
      const actions = this.pageData.actions
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].type === type) {
          return actions[i]
        }
      }
      return null
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
</style>
