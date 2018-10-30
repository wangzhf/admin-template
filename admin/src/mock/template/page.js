const pageConfig = [{
  pageId: 1,
  pageType: 0,
  pageName: '用户管理',
  pageCode: 'userManager',
  pageData: {
    // 搜索
    searchArea: [{
      field: 'userName',
      title: '用户姓名',
      type: 'input'
    },
    {
      field: 'userCode',
      title: '用户代码',
      type: 'input'
    },
    {
      field: 'province',
      title: '省',
      type: 'select',
      url: '/common/province/list'
    },
    {
      field: 'city',
      title: '市',
      type: 'select',
      // 级联配置
      dependon: 'province',
      keyProps: {
        pid: 'pid'
      },
      url: '/common/city/list'
    },
    {
      field: 'menu',
      title: '菜单',
      type: 'selectTree',
      url: '/menu/list'
    }],
    // table展示
    table: {
      columns: [{
        field: 'userName',
        title: '用户姓名'
      }, {
        field: 'userCode',
        title: '用户代码'
      }],
      childColumns: [{
        field: 'sex',
        title: '性别'
      }, {
        field: 'age',
        title: '年龄'
      }, {
        field: 'birthday',
        title: '生日'
      }, {
        field: 'address',
        title: '地址'
      }]
    },

    // table行操作
    actions: [{
      name: 'assignUser',
      title: '关联用户',
      type: 'tableDialog',
      url: '',
      dialog: {
        title: '关联用户',
        type: 'table',
        queryData: {},
        loading: false,
        assignUserFormVisible: false,
        columnProps: [{
          propName: 'userName',
          label: '姓名'
        },
        {
          propName: 'userCode',
          label: '代码'
        }],
        linkId: null
      }
    }, {
      name: 'assignRole',
      title: '关联角色',
      type: 'treeDialog',
      url: '/user/role',
      dialog: {
        title: '关联角色',
        type: 'tree',
        queryData: {},
        loading: false,
        assignRoleFormVisible: false,
        keyProps: {
          children: 'children',
          label: 'roleName'
        },
        linkId: null
      }
    }, {
      name: 'add',
      title: '新增',
      type: 'addDialog',
      dialog: {
        title: '新增',
        type: 'form',
        addFormVisible: false,
        addForm: {},
        addFormRules: {
          userName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        columns: [{
          field: 'userName',
          title: '用户姓名',
          type: 'input'
        }, {
          field: 'userCode',
          title: '用户代码',
          type: 'input'
        }, {
          field: 'sex',
          title: '性别',
          type: 'radio',
          options: [
            {
              label: '男',
              value: 1
            }, {
              label: '女',
              value: 0
            }
          ]
        }, {
          field: 'age',
          title: '年龄',
          type: 'number',
          option: {
            min: 0,
            max: 200
          }
        }, {
          field: 'birthday',
          title: '生日',
          type: 'date'
        }, {
          field: 'address',
          title: '地址',
          type: 'textarea'
        }]
      }
    }, {
      name: 'edit',
      title: '编辑',
      type: 'editDialog',
      dialog: {
        title: '编辑',
        editFormVisible: false,
        editForm: {},
        editFormRules: {
          userName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        type: 'form',
        columns: [{
          field: 'userName',
          title: '用户姓名',
          type: 'input'
        }, {
          field: 'userCode',
          title: '用户代码',
          type: 'input'
        }, {
          field: 'sex',
          title: '性别',
          type: 'radio',
          options: [
            {
              label: '男',
              value: 1
            }, {
              label: '女',
              value: 0
            }
          ]
        }, {
          field: 'age',
          title: '年龄',
          type: 'number',
          option: {
            min: 0,
            max: 200
          }
        }, {
          field: 'birthday',
          title: '生日',
          type: 'date'
        }, {
          field: 'address',
          title: '地址',
          type: 'textarea'
        }]
      }
    }, {
      name: 'delete',
      title: '删除',
      type: 'deleteDialog',
      dialog: {

      }
    }]
  }
}]

export default {
  getPageConfig: config => {
    console.log('get the request: ')
    console.log(config)
    return pageConfig[0]
  }
}
