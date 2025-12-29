<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <div v-if="openSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" @click="openSidebar = false"></div>
    <aside :class="['h-screen w-64 bg-[#0057A8] text-white flex-col overflow-y-auto transition-transform duration-300 fixed md:relative z-50', openSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0', openSidebar ? 'flex' : 'hidden md:flex']">
      <div class="relative z-50 bg-[#0057A8] h-full flex flex-col">
        <button @click="openSidebar = false" class="md:hidden absolute top-4 right-4 p-1 text-white"><XMarkIcon class="w-7 h-7" /></button>
        <div class="flex flex-col items-center mt-8 gap-3 px-2 text-center">
          <img src="/logo-sma.png" class="w-20" />
          <h1 class="text-base font-semibold leading-tight">SMA Negeri 1<br />Gunung Sindur</h1>
        </div>
        <nav class="flex-1 w-full mt-10 px-4">
          <ul class="space-y-3">
            <li><router-link to="/admin" class="nav-link"><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link></li>
            <li><router-link to="/admin/guru" class="nav-link"><UserGroupIcon class="w-5 h-5" /><span>Kelola Guru</span></router-link></li>
            <li><router-link to="/admin/guru-bk" class="nav-link nav-link-active"><ClipboardDocumentCheckIcon class="w-5 h-5" /><span>Kelola Guru BK</span></router-link></li>
            <li><router-link to="/admin/siswa" class="nav-link"><AcademicCapIcon class="w-5 h-5" /><span>Kelola Siswa</span></router-link></li>
            <li><router-link to="/admin/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span></router-link></li>
            <li><router-link to="/admin/users" class="nav-link"><UsersIcon class="w-5 h-5" /><span>Kelola Akun</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto"><button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span></button></div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Kelola Data Guru BK</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <div class="flex justify-between mb-6">
          <button @click="openForm" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><PlusIcon class="w-5 h-5" /><span>Tambah Guru BK</span></button>
          <input v-model="searchQuery" type="text" placeholder="Cari..." class="w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 w-12">No</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">NIP</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">Nama</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredData.length === 0"><td colspan="4" class="py-6 text-center text-gray-500">Data tidak ditemukan.</td></tr>
              <tr v-for="(item, index) in filteredData" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-5 text-sm text-gray-700">{{ index + 1 }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 font-mono">{{ item.nip }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 font-bold">{{ item.nama }}</td>
                <td class="py-3 px-5 text-sm text-center">
                  <button @click="edit(item)" class="text-yellow-600 hover:text-yellow-700 p-1 mx-1"><PencilIcon class="w-5 h-5" /></button>
                  <button @click="remove(item.id)" class="text-red-600 hover:text-red-700 p-1 mx-1"><TrashIcon class="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeForm">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
        <button @click="closeForm" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">{{ isEdit ? "Edit Guru BK" : "Tambah Guru BK" }}</h3>
        <div class="space-y-4">
          <div><label class="block text-sm font-medium mb-1">NIP</label><input v-model="form.nip" class="border p-2 w-full rounded" /></div>
          <div><label class="block text-sm font-medium mb-1">Nama</label><input v-model="form.nama" class="border p-2 w-full rounded" /></div>
        </div>
        <button @click="save" class="bg-blue-600 text-white w-full py-2.5 rounded mt-6 hover:bg-blue-700">Simpan</button>
      </div>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import { HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/guru-bk`;

export default {
  components: { Toast, Avatar, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      dataList: [],
      searchQuery: "",
      showForm: false,
      isEdit: false,
      form: { id: null, nama: "", nip: "" },
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.dataList;
      const q = this.searchQuery.toLowerCase();
      return this.dataList.filter(i => i.nama.toLowerCase().includes(q) || i.nip.includes(q));
    }
  },
  methods: {
    getAuthConfig() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async getData() {
      try {
        const { data } = await axios.get(API_URL, this.getAuthConfig());
        this.dataList = data;
      } catch (e) { this.$refs.toast.show("Gagal data", "error"); }
    },
    openForm() { this.form = { id: null, nama: "", nip: "" }; this.isEdit = false; this.showForm = true; },
    edit(item) { this.form = { ...item }; this.isEdit = true; this.showForm = true; },
    closeForm() { this.showForm = false; },
    async save() {
      if (!this.form.nama || !this.form.nip) return this.$refs.toast.show("Isi semua data", "error");
      try {
        const auth = this.getAuthConfig();
        if (this.isEdit) await axios.put(`${API_URL}/${this.form.id}`, this.form, auth);
        else await axios.post(API_URL, this.form, auth);
        this.showForm = false; this.getData(); this.$refs.toast.show("Berhasil!", "success");
      } catch (e) { this.$refs.toast.show("Gagal simpan", "error"); }
    },
    async remove(id) {
      if (!confirm("Hapus?")) return;
      try { await axios.delete(`${API_URL}/${id}`, this.getAuthConfig()); this.getData(); this.$refs.toast.show("Terhapus", "success"); }
      catch (e) { this.$refs.toast.show("Gagal hapus", "error"); }
    },
    logout() { localStorage.clear(); this.$router.push("/"); }
  },
  mounted() { this.getData(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
</style>