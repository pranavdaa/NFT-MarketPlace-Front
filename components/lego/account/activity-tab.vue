<template>
  <div class="container">
    <div class="row">
      <div
        class="col-md-12 text-md-left text-center ps-y-32"
      >Here's a list of your requested transactions. Remember, once transactions make it onto the blockchain, the app takes a couple minutes to receive the updates, so keep checking!</div>
    </div>
    <div class="row">
      <activity-row />
      <activity-row />
      <activity-row />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import ActivityRow from "~/components/lego/account/activity-row";

@Component({
  props: {},
  components: {
    ActivityRow
  }
})
export default class ActivityTab extends Vue {
  mounted() {}
}
</script>


<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.container {
  max-width: 940px;
}
</style>