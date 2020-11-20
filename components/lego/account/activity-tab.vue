<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 text-md-left text-center ps-y-32" v-if="notifications > 0">
        Here's a list of your requested transactions. Remember, once
        transactions make it onto the blockchain, the app takes a couple minutes
        to receive the updates, so keep checking!
      </div>
    </div>
    <div class="row" v-if="notifications">
      <activity-row
        v-for="activity in notifications"
        :key="activity.id"
        :activity="activity"
      />
    </div>

    <no-item
      class="ps-b-120"
      :message="exmptyMsg"
      v-if="
        notifications.length <= 0 && !isLoading
      "
    />
    
    <div class="row ps-x-16 ps-y-40 d-flex justify-content-center text-center">
      <!-- matic loader here -->
      <button-loader
        class="mx-auto"
        :loading="isLoading"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        :click="fetchNotifications"
        v-if="hasNextPage"
        color="light"
      ></button-loader>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

import getAxios from "~/plugins/axios";

import ActivityRow from "~/components/lego/account/activity-row";
import NoItem from "~/components/lego/no-item";

@Component({
  props: {},
  components: {
    ActivityRow,
    NoItem,
  },
  computed: {
    ...mapGetters("auth", ["user"]),
  },
})
export default class ActivityTab extends Vue {
  notifications = [];
  isLoading = false;
  limit = 20;
  hasNextPage = true;
  async mounted() {
    await this.fetchNotifications();
  }

  // Actions
  async fetchNotifications() {
    if (this.isLoading || !this.hasNextPage) {
      // ignore if already fetching
      return;
    }
    this.isLoading = true;
    try {
      let response;
      let offset = this.notifications.length;

      response = await getAxios().get(
        `users/notification/${this.user.id}?offset=${offset}&limit=${this.limit}`
      );
      if (response.status === 200 && response.data.data.notifications) {
        this.hasNextPage = response.data.data.has_next_page;
        if (offset == 0) {
          this.notifications = response.data.data.notifications;
        } else {
          this.notifications = [
            ...this.notifications,
            ...response.data.data.notifications,
          ];
        }
        // mark read the notification
        this.markAsRead();
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.hasNextPage = false;
      }
    } catch (error) {
      // console.log(error);
      this.isLoading = false;
      this.hasNextPage = false;
    }
  }

  async markAsRead() {
    try {
      await getAxios().put(`users/notification/mark-read/${this.user.id}`);
    } catch (error) {}
  }

  // Getters
  get exmptyMsg() {
    return {
      title: this.$t("activityTab.empty.title"),
      description: this.$t("activityTab.empty.description"),
      img: true,
    };
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.container {
  max-width: 940px;
}
</style>