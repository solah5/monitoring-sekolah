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
            <li><router-link to="/admin/guru-bk" class="nav-link"><ClipboardDocumentCheckIcon class="w-5 h-5" /><span>Kelola Guru BK</span></router-link></li>
            <li><router-link to="/admin/siswa" class="nav-link"><AcademicCapIcon class="w-5 h-5" /><span>Kelola Siswa</span></router-link></li>
            <li><router-link to="/admin/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span></router-link></li>
            <li><router-link to="/admin/users" class="nav-link nav-link-active"><UsersIcon class="w-5 h-5" /><span>Kelola Akun</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto"><button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span></button></div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Kelola Akun Pengguna</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button @click="openForm" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto justify-center">
            <PlusIcon class="w-5 h-5" /><span>Tambah Akun</span>
          </button>
          <div class="relative w-full md:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3"><MagnifyingGlassIcon class="w-5 h-5 text-gray-400" /></span>
            <input v-model="searchQuery" type="text" placeholder="Cari nama atau username..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Nama</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Username</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Role</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0"><td colspan="4" class="py-6 text-center text-gray-500">{{ searchQuery ? 'Data tidak ditemukan.' : 'Memuat data...' }}</td></tr>
              <tr v-for="item in paginatedData" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap">{{ item.name }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap">{{ item.username }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 capitalize whitespace-nowrap">{{ item.role }}</td>
                <td class="py-3 px-5 text-sm text-center whitespace-nowrap">
                  <button @click="edit(item)" class="text-yellow-600 hover:text-yellow-700 p-1 mx-1" title="Edit"><PencilIcon class="w-5 h-5" /></button>
                  <button @click="remove(item.id)" class="text-red-600 hover:text-red-700 p-1 mx-1" :disabled="item.id === user.id" :class="{ 'opacity-50 cursor-not-allowed': item.id === user.id }" title="Hapus"><TrashIcon class="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
          <div class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</div>
          <div class="flex gap-2">
             <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Sebelumnya</button>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Selanjutnya</button>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeForm">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative h-auto max-h-[90vh] overflow-visible">
        <button @click="closeForm" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">{{ isEdit ? "Edit Akun" : "Tambah Akun" }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select v-model="form.role" @change="onRoleChange" class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="bk">Guru BK</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <input v-if="form.role === 'admin' || form.role === 'bk'" v-model="form.name" placeholder="Nama Lengkap" class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
            <SearchableSelect v-else-if="form.role === 'guru'" :options="formattedOptions.guru" v-model="form.name" @selected="onUserSelected" placeholder="Cari nama Guru..." />
            <SearchableSelect v-else-if="form.role === 'siswa'" :options="formattedOptions.siswa" v-model="form.name" @selected="onUserSelected" placeholder="Cari nama Siswa..." />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input v-model="form.username" placeholder="Username (Otomatis NIP/NIS)" class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input v-model="form.password" type="password" :placeholder="isEdit ? 'Kosongkan jika tidak ganti' : 'Password'" class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <button @click="save" class="bg-blue-600 text-white w-full py-2.5 rounded-lg mt-6 text-sm font-medium hover:bg-blue-700">Simpan</button>
      </div>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import SearchableSelect from "@/components/SearchableSelect.vue";
import { HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/users`;

export default {
  components: { Toast, Avatar, SearchableSelect, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      users: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      rawData: { guru: [], siswa: [] }, // Data untuk dropdown
      showForm: false,
      isEdit: false,
      form: { id: null, name: "", username: "", password: "", role: "guru", link_id: null }
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.users;
      const lower = this.searchQuery.toLowerCase();
      return this.users.filter(u => u.name.toLowerCase().includes(lower) || u.username.toLowerCase().includes(lower));
    },
    totalPages() { return Math.ceil(this.filteredData.length / this.itemsPerPage); },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    formattedOptions() {
      return {
        guru: this.rawData.guru.map(g => ({ label: `${g.nama} (NIP: ${g.nip})`, value: g.nama, meta: g.nip, id: g.id })),
        siswa: this.rawData.siswa.map(s => ({ label: `${s.nama} (Kelas: ${s.kelas})`, value: s.nama, meta: s.nis, id: s.id }))
      };
    }
  },
  watch: { searchQuery() { this.currentPage = 1; } },
  methods: {
    getAuthConfig() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async getData() {
      try {
        // PERBAIKAN LOGIKA: Ambil Users & Options sekaligus dari endpoint baru
        const { data } = await axios.get(API_URL, this.getAuthConfig());
        this.users = data.users; // List User
        this.rawData.guru = data.options.guru; // Dropdown Guru
        this.rawData.siswa = data.options.siswa; // Dropdown Siswa
      } catch (e) {
        if (e.response?.status === 401) this.logout();
      }
    },
    openForm() {
      this.form = { id: null, name: "", username: "", password: "", role: "guru", link_id: null };
      this.isEdit = false;
      this.showForm = true;
    },
    edit(item) {
      this.form = { ...item, password: "" };
      this.isEdit = true;
      this.showForm = true;
    },
    onRoleChange() {
      if (!this.isEdit) { this.form.name = ""; this.form.username = ""; this.form.link_id = null; }
    },
    onUserSelected(option) {
      if (option) {
        this.form.username = option.meta; // Auto-fill Username dengan NIP/NIS
        this.form.link_id = option.id;    // Simpan ID asli Guru/Siswa untuk relasi
      }
    },
    closeForm() { this.showForm = false; },
    async save() {
      if (!this.form.name || !this.form.username) return this.$refs.toast.show("Lengkapi data!", "error");
      try {
        const auth = this.getAuthConfig();
        if (this.isEdit) await axios.put(`${API_URL}/${this.form.id}`, this.form, auth);
        else await axios.post(API_URL, this.form, auth);
        this.$refs.toast.show("Berhasil!", "success");
        this.showForm = false;
        this.getData();
      } catch (e) { this.$refs.toast.show("Gagal menyimpan", "error"); }
    },
    async remove(id) {
      if (!confirm("Hapus akun?")) return;
      try {
        await axios.delete(`${API_URL}/${id}`, this.getAuthConfig());
        this.$refs.toast.show("Terhapus!", "success");
        this.getData();
      } catch (e) { this.$refs.toast.show("Gagal menghapus", "error"); }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    logout() { localStorage.clear(); this.$router.push("/"); }
  },
  mounted() { this.getData(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
</style>