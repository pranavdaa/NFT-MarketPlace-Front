<template>
  <div class="btn-loader">
    <div
      v-if="loading"
      :class="[
        'loading-btn',
        'd-flex',
        'justify-content-center',
        'btn',
        'btn-' + color,
        { 'btn-block': block },
        { disabled: disabled },
        { 'btn-sm': sm },
        { 'btn-lg': lg },
        { 'btn-pill': pill },
        ...classes,
      ]"
    >
      <div class="spinner inverse align-self-center" />
      <div
        v-if="loadingText"
        class="mx-3 font-16 align-self-center"
      >
        {{ loadingText }}
      </div>
    </div>
    <button
      v-if="!loading"
      :class="[
        'btn',
        'btn-' + color,
        { 'btn-block': block },
        { disabled: disabled },
        { 'btn-sm': sm },
        { 'btn-lg': lg },
        { 'btn-pill': pill },
        ...classes,
      ]"
      role="button"
      :type="click ? 'button' : 'submit'"
      :disabled="disabled"
      @click="click ? click() : false"
    >
      {{ text }}
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    pill: {
      type: Boolean,
      default: false,
    },
    sm: {
      type: Boolean,
      default: false,
    },
    lg: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    loadingText: {
      type: String,
      required: false,
    },
    click: {
      type: Function,
      required: false,
    },
    classes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  components: {},
})
export default class ButtonLoader extends Vue {}
</script>

<style lang="scss" scoped="">
@import "~assets/css/theme/_theme";
.loading-btn {
  &.btn {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  &.btn-lg {
    padding-top: 14px;
    padding-bottom: 14px;
  }
}
</style>
