const template = require('art-template')

// 移除以{{}} 匹配的规则，避免与vue冲突
template.defaults.rules.splice(1, 1)

console.log(template.defaults.rules)

const filename = '/src/template/pages/Table.art'

const data = {
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
      type: 'select'
    }, 
    {
      field: 'city', 
      title: '市',
      type: 'select',
      // 级联配置
      dependon: 'province'
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

const ret = template(__dirname + filename, data)

console.log(ret)


