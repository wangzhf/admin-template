<template>
  <div class="content-container">
    <el-form ref="form" :inline="true" label-width="80px">
      <el-form-item label="用户姓名">
        <va-input v-model.trim="form.key1" />
      </el-form-item>
      <el-form-item label="用户代码">
        <va-input v-model.trim="form.key2" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
    </el-form>
    <el-row>
      <el-button-group>
        <el-button :disabled="disabledBatchBtn" icon="el-icon-delete" type="primary" @click="batchDelete">批量删除</el-button>
        <el-button v-if="needExpand" :icon="expandBtn.icon" type="primary" @click="handleChildExpand">{{ expandBtn.text }}</el-button>
      </el-button-group>
    </el-row>

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
  </div>
</template>

<script>
import VaInput from '@/va/components/input/VAInput'

import API from '@/api/va/index'

export default {
  name: 'VATable',
  components: {
    VaInput
  },

  data() {
    return {
      // 列表集合
      list: [],
      form: {
        key1: '',
        key2: ''
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
      multipleSelection: []
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
      console.log('load')
      API.list().then(res => {
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
      console.log('add...')
    },
    handleEdit(index, row) {
      console.log('edit...')
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        console.log('delete...')
      })
    },
    // 批量删除
    batchDelete() {
      const ids = this.multipleSelection.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        console.log(ids)
        console.log('batch delete...')
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
      console.log(this.expandRowKeys)
      if (this.expandRowKeys.length > 0) {
        this.expandRowKeys = []
      } else {
        if (this.list && this.list.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.expandRowKeys.push(this.list[i].id)
          }
        }
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
</style>
