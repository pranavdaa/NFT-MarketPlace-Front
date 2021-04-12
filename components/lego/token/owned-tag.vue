<template>
  <div class="pill-wrapper d-flex">
    <div class="owned-token-pill d-flex ms-r-8">
      <div class="font-caps font-medium caps align-self-center ps-x-6 ps-t-1">
        {{ $t("token.owned") }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {},
  components: {},
  middleware: [],
  mixins: [],
})
export default class OnSaleTag extends Vue {
  mounted() {}
}
</script>
<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.pill-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;

  .owned-token-pill {
    width: fit-content;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    background: light-color("700");
    border-radius: 19px;
    height: 24px;
  }
}
</style>
