export default [
  {
    path: 'roleresource',
    component: () => import('@/views/system/roleresource/index'),
    name: 'RoleResourceManager',
    authority: 'roleresourceManager',
    meta: { title: 'roleResourceManager', icon: 'peoples', roles: [] }
  }
]
