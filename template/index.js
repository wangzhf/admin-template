const template = require('art-template')
const fs = require('fs')
const path = require('path')
const tablePageConfig = require('./src/data/tablePage.js')

// Table模板路径
const tableTemplateFile = '/src/template/pages/Table2.art'

// admin中views的根目录
const destViewPath = path.join(__dirname, '../admin/src/views/')

// 输出的临时目录
const tempDir = path.join(__dirname, '/src/temp/')

// router-view文件路径
const routerViewPath = path.join(__dirname, '/src/template/RouterView.art')

/**
 * 初始化模板配置
 */
function init() {
  // 移除以{{}} 匹配的规则，避免与vue冲突
  template.defaults.rules.splice(1, 1)
  // console.log(template.defaults.rules)
  
  // 开启压缩
  template.defaults.minimize = true
  return template
}

function run() {
  const template = init()
  let result = template(__dirname + tableTemplateFile, tablePageConfig)
  result = minify(result)
  // 输出临时
  // move2Temp(result, 'Table.vue')
  // 输出admin中
  move2Views(result, 'index2.vue')
}

/**
 * 将生成的vue文件移动到views下
 */
function move2Views(destStr, fileName) {
  const destDir = destViewPath + '/' + fileName
  console.log('dest dir: ')
  console.log(destDir)

  // parent router
  const parentRouter = '/layout/Layout'
  const currentRouter = '/template/table/index2'

  fs.exists(destViewPath + parentRouter + '.vue', isExist => {
    if (isExist) {
      fs.writeFile(destViewPath + currentRouter + '.vue', destStr, err => {
        console.log(err)
        if (err) 
          console.log('write file error.')
        else 
          console.log('write file success.')
      })

    } else {
      // not exist
      if (parentRouter.indexOf('/layout/Layout') === -1) {
        // write router-view file to the path
        fs.rename(routerViewPath, destViewPath + parentRouter + '.vue', err => {
          if (err) {
            console.log('write parent router file error: ' + destViewPath + parentRouter)
          }
        })
      }
    }
  })

}

/**
 * 处理多级菜单，放置默认的route-view
 */
function handleRouterView(dest) {
  const rv = fs.readFile(__dirname, '/template/pages/RouterView.art')
  console.log(rv)
}

/**
 * 暂时放到临时目录下
 */
function move2Temp(destStr, fileName) {
  fs.writeFile(tempDir + '/' + fileName, destStr, err => {
    if (err) 
      console.log('write ' + fileName + ' error.')
    else 
      console.log('write ' + fileName + ' success.')
  })
}

function minify(source) {
  return source
    // remove double newline / carriage return into one newline / carriage return
    .replace(/\n\s*(?=\n)/g, '')
    // remove cr and space before {{ block/if/else }}
    .replace(/\n\s*(\{\{\s*(block|if|each|else)\s*[^\}]*\}\})/g, '$1')
    // remove cr and space before {{ /block/if }}
    .replace(/\n\s*(\{\{\s*\/(block|if|each)\s*\}\})/g, '$1')
}

run()