<template>
  <div
    class="switch-wrapper d-flex ps-4 flex-row justify-content-between font-body-small font-medium"
    :class="{ active: switcher }"
  >
    <div
      class="w-50 d-flex top ms-r-4 align-self-center justify-content-center"
      @click="onSwitched(false)"
    >
      <div
        v-if="optionOne.count"
        class="count-wrapper d-flex align-self-center justify-content-center"
      >
        <span class="align-self-center">{{ optionOne.count }}</span>
      </div>
      <span
        class="align-self-center"
        :class="{ 'ps-l-16': optionOne.count }"
      >{{
        optionOne.title
      }}</span>
    </div>
    <div
      class="w-50 top d-flex flex-row align-self-center justify-content-center"
      @click="onSwitched(true)"
    >
      <div
        v-if="optionTwo.count"
        class="count-wrapper d-flex align-self-center justify-content-center"
      >
        <span class="align-self-center">{{ optionTwo.count }}</span>
      </div>
      <span
        class="align-self-center"
        :class="{ 'ps-l-16': optionTwo.count }"
      >{{
        optionTwo.title
      }}</span>
    </div>
    <div class="switch align-self-center" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    on: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    onOff: {
      type: Boolean,
      required: false,
      default: false,
    },
    onChange: {
      type: Function,
      required: false,
      default: (value) => {},
    },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class SlideSwitch extends Vue {
  switcher = false;

  mounted() {
    this.switcher = this.on
  }

  onSwitched(value) {
    this.switcher = value
    this.onChange(value)
  }

  get optionOne() {
    return this.options[0]
  }

  get optionTwo() {
    return this.options[1]
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.switch-wrapper {
  position: relative;
  background-color: light-color("500");
  border-radius: $default-card-box-border-radius;
  max-width: 258px;
  width: 100%;
  .top {
    z-index: 1;
    cursor: pointer;
    height: 100%;
  }

  .switch {
    left: 4px;
    position: absolute;
    height: 83%;
    width: 50%;
    background-color: light-color("700");
    border-radius: 9px;
    transition: left 0.2s linear;
  }
  &.active {
    .switch {
      left: 48.5%;
    }
  }
}

.count-wrapper {
  height: 24px;
  width: 24px;
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: 50%;
}

@media (max-width: 520px) {
  .switch-wrapper {
    max-width: 100%;
    height: 44px;
  }
  .switch-wrapper {
    margin-top: 16px;
  }
}
</style>
