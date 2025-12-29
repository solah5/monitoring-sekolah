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
            <li><router-link to="/admin/guru" class="nav-link nav-link-active"><UserGroupIcon class="w-5 h-5" /><span>Kelola Guru</span></router-link></li>
            <li><router-link to="/admin/guru-bk" class="nav-link"><ClipboardDocumentCheckIcon class="w-5 h-5" /><span>Kelola Guru BK</span></router-link></li>
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
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Kelola Data Guru</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button @click="openForm" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto justify-center">
            <PlusIcon class="w-5 h-5" /><span>Tambah Guru</span>
          </button>
          <div class="relative w-full md:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3"><MagnifyingGlassIcon class="w-5 h-5 text-gray-400" /></span>
            <input v-model="searchQuery" type="text" placeholder="Cari nama atau NIP..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 w-12">No</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">NIP</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">Nama Guru</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">Jabatan</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">Wali Kelas</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0"><td colspan="6" class="py-6 text-center text-gray-500">Data tidak ditemukan.</td></tr>
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-5 text-sm text-gray-700">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 font-mono">{{ item.nip }}</td>
                <td class="py-3 px-5 text-sm text-gray-700 font-bold">{{ item.nama }}</td>
                <td class="py-3 px-5 text-sm text-gray-700"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">{{ item.jabatan }}</span></td>
                <td class="py-3 px-5 text-sm text-gray-700">
                    {{ item.wali_kelas_tingkat ? `${item.wali_kelas_tingkat} - ${item.wali_kelas_rombel}` : '-' }}
                </td>
                <td class="py-3 px-5 text-sm text-center">
                  <button @click="edit(item)" class="text-yellow-600 hover:text-yellow-700 p-1 mx-1"><PencilIcon class="w-5 h-5" /></button>
                  <button @click="remove(item.id)" class="text-red-600 hover:text-red-700 p-1 mx-1"><TrashIcon class="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
          <div class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</div>
          <div class="flex gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm">Sebelumnya</button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm">Selanjutnya</button>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeForm">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative h-auto max-h-[90vh] overflow-visible">
        <button @click="closeForm" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">{{ isEdit ? "Edit Guru" : "Tambah Guru" }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">NIP</label>
            <input v-model="form.nip" class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500" placeholder="NIP Guru" />
            <p v-if="errors.nip" class="text-red-600 text-sm mt-1">{{ errors.nip }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input v-model="form.nama" class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500" placeholder="Nama Guru" />
            <p v-if="errors.nama" class="text-red-600 text-sm mt-1">{{ errors.nama }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Jabatan</label>
            <select v-model="form.jabatan" class="border p-2 w-full rounded bg-white">
                <option disabled value="">-- Pilih Jabatan --</option>
                <option value="Guru Mapel">Guru Mapel</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                <option value="Guru BK">Guru BK</option>
                <option value="Staf TU">Staf TU</option>
            </select>
            <p v-if="errors.jabatan" class="text-red-600 text-sm mt-1">{{ errors.jabatan }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Wali Kelas (Tingkat)</label>
                <select v-model="form.wali_kelas_tingkat" class="border p-2 w-full rounded bg-white">
                    <option value="">-- Pilih --</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Rombel</label>
                <input v-model="form.wali_kelas_rombel" class="border p-2 w-full rounded" placeholder="Contoh: 1, IPA 1" />
              </div>
          </div>
          <p class="text-xs text-gray-500">*Kosongkan Wali Kelas jika tidak menjabat.</p>
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

export default {
  components: { Toast, Avatar, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      guru: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      showForm: false,
      isEdit: false,
      // UPDATE STRUKTUR FORM
      form: { id: null, nama: "", nip: "", jabatan: "", wali_kelas_tingkat: "", wali_kelas_rombel: "" },
      errors: { nama: "", nip: "", jabatan: "" },
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.guru;
      const q = this.searchQuery.toLowerCase();
      return this.guru.filter(i => i.nama.toLowerCase().includes(q) || i.nip.includes(q));
    },
    totalPages() { return Math.ceil(this.filteredData.length / this.itemsPerPage); },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    }
  },
  watch: { searchQuery() { this.currentPage = 1; } },
  methods: {
    getAuthConfig() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async getData() {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/guru`, this.getAuthConfig());
        this.guru = data;
      } catch (e) { if (e.response?.status === 401) this.logout(); }
    },
    openForm() { 
        this.form = { id: null, nama: "", nip: "", jabatan: "", wali_kelas_tingkat: "", wali_kelas_rombel: "" }; 
        this.resetErrors(); this.isEdit = false; this.showForm = true; 
    },
    edit(item) { this.form = { ...item }; this.resetErrors(); this.isEdit = true; this.showForm = true; },
    closeForm() { this.showForm = false; },
    validate() {
      let valid = true;
      this.resetErrors();
      if (!this.form.nip) { this.errors.nip = "NIP wajib diisi"; valid = false; }
      if (!this.form.nama) { this.errors.nama = "Nama wajib diisi"; valid = false; }
      if (!this.form.jabatan) { this.errors.jabatan = "Jabatan wajib dipilih"; valid = false; }
      return valid;
    },
    resetErrors() { this.errors = { nama: "", nip: "", jabatan: "" }; },
    async save() {
      if (!this.validate()) return this.$refs.toast.show("Lengkapi data!", "error");
      try {
        const auth = this.getAuthConfig();
        if (this.isEdit) await axios.put(`${BASE_URL}/api/guru/${this.form.id}`, this.form, auth);
        else await axios.post(`${BASE_URL}/api/guru`, this.form, auth);
        this.showForm = false; this.getData(); this.$refs.toast.show("Berhasil!", "success");
      } catch (e) { this.$refs.toast.show("Gagal menyimpan", "error"); }
    },
    async remove(id) {
      if (!confirm("Hapus?")) return;
      try { await axios.delete(`${BASE_URL}/api/guru/${id}`, this.getAuthConfig()); this.getData(); }
      catch (e) { this.$refs.toast.show("Gagal hapus", "error"); }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    logout() { localStorage.clear(); this.$router.push("/"); },
  },
  mounted() { this.getData(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
</style>