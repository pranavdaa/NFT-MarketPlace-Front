<template>
  <div class="container">
    <div class="row">
      <div
        class="col-md-12 text-md-left text-center ps-y-32"
      >Here's a list of your requested transactions. Remember, once transactions make it onto the blockchain, the app takes a couple minutes to receive the updates, so keep checking!</div>
    </div>
    <div class="row" v-if="notifications">
      <activity-row v-for="activity in notifications" :key="activity.id" :activity="activity" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

import getAxios from "~/plugins/axios";

import ActivityRow from "~/components/lego/account/activity-row";

@Component({
  props: {},
  components: {
    ActivityRow
  },
  computed: {
    ...mapGetters("auth", ["user"])
  }
})
export default class ActivityTab extends Vue {
  notifications = [];
  async mounted() {
    await this.fetchNotifications();
  }

  // Actions
  async fetchNotifications() {
    try {
      let response = await getAxios().get(`users/notification/${this.user.id}`);
      if (response.status === 200 && response.data.data.notifications) {
        this.notifications = response.data.data.notifications;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.container {
  max-width: 940px;
}
</style>