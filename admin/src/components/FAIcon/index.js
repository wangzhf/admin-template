import Vue from 'vue'
import FAIcon from './IconShow'

// register globally
Vue.component('svg-icon', FAIcon)

const req = require.context('./svgs', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
