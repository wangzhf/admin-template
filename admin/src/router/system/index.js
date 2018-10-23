import Layout from '@/views/layout/Layout'
import UserRouter from './user'
import ResourceRouter from './resource'
import RoleUserRouter from './roleuser'
import RoleResourceRouter from './roleresource'

export default {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'System',
  authority: 'system',
  meta: {
    title: 'system',
    icon: 'user'
  },
  children: [
    ...UserRouter,
    ...ResourceRouter,
    ...RoleUserRouter,
    ...RoleResourceRouter
  ]
}
