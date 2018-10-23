export default [
  {
    path: 'roleuser',
    component: () => import('@/views/system/roleuser/index'),
    name: 'RoleUserManager',
    authority: 'roleuserManager',
    meta: { title: 'roleUserManager', icon: 'peoples', roles: [] }
  }
]
