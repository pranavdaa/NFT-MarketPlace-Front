import { getNextRoute } from '~/plugins/helpers'

export const NoSSR = {
  data() {
    return {
      smartRender: this.smartRender || false
    }
  },
  mounted() {
    this.smartRender = true
  }
}

export const Toggle = {
  data() {
    return {
      open: this.open || false
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    }
  }
}

export const FormValidator = {
  computed: {
    validation() {
      return {}
    },

    isValid() {
      const validation = this.validation
      return Object.keys(validation).every(key => validation[key])
    }
  }
}

export const NextNavigation = {
  data() {
    return {
      nextRoute: this.nextRoute || null
    }
  },
  mounted() {
    // next
    this.nextRoute = getNextRoute(this.$route)
  },
  methods: {
    moveToNext() {
      if (this.nextRoute) {
        const l = this.$router.resolve(this.nextRoute)
        if (l && l.resolved.matched.length > 0) {
          this.$router.push(this.nextRoute)
        } else {
          this.$router.push({ name: 'index' })
        }
      }
    }
  }
}
