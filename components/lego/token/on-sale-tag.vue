<template>
  <div class="pill-wrapper d-flex">
    <div class="time-left-pill d-flex ms-r-8">
      <div class="font-caps font-medium caps align-self-center ps-x-6 ps-t-1">
        {{ $t("token.onsale") }}
      </div>
    </div>
    <div
      v-if="time"
      class="time-left-pill d-flex"
    >
      <img
        src="~/assets/svg/clock-analog.svg"
        alt="Cryptokitty"
        class="icon ms-r-4 align-self-center"
      >
      <div class="font-caps font-medium caps align-self-center ps-r-6 ps-t-1">
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    time: {
      type: String,
      required: false,
      default: '',
    },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class OnSaleTag extends Vue {
  mounted() {}
}
</script>
<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.pill-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;

  .time-left-pill {
    width: fit-content;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    background: light-color("700");
    border-radius: 19px;
    height: 24px;
    .icon {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
