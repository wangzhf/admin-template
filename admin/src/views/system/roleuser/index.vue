<template>
  <div class="content-container">
    <el-row style="text-align: center;">
      <el-button type="primary" @click="handleAssignRole" v-text="'确认分配'" />
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="elColWidth" :xs="24" :sm="24" :md="elColWidth" :lg="elColWidth" class="content-area">
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form ref="form1" inline>
              <el-form-item label="用户">
                <el-input
                  v-model="userName"
                  placeholder="输入关键字进行过滤"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="loadUsers" v-text="'查找'" />
          </el-col>
          <el-col :span="2" style="margin-top: 6px;">
            <el-checkbox v-model="multiSelectUser">开启多选</el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-tree
              ref="userTree"
              :data="userList"
              :props="defaultProps"
              :check-on-click-node="true"
              node-key="id"
              show-checkbox
              @check-change="handleUserCheckChange"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="elColWidth" :xs="24" :sm="24" :md="elColWidth" :lg="elColWidth" class="content-area">
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form ref="form2" inline>
              <el-form-item label="角色">
                <el-input
                  placeholder="输入关键字进行过滤"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="loadRoles" v-text="'查找'" />
          </el-col>
          <el-col :span="2" style="margin-top: 6px;">
            <el-checkbox v-model="multiSelectRole">开启多选</el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table
              ref="roleTable"
              :data="roleList"
              :show-header="false"
              style="width: 100%"
              @row-click="handleTableRowClick"
              @selection-change="handleRoleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="roleName"
                label="角色名称"
              />
            </el-table>
          </el-col>
        </el-row>
        <el-row style="float: right; margin-top: 10px;">
          <el-pagination
            :total="roleTotal"
            :page-size="10"
            :current-page.sync="roleCurrentPage"
            layout="total, prev, pager, next"
            @size-change="handleRoleSizeChange"
            @current-change="handleRoleCurrentChange"
          />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserList, assignRole } from '@/api/system/user'
import { getRoleList } from '@/api/system/role'

export default {
  name: 'RoleUserManager',
  data() {
    return {
      userList: [],
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'userName'
      },
      userName: '',
      roleName: '',
      roleTotal: 0,
      roleCurrentPage: 1,
      rolePageSize: 10,
      resourceTotal: 0,
      total: 0,
      currentPage: 1,
      pageSize: 10,

      roleSelectionList: [],
      userSelectionList: [],
      multiSelectUser: true,
      multiSelectRole: false,

      elColWidth: 11
    }
  },
  watch: {
    multiSelectUser() {
      // 开启多选
      if (this.multiSelectUser) {
        this.$refs.roleTable.clearSelection()
      }
      this.multiSelectRole = !this.multiSelectUser
    },
    multiSelectRole() {
      // 关闭多选
      if (this.multiSelectRole) {
        const selectKeys = this.$refs.userTree.getCheckedKeys()
        for (let i = 0; i < selectKeys.length; i++) {
          this.$refs.userTree.setChecked(selectKeys[i], false, true)
        }
      }
      this.multiSelectUser = !this.multiSelectRole
    }
  },
  created() {
    this.loadUsers()
    this.loadRoles()
  },
  methods: {
    loadUsers() {
      const params = {
        userName: this.userName,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      getUserList(params).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    loadRoles() {
      const params = {
        roleName: this.roleName,
        currentPage: this.roleCurrentPage,
        pageSize: this.rolePageSize
      }
      getRoleList(params).then(res => {
        this.roleList = res.data.roles
        this.roleTotal = res.data.total
      })
    },
    handleTableRowClick(row, event, column) {
      if (!this.multiSelectRole) {
        this.$refs.roleTable.clearSelection()
      }
      this.$refs.roleTable.toggleRowSelection(row)
    },
    handleRoleSelectionChange(selection) {
      // if (!this.multiSelectRole) {

      // }
      this.roleSelectionList = selection.map(function(val) {
        return {
          id: val.id,
          roleCode: val.roleCode,
          roleName: val.roleName
        }
      })
      // console.log(this.roleSelectionList)
    },
    handleUserCheckChange(currentNode, selected, childHasSelected) {
      const selection = this.$refs.userTree.getCheckedNodes()
      if (!this.multiSelectUser) {
        if (selected) {
          // ...
          for (let i = 0; i < selection.length; i++) {
            const item = selection[i]
            if (item.id !== currentNode.id) {
              this.$refs.userTree.setChecked(item.id, false, true)
            }
          }
        } else {
          // ...
        }
      }
      this.userSelectionList = selection
    },
    handleAssignRole() {
      if (this.userSelectionList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择用户'
        })
        return
      }
      if (this.roleSelectionList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择角色'
        })
        return
      }

      const params = {
        users: this.userSelectionList,
        roles: this.roleSelectionList
      }
      assignRole(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      })
    },
    handleRoleSizeChange(val) {
      this.rolePageSize = val
      this.loadRoles()
    },
    handleRoleCurrentChange(val) {
      this.roleCurrentPage = val
      this.loadRoles()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.content-container {
  .el-table, .el-tree, .content-area {
    @each $key, $val in $commonContainerStyle{
      #{$key}: $val;
    }
  }
  .content-area {
    margin-left: 30px;
    height: 500px;
    margin-bottom: 50px;
  }
  .el-tree {
    height: 392px;
    overflow-y: auto;
  }
  .el-table {
    height: 392px;
    overflow-y: auto;
  }
}
</style>
