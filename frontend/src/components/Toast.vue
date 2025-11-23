<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-[9999] px-4 py-2 rounded shadow text-white"
      :class="bgColor"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      type: "success",
      timeout: null,
    };
  },

  computed: {
    bgColor() {
      return {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
      }[this.type];
    },
  },

  methods: {
    show(msg, type = "success") {
      this.message = msg;
      this.type = type;
      this.visible = true;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = false;
      }, 2500);
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
