import { Loading } from 'element-ui'
import NProgress from 'nprogress' // progress bar
// import '@/styles/NProgress.scss'// progress bar style
import 'nprogress/nprogress.css'

let loading

const useNProgress = true
// NProgress Configuration
NProgress.configure({
  showSpinner: true,
  ease: 'ease'
})

export function showLoading() {
  if (!useNProgress) {
    loading = Loading.service({
      lock: true,
      // fullscreen: true,
      background: 'rgba(0, 0, 0, 0.7)'
    })
  } else {
    NProgress.start()
  }
}

export function hideLoading() {
  if (!useNProgress) {
    loading.close()
  } else {
    NProgress.done()
  }
}
