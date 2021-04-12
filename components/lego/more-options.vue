<template>
  <div
    v-if="options && options.length > 0"
    class="more-action-container"
  >
    <div
      v-click-outside="hide"
      class="position-relative"
    >
      <div
        class="more-action-btn d-flex justify-content-center"
        @click="toggleOptions()"
      >
        <svg-sprite-icon
          name="more-menu"
          class="align-self-center mx-auto"
        />
      </div>
      <div
        v-if="showOptions"
        class="more-action-menu ps-8"
      >
        <div
          v-for="option in options"
          :key="option.title"
          class="item ps-x-16 ps-y-12 text-left"
          @click="optionClicked(option)"
        >
          <span class="font-body-small text-nowrap">{{ option.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
})
export default class MoreOptions extends Vue {
  showOptions = false;

  toggleOptions() {
    this.showOptions = !this.showOptions
  }

  hide() {
    this.showOptions = false
  }

  optionClicked(option) {
    option.action && option.action()
    this.hide()
  }

  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.more-action-container {
  position: relative;
}

.more-action-btn {
  position: absolute;
  top: 0;
  right: 0;

  height: 32px;
  width: 32px;
  background-color: light-color("700");
  border: 1px solid light-color("400");
  box-sizing: border-box;
  border-radius: 8px;
  .svg-sprite-icon {
    width: 4px;
    height: 18px;
  }
}
.more-action-menu {
  min-width: 10rem;
  position: absolute;
  top: 40px;
  right: 0;
  background: light-color("700");
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12), 0px 1px 4px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  z-index: 2;

  .item {
    border-radius: 8px;

    &:hover {
      background-color: light-color("500");
    }
  }
}
</style>
>
