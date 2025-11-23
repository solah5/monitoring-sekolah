<template>
  <div class="relative w-full" ref="dropdownRef">
    <div class="relative">
      <input
        type="text"
        :placeholder="placeholder"
        :value="displayValue"
        @input="onInput"
        @focus="openDropdown"
        class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
      />
      <div
        class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </div>
    </div>

    <ul
      v-if="isOpen"
      class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
    >
      <li
        v-if="filteredOptions.length === 0"
        class="p-2 text-gray-500 text-sm text-center"
      >
        Tidak ada data ditemukan.
      </li>
      <li
        v-for="(option, index) in filteredOptions"
        :key="index"
        @click="selectOption(option)"
        class="p-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
      // Format options harus: [{ label: "Teks Tampil", value: "Nilai Asli", ...lainnya }]
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Pilih...",
    },
  },
  data() {
    return {
      isOpen: false,
      searchQuery: "",
      selectedLabel: "", // Untuk menyimpan nama yang ditampilkan setelah dipilih
    };
  },
  computed: {
    displayValue() {
      // Jika dropdown terbuka, tampilkan apa yang diketik user.
      // Jika tertutup, tampilkan label dari item yang sudah dipilih (modelValue)
      if (this.isOpen) return this.searchQuery;
      return this.modelValue; 
    },
    filteredOptions() {
      if (!this.searchQuery) return this.options;
      return this.options.filter((opt) =>
        opt.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    openDropdown() {
      this.isOpen = true;
      this.searchQuery = ""; // Reset pencarian saat dibuka agar semua opsi muncul
    },
    onInput(e) {
      this.searchQuery = e.target.value;
      this.isOpen = true;
      // Kita emit update kosong agar parent tahu user sedang mengetik ulang
      this.$emit("update:modelValue", e.target.value); 
    },
    selectOption(option) {
      this.selectedLabel = option.label;
      this.searchQuery = ""; // Reset search
      this.isOpen = false;
      this.$emit("update:modelValue", option.value); // Kirim nilai 'nama' ke v-model
      this.$emit("selected", option); // Kirim seluruh objek opsi (untuk ambil NIP/NISN)
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>