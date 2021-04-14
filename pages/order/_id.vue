<template>
  <div class="container-fluid p-0">
    <token-detail
      v-if="tokenId"
      :tokenId="tokenId"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

import TokenDetail from '~/components/lego/token/token-detail'

@Component({
  props: {},
  components: {
    TokenDetail,
  },
  middleware: [],
  mixins: [],
})
export default class Token extends Vue {
  tokenId = null;

  mounted() {
    this.tokenId = this.$route.params.id
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
</style>
