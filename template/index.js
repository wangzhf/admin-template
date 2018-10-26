const template = require('art-template')
const fs = require('fs')
const tablePageConfig = require('./src/data/tablePage.js')

// 移除以{{}} 匹配的规则，避免与vue冲突
template.defaults.rules.splice(1, 1)

// 开启压缩
template.defaults.minimize = true

// console.log(template.defaults.rules)

const filename = '/src/template/pages/Table2.art'

let ret = template(__dirname + filename, tablePageConfig)

ret = minify(ret)

const outDir = '/src/temp/'
fs.writeFile(__dirname + outDir + 'Table.vue', ret, err => {
  if (err) console.log('write file error.')
  else console.log('write file success')
})

function minify(source) {
  return source
    // remove double newline / carriage return into one newline / carriage return
    .replace(/\n\s*(?=\n)/g, '')
    // remove cr and space before {{ block/if/else }}
    .replace(/\n\s*(\{\{\s*(block|if|each|else)\s*[^\}]*\}\})/g, '$1')
    // remove cr and space before {{ /block/if }}
    .replace(/\n\s*(\{\{\s*\/(block|if|each)\s*\}\})/g, '$1')
}
