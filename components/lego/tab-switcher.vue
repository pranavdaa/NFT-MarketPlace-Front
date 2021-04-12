<template>
  <div
    v-if="tabs && tabs.length > 0"
    class="row tabs-wrapper ps-y-0 ps-x-0 ps-x-md-16 justify-content-center d-flex"
  >
    <ul class="tabs navbar-nav flex-row align-self-center">
      <li
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item"
        @click="onChangeTab(tab.id)"
      >
        <div
          class="nav-link d-flex justify-content-lg-center"
          :class="{ active: activeTab === tab.id }"
        >
          <span class="align-self-center font-body-medium">{{
            tab.title
          }}</span>
          <span
            v-if="tab.count"
            class="align-self-center count font-body-medium"
          >{{ tab.count }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {
    tabs: { type: Array, required: true },
    activeTab: { type: Number, required: false, default: 0 },
    onChangeTab: { type: Function, required: true },
  },
  components: {},
  middleware: [],
  mixins: [],
})
export default class TabSwitcher extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.search-box {
  max-width: 264px;
  width: 100%;
}

.tabs-wrapper {
  border-bottom: 1px solid light-color("400");
  background-color: light-color("700");
}
.tabs {
  margin-bottom: 2px !important;
  .nav-item {
    height: 100%;
    cursor: pointer;
    .nav-link {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 0.7rem;
      white-space: nowrap;
      .count {
        padding-left: 1rem;
        color: dark-color("300") !important;
      }
    }
  }
}

@media (max-width: 590px) {
  .tabs {
    width: 100%;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .nav-item {
      .nav-link {
        width: 100%;
        padding-top: 0.8rem;
      }
    }
  }
}
</style>
