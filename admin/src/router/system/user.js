export default [
  {
    path: 'user',
    component: () => import('@/views/system/user/index'),
    name: 'UserManager',
    authority: 'userManager',
    meta: { title: 'userManager', icon: 'peoples', roles: [] }
  },
  {
    path: 'role',
    component: () => import('@/views/system/role/index'),
    name: 'RoleManager',
    authority: 'roleManager',
    meta: { title: 'roleManager', icon: 'people', roles: [] }
  }
]
