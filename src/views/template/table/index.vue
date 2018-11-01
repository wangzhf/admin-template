<template>
  <div class="content-container">
    <el-row>
      <el-form ref="searchForm" :inline="true" label-width="100px">
        <el-col :span="8">
          <el-form-item label="用户姓名">
            <el-input v-model.trim="searchForm.userName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户代码">
            <el-input v-model.trim="searchForm.userCode" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省">
            <im-select
              url="/common/province/list"
              @select-change="(val) => searchForm.province = val"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="市">
            <im-select
              :dependon-value="searchForm.province + ''"
              :key-props="cityKeyProps"
              dependon-key="province"
              url="/common/city/list"
              @select-change="(val) => searchForm.city = val"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="菜单">
            <im-el-select-tree
              url="/menu/list"
              @select-change="(val) => searchForm.menuId = val"
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
            <el-form-item :span="childColumnWidth" label="性别">
              <span v-text="props.row.sex == 1 ? '男' : '女'"/>
            </el-form-item>
            <el-form-item :span="childColumnWidth" label="年龄">
              <span v-text="props.row.age" />
            </el-form-item>
            <el-form-item :span="childColumnWidth" label="生日">
              <span v-text="props.row.birthday" />
            </el-form-item>
            <el-form-item :span="childColumnWidth" label="地址">
              <span v-text="props.row.address" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="序号" />
      <el-table-column prop="userName" label="姓名" sortable />
      <el-table-column prop="userCode" label="代码" sortable />
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            @click.stop="handleTreeDialog(scope.$index, scope.row)">关联角色</el-button>
          <el-button
            @click.stop="handleTableDialog(scope.$index, scope.row)">表格dialog</el-button>
          <el-button
            @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="danger"
            @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!--编辑界面-->
    <el-dialog v-el-drag-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="editForm.userName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="editForm.userCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="1" class="radio">男</el-radio>
            <el-radio :label="0" class="radio">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200" />
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.address" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog v-el-drag-dialog :visible.sync="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="addForm.userCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio :label="1" class="radio">男</el-radio>
            <el-radio :label="0" class="radio">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200" />
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="addForm.birthday" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.address" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!-- tree dialog -->
    <el-dialog v-el-drag-dialog :visible.sync="treeDialogVisible" :close-on-click-modal="false" title="配置用户角色">
      <im-tree
        ref="treeDialog"
        :query-data="treeDialogQueryData"
        :is-tree-dialog-loading="isTreeDialogLoading"
        :key-props="treeProps"
        url="/user/role"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTreeDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

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
      needExpand: true,

      // 记录多选记录
      multipleSelection: [],

      // 编辑界面
      editFormVisible: false,
      editForm: {

      },
      editFormRules: {

      },

      // 新增界面
      addFormVisible: false,
      addForm: {

      },
      addFormRules: {

      },

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
      // treeDialog是否加载数据
      isTreeDialogLoading: false,
      treeDialogQueryData: null,

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
      this.addFormVisible = true
    },
    handleEdit(index, row) {
      this.editForm = Object.assign({}, row)
      this.editFormVisible = true
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
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const param = Object.assign({}, this.editForm)
            commonAPI.Post(UpdateUrl, param).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.load()
            })
          }).catch(() => {
            // cancel
          })
        }
      })
    },
    // 新增提交
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const param = Object.assign({}, this.addForm)
            commonAPI.Post(AddUrl, param).then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.load()
            })
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
