<template>
  <div v-if="categories && categories.length > 0">
    <div class="container-fluid p-0 m-0">
      <div class="row categories d-flex flex-column m-0 p-0">
        <div
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{
            active: !selectedCategory,
            'disable-category': disabledCategoryClick(null),
          }"
          @click="selectCategory(allCategory)"
        >
          <img
            :src="allCategory.img_url"
            :alt="allCategory.name"
            class="icon-all align-self-center"
          >
          <div class="font-body-medium align-self-center text-nowrap ms-l-12">
            {{ allCategory.name }}
          </div>
          <div class="count ps-l-12 font-body-medium ml-auto align-self-center">
            <span v-if="!isLoading || allCategory.count || !isTab">
              <span v-if="isLoading && !!allCategory.count && isTab">
                <div class="wave">
                  <span class="dot" />
                  <span class="dot" />
                  <span class="dot" />
                </div>
              </span>
              <span v-else>
                {{ allCount }}
              </span>
            </span>
          </div>
        </div>
        <div
          v-for="category in categories"
          :key="category.name"
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{
            active: selectedCategory && category.id == selectedCategory.id,
            'disable-category': disabledCategoryClick(category),
          }"
          @click="selectCategory(category)"
        >
          <img
            :src="category.img_url"
            :alt="category.name"
            class="icon align-self-center ms-r-12"
          >
          <div class="font-body-medium align-self-center">
            {{ category.name }}
          </div>
          <div
            v-if="!isLoading || category.count || !isTab"
            class="count ps-l-12 font-body-medium ml-auto align-self-center"
          >
            <div
              v-if="
                isCategoryLoading(category) ||
                  (isLoading && !!allCategory.count && isTab)
              "
              class="count ps-l-12 font-body-medium ml-auto align-self-center"
            >
              <div class="wave">
                <span class="dot" />
                <span class="dot" />
                <span class="dot" />
              </div>
            </div>
            <div v-else>
              <span v-if="SHOW_COUNT.ORDER == countFor">
                {{ category.count || 0 }}
              </span>
              <span v-if="SHOW_COUNT.MAIN == countFor">
                {{ category.mainCount || 0 }}
              </span>
              <span v-if="SHOW_COUNT.MATIC == countFor">
                {{ category.maticCount || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

import { mapGetters, mapState } from 'vuex'
import app from '~/plugins/app'
import getAxios from '~/plugins/axios'

const SHOW_COUNT = { ORDER: 0, MATIC: 1, MAIN: 2 }

@Component({
  props: {
    countFor: {
      type: Number,
      required: false,
      default: 0,
    },
    isTab: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters('page', ['selectedCategory']),
    ...mapState('page', ['isCategoryFetching']),
    ...mapGetters('category', ['categories', 'allCategory']),
  },
})
export default class CategoriesSelector extends Vue {
  showCategory = false;
  SHOW_COUNT = SHOW_COUNT;
  async mounted() {}

  // Actions
  selectCategory(category) {
    if (this.disabledCategoryClick(category || null)) {
      return
    }
    if (category.isAll) {
      this.$store.commit('page/selectedCategory', null)
      return
    }

    this.$store.commit('page/selectedCategory', category)
    this.showCategory = false
  }

  get allCount() {
    if (
      this.SHOW_COUNT.MATIC == this.countFor &&
      !this.isLoading &&
      this.isTab
    ) {
      return (
        this.categories.reduce((total, category) => {
          if (category.maticCount) {
            total = total + parseInt(category.maticCount)
          }
          return total
        }, 0) || 0
      )
    } else if (
      this.SHOW_COUNT.MAIN == this.countFor &&
      !this.isLoading &&
      this.isTab
    ) {
      return (
        this.categories.reduce((total, category) => {
          if (category.mainCount) {
            total = total + parseInt(category.mainCount)
          }
          return total
        }, 0) || 0
      )
    } else if (!this.isTab) {
      return this.allCategory.count || 0
    }
    return 0
  }

  // Getters
  get defaultSelectedCategory() {
    if (this.selectedCategory) {
      return this.selectedCategory
    }
    return this.allCategory
  }

  isCategoryLoading(category) {
    return (
      this.isCategoryFetching && category?.id === this.selectedCategory?.id
    )
  }

  disabledCategoryClick(category) {
    return (
      this.isCategoryFetching && category?.id !== this.selectedCategory?.id
    )
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

      &.disable-category {
        opacity: 0.5;
      }
    }
  }
}

.wave {
  position: relative;

  .dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: dark-color("300");
    animation: wave 1.3s linear infinite;

    &:nth-child(2) {
      animation-delay: -1.1s;
    }

    &:nth-child(3) {
      animation-delay: -0.9s;
    }
  }
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: initial;
  }

  30% {
    transform: translateY(-7px);
  }
}

@media (max-width: 768px) {
}
</style>
