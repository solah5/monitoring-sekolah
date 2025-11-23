<template>
  <div
    class="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold text-sm"
    :title="name"
  >
    {{ initials }}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "User",
    },
  },
  computed: {
    initials() {
      if (!this.name) return "?";
      const words = this.name.split(" ");
      if (words.length > 1) {
        // Ambil huruf pertama dari 2 kata pertama
        return (words[0][0] + words[1][0]).toUpperCase();
      } else if (words[0].length > 1) {
        // Ambil 2 huruf pertama dari 1 kata
        return words[0].substring(0, 2).toUpperCase();
      } else {
        // Default jika hanya 1 huruf
        return words[0][0].toUpperCase();
      }
    },
  },
};
</script>