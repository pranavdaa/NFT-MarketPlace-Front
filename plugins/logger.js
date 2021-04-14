import Vue from 'vue'
import mixpanel from 'mixpanel-browser'
const uiconfig = require('~/config/uiconfig')

export default {
  install() {
    // if (process.env.NODE_ENV === "production") {
    mixpanel.init(uiconfig.MIXPANEL_TOKEN)
    // }
    let shouldTrack = false
    const logger = {
      initTrack(user) {
        // if(user && process.env.NODE_ENV === "production"){
        if (user) {
          mixpanel.identify(user.address)
        } else {
          user = {}
        }
        shouldTrack = true
      },
      stopTrack() {
        shouldTrack = false
      },
      track(event, payload = {}) {
        // if (process.env.NODE_ENV !== "production") {
        //     console.log(event, JSON.parse(JSON.stringify(payload)));
        // }
        // else if (shouldTrack) {
        if (shouldTrack) {
          mixpanel.track(event, JSON.parse(JSON.stringify(payload)))
        }
      },
      error(err) {
        console.error('error occured', err)
        if (process.env.NODE_ENV === 'production') {
          // send error to entry
        }
      },
      debug(...args) {
        console.log(args)
      },
    }
    Vue.logger = logger
    Vue.mixin({
      beforeCreate() {
        this.$logger = logger
      },
    })
  },
}
