<template>
  <div class="pill-wrapper d-flex">
    <div class="order-type-pill d-flex ms-r-8">
      <div class="font-caps font-medium caps align-self-center ps-x-6 ps-t-1">
        {{ type }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class OrderTypeTag extends Vue {
  mounted() {}
}
</script>
<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.pill-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;

  .order-type-pill {
    width: fit-content;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    background: light-color("700");
    border-radius: 19px;
    height: 24px;
  }
}
</style>
