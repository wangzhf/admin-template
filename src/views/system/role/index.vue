<template>
  <div class="content-container">
    <el-form ref="form" :inline="true" :model="roleInfo" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="角色姓名">
            <el-input v-model="roleInfo.roleName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色代码">
            <el-input v-model="roleInfo.roleCode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button :disabled="disabledBatchBtn" type="primary" @click="batchDelete">批量删除</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="roleList"
      :border="true"
      :highlight-current-row="true"
      tooltip-effect="dark"
      class="tab-container"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="roleName" label="角色名称" sortable />
      <el-table-column prop="roleCode" label="角色代码" sortable />
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleConfigMenu(scope.$index, scope.row)">关联菜单</el-button>
          <el-button
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="float: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--编辑界面-->
    <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="姓名" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="editForm.roleCode" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="姓名" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="addForm.roleCode" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!-- 配置菜单界面 -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" title="配置角色菜单">
      <div class="select-tree">
        <el-scrollbar
          tag="div"
          class="is-empty"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list">
          <el-tree
            ref="menuTree"
            :data="menuTreeList"
            :props="menuProps"
            :check-on-click-node="true"
            :default-expanded-keys="roleMenus"
            :default-checked-keys="roleMenus"
            node-key="id"
            show-checkbox
          />
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configRoleMenus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, editRole, deleteRole, addRole, batchDeleteRole, listRoleMenus, addRoleMenu } from '@/api/system/role'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

export default {
  name: 'RoleManager',
  directives: { elDragDialog },
  data() {
    return {
      roleInfo: {
        roleName: '',
        roleCode: ''
      },
      roleList: [],
      multipleSelection: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,

      // 编辑界面是否显示
      editFormVisible: false,
      editFormRules: {
        roleName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        roleName: '',
        roleCode: ''
      },

      // 新增界面是否显示
      addFormVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        roleName: '',
        roleCode: ''
      },

      // 配置角色
      dialogVisible: false,
      menuTreeList: [],
      menuProps: {
        children: 'children',
        label: 'menuName'
      },
      roleMenus: [],
      roleMenuId: null
    }
  },
  computed: {
    disabledBatchBtn() {
      return this.multipleSelection.length === 0
    }
  },
  created() {
    this.getRole()
  },
  methods: {
    search() {
      this.getRole()
    },
    getRole() {
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        roleName: this.roleInfo.roleName,
        roleCode: this.roleInfo.roleCode
      }
      getRoleList(param).then((res) => {
        this.roleList = res.data.roles
        this.total = res.data.total
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const param = { id: row.id }
        deleteRole(param).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getRole()
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRole()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRole()
    },
    // 新增
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        roleName: '',
        roleCode: ''
      }
    },
    // 编辑
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const param = Object.assign({}, this.editForm)
            editRole(param).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getRole()
            })
          })
        }
      })
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const param = Object.assign({}, this.addForm)
            addRole(param).then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getRole()
            })
          })
        }
      })
    },
    // 批量删除
    batchDelete() {
      const ids = this.multipleSelection.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const param = { ids: ids }
        batchDeleteRole(param).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getRole()
        })
      })
    },
    reset() {
      this.roleInfo.roleName = ''
      this.roleInfo.roleCode = ''
    },
    handleConfigMenu(index, row) {
      this.roleMenuId = row.id
      const param = {
        id: row.id
      }
      listRoleMenus(param).then(res => {
        this.menuTreeList = res.data.allMenus
        this.roleMenus = res.data.menus
        this.dialogVisible = true
      })
    },
    configRoleMenus() {
      const selectedMenus = this.$refs.menuTree.getCheckedKeys()
      const params = {
        id: this.roleMenuId,
        menus: selectedMenus
      }
      addRoleMenu(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.dialogVisible = false
        this.roleMenuId = null
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
</style>
