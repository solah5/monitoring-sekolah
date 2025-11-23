<template>
  <router-view />
  <Toast ref="toast" />
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  components: { Toast },

  mounted() {
    // buat global reference
    window.$toast = this.$refs.toast;
  },
};
</script>
