
const pageConfig = [{
  pageId: 1,
  pageType: 0,
  pageName: '用户管理',
  pageCode: 'userManager'
}]

export default {
  getPageConfig: config => {
    console.log('get the request: ')
    console.log(config)
    return pageConfig[0]
  }
}
