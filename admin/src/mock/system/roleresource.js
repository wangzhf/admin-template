
const roleResourceList = []

const resourceRoleList = []

export default {
  addRoleResource: config => {
    const { resources, roles } = JSON.parse(config.body)
    // resource => role
    for (let i = 0; i < resources.length; i++) {
      const newResource = resources[i]
      let existIndex = -1
      for (let j = 0; j < resourceRoleList.length; j++) {
        const oldResource = resourceRoleList[j]
        if (newResource.id === oldResource.id) {
          existIndex = j
        }
      }
      if (existIndex !== -1) {
        resourceRoleList.splice(existIndex, 1)
      }
      const newResourceRole = Object.assign({}, newResource)
      const newRoles = Object.assign([], roles)
      newResourceRole.roles = newRoles

      resourceRoleList.push(newResourceRole)
    }
    // role => resource
    for (let i = 0; i < roles.length; i++) {
      const newRole = roles[i]
      let existIndex = -1
      for (let j = 0; j < roleResourceList.length; j++) {
        const oldRole = roleResourceList[j]
        if (newRole.id === oldRole.id) {
          existIndex = j
        }
      }
      if (existIndex !== -1) {
        roleResourceList.splice(existIndex, 1)
      }
      const newRoleResource = Object.assign({}, newRole)
      const newResources = Object.assign([], resources)
      newRoleResource.resources = newResources

      roleResourceList.push(newRoleResource)
    }
    return resourceRoleList
  }
}
