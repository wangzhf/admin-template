const template = require('art-template')
const fs = require('fs')

// 移除以{{}} 匹配的规则，避免与vue冲突
template.defaults.rules.splice(1, 1)

console.log(template.defaults.rules)

const filename = '/src/template/pages/Table2.art'

const tablePageConfig = {
  // 搜索
  searchArea: [
    {
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
      url: '/common/city/list'
    }, 
    {
      field: 'menu',
      title: '菜单',
      type: 'selectTree',
      url: '/menu/list'
    }
  ], 
  // table展示
  table: {
    columns: [
      {
        field: 'userName',
        title: '用户姓名'
      },{
        field: 'userCode',
        title: '用户代码'
      }
    ],
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

  action: [
    {
      name: 'assignRole',
      title: '关联角色',
      type: 'treeDialog',
      url: '/user/role'
    },{
      name: 'edit',
      title: '编辑',
      type: 'editDialog'
    },{
      name: 'delete',
      title: '删除',
      type: 'deleteDialog'
    }
  ],

  edit: [
    {
      field: 'userName',
      title: '用户姓名'
    },{
      field: 'userCode',
      title: '用户代码'
    },{
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
    }
  ], 
  add: [
    {
      field: 'userName',
      title: '用户姓名'
    },{
      field: 'userCode',
      title: '用户代码'
    },{
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
    }
  ]
}

const ret = template(__dirname + filename, tablePageConfig)
const outDir = '/src/temp/'
fs.writeFile(__dirname + outDir + 'Table.vue', ret, err => {
  if (err) console.log('write file error.')
  else console.log('write file success')
})

