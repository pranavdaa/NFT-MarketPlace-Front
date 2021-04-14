import moment from "moment";

export default function(d) {
  return moment.unix(d).format("ddd, MMMM Do, YYYY");
}
