import pascal from "./pascal";
import date_human from "./date_human";
import Vue from "vue";

Vue.filter("pascal", pascal);
Vue.filter("date-human", date_human);
