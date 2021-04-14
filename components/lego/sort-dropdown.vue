<template>
  <div
    v-click-outside="() => (active = false)"
    class="dropdown-sort d-flex"
  >
    <div class="sort-box cursor-pointer align-self-center">
      <div
        class="title-container d-flex position-relative form-control no-border justify-content-between"
        @click="active = !active"
      >
        <div
          v-if="selectedItem"
          class="font-body-small ms-y-auto font-medium text-capitalize sort-selected cursor-pointer"
        >
          {{ selectedItem.name }}
        </div>
        <div class="action ps-l-12">
          <svg-sprite-icon
            name="right-arrow"
            class="down-icon"
          />
        </div>
      </div>
    </div>

    <!-- Dropdown Items -->
    <div
      v-if="active"
      class="table table-wrapper sort-list"
    >
      <div class="table-scrollable">
        <div class="table-body">
          <div
            v-for="item in sortItems"
            :key="item.id"
            class="table-row ps-l-20 sort-item"
            :class="{ active: selectedItem.id === item.id }"
            @click.stop.prevent="onChange(item)"
          >
            <div
              :id="item.id"
              class="title font-body-small font-medium ms-y-auto text-capitalize"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ./ Dropdown Items -->
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    sortItems: {
      type: Array,
      required: true,
    },
    defaultID: {
      type: Number,
      required: false,
      default: 0,
    },
    change: {
      type: Function,
      required: true,
    },
  },
  components: {},
  mixins: [],
})
export default class SortDropdown extends Vue {
  active = false;
  selectedItem = null;

  mounted() {
    this.onChange(this.selectedItem || this.sortItems[this.defaultID])
  }

  onChange(value) {
    this.selectedItem = value
    this.change(value)
    this.active = false
  }
}
</script>

<style lang="scss" scoped="">
@import "~assets/css/theme/_theme";
.dropdown-sort {
  position: relative;
  max-width: 182px;
  width: 100%;
  .down-icon {
    transform: rotate(90deg);
    height: 12px;
    width: 12px;
    fill: dark-color("700");
  }

  .sort-selected {
    color: dark-color("400");
  }
  .sort-box {
    width: 100%;
    border-radius: $border-radius-xl;
    padding: 3px 6px;
    border: 1px solid light-color("400");
    display: flex;
    background-color: light-color("700");
  }

  .sort-item {
    color: dark-color("400");
    cursor: pointer;
    padding: 12px 16px !important;

    &.active {
      background-color: light-color("500");
    }

    &:hover {
      background-color: light-color("500");
    }
  }

  .sort-list {
    position: absolute;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
    border-radius: $border-radius-xl;
    z-index: 999;
    width: 100%;
  }
}
@media (max-width: 768px) {
  .dropdown-sort {
    max-width: 100%;
  }
}
</style>
