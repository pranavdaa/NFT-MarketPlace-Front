export default function(s) {
  return (s == null ? "" : s)
    .toString()
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}
