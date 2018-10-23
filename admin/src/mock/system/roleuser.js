
const roleUserList = []

const userRoleList = []

export default {
  addRoleUser: config => {
    const { users, roles } = JSON.parse(config.body)
    // user => role
    for (let i = 0; i < users.length; i++) {
      const newUser = users[i]
      let existIndex = -1
      for (let j = 0; j < userRoleList.length; j++) {
        const oldUser = userRoleList[j]
        if (newUser.id === oldUser.id) {
          existIndex = j
        }
      }
      if (existIndex !== -1) {
        userRoleList.splice(existIndex, 1)
      }
      const newUserRole = Object.assign({}, newUser)
      const newRoles = Object.assign([], roles)
      newUserRole.roles = newRoles

      userRoleList.push(newUserRole)
    }
    // role => user
    for (let i = 0; i < roles.length; i++) {
      const newRole = roles[i]
      let existIndex = -1
      for (let j = 0; j < roleUserList.length; j++) {
        const oldRole = roleUserList[j]
        if (newRole.id === oldRole.id) {
          existIndex = j
        }
      }
      if (existIndex !== -1) {
        roleUserList.splice(existIndex, 1)
      }
      const newRoleUser = Object.assign({}, newRole)
      const newUsers = Object.assign([], users)
      newRoleUser.users = newUsers

      roleUserList.push(newRoleUser)
    }
    console.log('after update role user: ')
    console.log(userRoleList)
    console.log(roleUserList)
    return userRoleList
  }
}
