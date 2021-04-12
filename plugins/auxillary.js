import Vue from 'vue'

import Loader from '~/components/loader'
import SvgSpriteIcon from '~/components/svg-sprite-icon'
import ButtonLoader from '~/components/lego/button-loader'

Vue.directive('click-outside', {
  bind(el, binding, vNode) {
    // Provided expression must evaluate to a function.
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name
      let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) {
        warn += `Found in component '${compName}'`
      }

      console.warn(warn)
    }
    // Define Handler and cache it on the element
    const bubble = binding.modifiers.bubble
    const handler = (e) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = handler

    // add Event Listeners
    document.addEventListener('click', handler)
  },

  unbind(el, binding) {
    // Remove Event Listeners
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  },
})

// register global components
Vue.component('Loader', Loader)
Vue.component('SvgSpriteIcon', SvgSpriteIcon)
Vue.component('ButtonLoader', ButtonLoader)
