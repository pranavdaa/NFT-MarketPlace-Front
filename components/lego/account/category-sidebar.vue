<template>
  <div v-if="categories && categories.length > 0">
    <div class="container-fluid p-0 m-0">
      <div class="row categories d-flex flex-column m-0 p-0">
        <div
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{'active': !selectedCategory}"
          @click="selectCategory(allCategory)"
        >
          <img
            :src="allCategory.img_url"
            :alt="allCategory.name"
            class="icon-all align-self-center"
          />
          <div class="font-body-medium align-self-center ms-l-12">{{allCategory.name}}</div>
          <div
            class="count ps-l-12 font-body-medium ml-auto align-self-center"
          >{{allCategory.count||0}}</div>
        </div>
        <div
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{'active': selectedCategory && category.id == selectedCategory.id}"
          v-for="category in categories"
          :key="category.name"
          @click="selectCategory(category)"
        >
          <img :src="category.img_url" :alt="category.name" class="icon align-self-center ms-r-12" />
          <div class="font-body-medium align-self-center">{{category.name}}</div>
          <div
            class="count ps-l-12 font-body-medium ml-auto align-self-center"
          >{{category.count || "0"}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import { mapGetters } from "vuex";

import app from "~/plugins/app";
import getAxios from "~/plugins/axios";

@Component({
  props: {},
  computed: {
    ...mapGetters("page", ["selectedCategory"]),
    ...mapGetters("category", ["categories", "allCategory"]),
  },
})
export default class CategoriesSelector extends Vue {
  showCategory = false;

  async mounted() {}

  // Actions
  selectCategory(category) {
    if (category.isAll) {
      this.$store.commit("page/selectedCategory", null);
      return;
    }

    this.$store.commit("page/selectedCategory", category);
    this.showCategory = false;
  }

  // Getters
  get defaultSelectedCategory() {
    if (this.selectedCategory) {
      return this.selectedCategory;
    }
    return this.allCategory;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.category {
  background-color: light-color("700");
  border-radius: $border-radius-xl;
  box-sizing: border-box;

  .icon-all {
    width: 24px;
    height: 24px;
    margin: 4px;
  }
  .icon {
    width: 32px;
    height: 32px;
  }
  .count {
    color: dark-color("300") !important;
  }
}

.container-fluid {
  .categories {
    width: 100%;
    border-radius: $border-radius-xl;
    background-color: light-color("700");
    .category {
      border: none;
      width: 100%;
      &:hover,
      &.active {
        background: light-color("600");
      }
    }
  }
}

@media (max-width: 768px) {
}
</style>
