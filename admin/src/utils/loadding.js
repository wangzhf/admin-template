import { Loading } from 'element-ui'

let loading

export function showLoading() {
  loading = Loading.service({
    lock: true,
    // fullscreen: true,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

export function hideLoading() {
  loading.close()
}
