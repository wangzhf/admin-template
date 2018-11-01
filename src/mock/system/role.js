import Mock from 'mockjs'

Mock.Random.extend({
  // 自定义角色生成名称，排除admin
  roleNames: function() {
    const roles = ['FC', 'AM', 'SC', 'FINM', 'FM']
    return this.pick(roles)
  }
})

let Roles = []

// 存储用户角色对应关系: [{uid: 1, roles: [1, 2, 3]}]
const userRoles = [{ id: 1, roles: [1] }]

const roleKeys = ['FC', 'AM', 'SC', 'FINM', 'FM', 'GM', 'VP', 'HRD', 'MD', 'PM', 'BM', 'AAD']

Roles.push({
  id: 1,
  roleCode: 'admin',
  roleName: '管理员'
})

for (let i = 0; i < roleKeys.length; i++) {
  // const roleCode = Mock.mock('@roleNames')
  // Roles.push(Mock.mock({
  //   id: Mock.Random.guid(),
  //   roleCode,
  //   roleName: getRoleName(roleCode)
  // }))
  const roleCode = roleKeys[i]
  Roles.push({
    id: Mock.Random.guid(),
    roleCode: roleCode,
    roleName: getRoleName(roleCode)
  })
}

function getRoleName(roleCode) {
  let roleName = ''
  switch (roleCode) {
    case 'FC':
      roleName = '金融顾问'
      break
    case 'FM':
      roleName = '财务经理'
      break
    case 'FINM':
      roleName = '金融经理'
      break
    case 'SC':
      roleName = '销售顾问'
      break
    case 'AM':
      roleName = '客户经理'
      break
    case 'GM':
      roleName = '总经理'
      break
    case 'VP':
      roleName = '副总裁'
      break
    case 'HRD':
      roleName = '副总裁助理'
      break
    case 'MD':
      roleName = '运营总监'
      break
    case 'PM':
      roleName = '产品经理'
      break
    case 'BM':
      roleName = '部门经理'
      break
    case 'AAD':
      roleName = '副客户总监'
      break
    default:
      roleName = '未知'
  }
  return roleName
}

export default {
  getRoleList: params => {
    const data = JSON.parse(params.body) || {}
    const roleName = data.roleName || ''
    const roleCode = data.roleCode || ''
    const currentPage = data.currentPage || 1
    const pageSize = data.pageSize || 999

    let tmpRoles = Roles.filter(role => {
      if (roleName && role.roleName.indexOf(roleName) === -1) {
        return false
      }
      if (roleCode && role.roleCode.indexOf(roleCode) === -1) {
        return false
      }
      return true
    })
    const total = tmpRoles.length
    tmpRoles = tmpRoles.filter((u, index) => {
      return index < currentPage * pageSize && index >= pageSize * (currentPage - 1)
    })
    return {
      total: total,
      roles: tmpRoles
    }
  },

  getUserRoleList: config => {
    const data = JSON.parse(config.body) || {}
    const id = data.id
    const ret = {}
    if (id) {
      userRoles.filter(item => {
        if (id === item.id) {
          ret.roles = item.roles
          ret.data = item.roles
        }
      })
    }
    ret.allRoles = Roles
    ret.allData = Roles
    return ret
  },

  addUserRole: config => {
    const data = JSON.parse(config.body) || {}
    let roles = data.roles
    if (data.data) {
      roles = data.data
    }
    const id = data.id
    let match = false
    userRoles.filter(userRole => {
      if (userRole.id === id) {
        userRole.roles = roles
        match = true
      }
    })
    if (!match) {
      userRoles.push({
        id,
        roles
      })
    }
  },

  editRole: params => {
    const data = JSON.parse(params.body)
    for (let i = 0; i < Roles.length; i++) {
      if (Roles[i].id === data.id) {
        Roles[i] = data
      }
    }
  },

  deleteRole: params => {
    const data = JSON.parse(params.body)
    for (let i = 0; i < Roles.length; i++) {
      if (Roles[i].id === data.id) {
        Roles.splice(i, 1)
      }
    }
  },

  addRole: params => {
    const data = JSON.parse(params.body)
    data.id = Mock.Random.guid()
    // Roles.push(data)
    Roles.splice(0, 0, data)
  },

  batchDelete: params => {
    const { ids } = JSON.parse(params.body)
    const idArr = ids.split(',')
    Roles = Roles.filter(u => !idArr.includes(u.id))
  }
}
