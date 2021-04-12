<template>
  <div
    class="d-flex"
    :class="{ 'search-box': true, 'd-flex': true, disabled }"
  >
    <input
      v-model.trim="searchInput"
      class="form-control font-body-small align-self-center"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
    >
    <div
      v-if="searching && searchInput && searchInput.length > 0"
      class="align-self-center d-flex"
    >
      <div class="spinner align-self-center" />
    </div>
    <div
      v-if="searchInput"
      class="align-self-center d-flex"
      @click="() => (searchInput = null)"
    >
      <svg-sprite-icon
        name="close"
        class="close-icon align-self-center"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

import { VueWatch, VueDebounce } from '~/components/decorator'

@Component({
  props: {
    change: {
      type: Function,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Search',
    },
    value: {
      type: String,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
export default class SearchBox extends Vue {
  searchInput = false;
  searching = false;

  @VueWatch('value', { immediate: true })
  onValueChanged(v) {
    this.searchInput = v
  }

  @VueWatch('searchInput')
  @VueDebounce()
  notifyChange() {
    this.searching = true
    Promise.resolve(this.change(this.searchInput))
      .then(() => {
        this.searching = false
      })
      .catch((e) => {
        this.searching = false
      })
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.search-box {
  border-radius: 8px;
  padding: 0 10px;
  display: flex;
  background-color: light-color("400");

  .form-control,
  .form-control:focus,
  .form-control:active {
    flex-grow: 4;
    border-width: 0px;
    box-shadow: none !important;
    border-radius: 0px;
    background-color: light-color("400");

    &.disabled {
      background-color: light-color("400");
      cursor: block;
    }
  }

  .search-icon {
    flex-grow: 1;
    fill: dark-color("100");
  }

  .close-icon {
    cursor: pointer;
    flex-grow: 1;
    fill: dark-color("100");
    width: 12px;
    height: 12px;
  }

  &.disabled {
    background-color: light-color("400");
  }
}
</style>
