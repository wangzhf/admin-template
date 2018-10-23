export default [
  {
    path: 'resource',
    component: () => import('@/views/system/resource/index'),
    name: 'ResourceManager',
    authority: 'resourceManager',
    meta: { title: 'resourceManager', icon: 'peoples', roles: [] }
  }
]
