<template>
  <div class="row tabs-wrapper ps-y-0 ps-x-0 ps-x-md-16 justify-content-center d-flex">
    <ul class="tabs navbar-nav flex-row align-self-center">
      <li class="nav-item" @click="onChangeTab(0)">
        <div class="nav-link d-flex justify-content-lg-center" :class="{'active': activeTab === 0}">
          <span class="align-self-center font-body-medium">{{ $t('account.tabs.matic') }}</span>
          <span class="align-self-center count font-body-medium">12</span>
        </div>
      </li>
      <li class="nav-item" @click="onChangeTab(1)">
        <div class="nav-link d-flex justify-content-lg-center" :class="{'active': activeTab === 1}">
          <span class="align-self-center font-body-medium">{{ $t('account.tabs.ethereum') }}</span>
          <span class="align-self-center count font-body-medium">4</span>
        </div>
      </li>
      <li class="nav-item" @click="onChangeTab(2)">
        <div class="nav-link d-flex justify-content-lg-center" :class="{'active': activeTab === 2}">
          <span class="align-self-center font-body-medium">{{ $t('account.tabs.favorites') }}</span>
          <span class="align-self-center count font-body-medium">6</span>
        </div>
      </li>
      <li class="nav-item" @click="onChangeTab(3)">
        <div class="nav-link d-flex justify-content-lg-center" :class="{'active': activeTab === 3}">
          <span class="align-self-center font-body-medium">{{ $t('account.tabs.activity') }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {
    activeTab: { type: Number, required: false, default: 0 },
    onChangeTab: { type: Function, required: true }
  },
  components: {},
  middleware: [],
  mixins: []
})
export default class AccountTabs extends Vue {
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
