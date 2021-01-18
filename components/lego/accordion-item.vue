<template>
  <li
    class="accordion__item"
    :class="{ accordion__item_active: visible }"
    @click="open"
  >
    <div class="accordion__header">
      <!-- This slot will handle the title/header of the accordion and is the part you click on -->
      <slot name="accordion-header"></slot>
    </div>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div class="accordion__content" v-show="visible">
        <ul class="p-0">
          <!-- This slot will handle all the content that is passed to the accordion -->
          <slot name="accordion-content"></slot>
        </ul>
      </div>
    </transition>
  </li>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {
    accordionItem: {
      type: Object,
      required: false
    }
  }
})
export default class AccordionItem extends Vue {
  index = null;

  created() {
    this.index = this.accordionItem.count++;
  }

  open() {
    if (this.visible) {
      this.accordionItem.active = null;
    } else {
      this.accordionItem.active = this.index;
    }
  }

  start(el) {
    el.style.height = el.scrollHeight + "px";
  }

  end(el) {
    el.style.height = "unset";
  }

  get visible() {
    return this.index == this.accordionItem.active;
  }
}
</script>

<style lang="scss" scoped>
.accordion__item {
  cursor: pointer;
  padding: 30px 0px;
  border-top: 1px solid #f2f2f2;
  position: relative;

  .accordion__header {
    display: flex;
    justify-content: space-between;
  }
}

.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}

.spin {
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  -ms-transition: -ms-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
}

.spin:hover {
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
