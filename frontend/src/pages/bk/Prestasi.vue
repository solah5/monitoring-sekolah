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
            <li><router-link to="/bk" class="nav-link"><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link></li>
            <li><router-link to="/bk/rekap" class="nav-link"><ChartBarIcon class="w-5 h-5" /><span>Rekap & Eligible</span></router-link></li>
            <li><router-link to="/bk/prestasi" class="nav-link nav-link-active"><TrophyIcon class="w-5 h-5" /><span>Prestasi Siswa</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto"><button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span></button></div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Kelola Prestasi Siswa</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button @click="openForm" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto justify-center transition-colors">
            <PlusIcon class="w-5 h-5" /><span>Tambah Prestasi</span>
          </button>
          <div class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3"><MagnifyingGlassIcon class="w-5 h-5 text-gray-400" /></span>
            <input v-model="searchQuery" type="text" placeholder="Cari siswa atau prestasi..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-4 px-6 w-16 text-center text-sm font-semibold text-gray-600">No</th>
                <th class="py-4 px-6 text-sm font-semibold text-gray-600">Nama Siswa</th>
                <th class="py-4 px-6 text-sm font-semibold text-gray-600">Judul Prestasi</th>
                <th class="py-4 px-6 text-sm font-semibold text-gray-600">Tingkat</th>
                <th class="py-4 px-6 text-sm font-semibold text-gray-600">Tahun</th>
                <th class="py-4 px-6 text-sm font-semibold text-gray-600 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0"><td colspan="6" class="py-8 text-center text-gray-500">{{ searchQuery ? 'Data tidak ditemukan.' : 'Belum ada data prestasi.' }}</td></tr>
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="border-b hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6 text-center text-gray-500 font-medium">#{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-4 px-6">
                    <div class="text-sm font-semibold text-gray-800">{{ item.nama_siswa }}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{{ item.kelas }} - {{ item.rombel }}</div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-700 font-medium">{{ item.judul_prestasi }}</td>
                <td class="py-4 px-6"><span class="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded text-xs font-bold border border-yellow-200">{{ item.tingkat }}</span></td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ item.tahun }}</td>
                <td class="py-4 px-6 text-center whitespace-nowrap">
                  <button @click="edit(item)" class="text-yellow-600 hover:text-yellow-700 p-1.5 rounded hover:bg-yellow-50 mr-2"><PencilIcon class="w-5 h-5" /></button>
                  <button @click="remove(item.id)" class="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50"><TrashIcon class="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</div>
          <div class="flex gap-2">
             <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Sebelumnya</button>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Selanjutnya</button>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" @click.self="closeForm">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl relative h-auto max-h-[90vh] overflow-visible">
        <button @click="closeForm" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">{{ isEdit ? "Edit Prestasi" : "Tambah Prestasi" }}</h3>

        <div class="space-y-4">
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
             <SearchableSelect 
                :options="siswaOptions" 
                v-model="form.siswa_nama" 
                @selected="(opt) => form.siswa_id = opt.originalId" 
                placeholder="Cari nama siswa..."
             />
             <p v-if="errors.siswa_id" class="text-red-600 text-xs mt-1">{{ errors.siswa_id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Prestasi</label>
            <input v-model="form.judul_prestasi" placeholder="Contoh: Juara 1 Lomba Futsal" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <p v-if="errors.judul_prestasi" class="text-red-600 text-xs mt-1">{{ errors.judul_prestasi }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                <select v-model="form.tingkat" class="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                   <option value="Sekolah">Sekolah</option>
                   <option value="Kecamatan">Kecamatan</option>
                   <option value="Kabupaten">Kabupaten</option>
                   <option value="Provinsi">Provinsi</option>
                   <option value="Nasional">Nasional</option>
                   <option value="Internasional">Internasional</option>
                </select>
             </div>
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input v-model="form.tahun" type="number" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <p v-if="errors.tahun" class="text-red-600 text-xs mt-1">{{ errors.tahun }}</p>
             </div>
          </div>
        </div>
        <button @click="save" class="w-full bg-blue-600 text-white py-2.5 rounded-lg mt-6 text-sm font-semibold hover:bg-blue-700 transition-colors">Simpan</button>
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
import { HomeIcon, ChartBarIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/prestasi`;

export default {
  components: { Toast, Avatar, SearchableSelect, HomeIcon, ChartBarIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      prestasiList: [],
      siswaList: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      showForm: false,
      isEdit: false,
      form: { id: null, siswa_id: null, siswa_nama: "", judul_prestasi: "", tingkat: "Sekolah", tahun: new Date().getFullYear() },
      errors: { siswa_id: "", judul_prestasi: "", tahun: "" }
    };
  },
  computed: {
    siswaOptions() {
       return this.siswaList.map(s => ({
          label: `${s.nama} (${s.kelas} - ${s.rombel})`,
          value: s.nama,
          originalId: s.id
       }));
    },
    filteredData() {
      if (!this.searchQuery) return this.prestasiList;
      const q = this.searchQuery.toLowerCase();
      return this.prestasiList.filter(item => item.nama_siswa.toLowerCase().includes(q) || item.judul_prestasi.toLowerCase().includes(q));
    },
    totalPages() { return Math.ceil(this.filteredData.length / this.itemsPerPage); },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async getData() {
       try {
         const [prestasiRes, siswaRes] = await Promise.all([
            axios.get(API_URL, this.getAuth()),
            axios.get(`${BASE_URL}/api/siswa`, this.getAuth())
         ]);
         this.prestasiList = prestasiRes.data;
         this.siswaList = siswaRes.data;
       } catch (e) { 
         if(e.response?.status === 401) this.logout();
         else console.error("Gagal load data:", e);
       }
    },
    openForm() { this.form = { id: null, siswa_id: null, siswa_nama: "", judul_prestasi: "", tingkat: "Sekolah", tahun: new Date().getFullYear() }; this.resetErrors(); this.isEdit = false; this.showForm = true; },
    edit(item) { this.form = { ...item, siswa_nama: item.nama_siswa }; this.resetErrors(); this.isEdit = true; this.showForm = true; },
    closeForm() { this.showForm = false; },
    resetErrors() { this.errors = { siswa_id: "", judul_prestasi: "", tahun: "" }; },
    validate() {
      let valid = true; this.resetErrors();
      if (!this.form.siswa_id) { this.errors.siswa_id = "Siswa wajib dipilih"; valid = false; }
      if (!this.form.judul_prestasi) { this.errors.judul_prestasi = "Judul wajib diisi"; valid = false; }
      if (!this.form.tahun) { this.errors.tahun = "Tahun wajib diisi"; valid = false; }
      return valid;
    },
    async save() {
       if(!this.validate()) return this.$refs.toast.show("Periksa input!", "error");
       try {
          if(this.isEdit) await axios.put(`${API_URL}/${this.form.id}`, this.form, this.getAuth());
          else await axios.post(API_URL, this.form, this.getAuth());
          this.showForm = false; this.getData(); this.$refs.toast.show("Berhasil!", "success");
       } catch(e) { this.$refs.toast.show("Terjadi kesalahan", "error"); }
    },
    async remove(id) {
       if(!confirm("Hapus?")) return;
       try { await axios.delete(`${API_URL}/${id}`, this.getAuth()); this.getData(); }
       catch(e) { this.$refs.toast.show("Gagal hapus", "error"); }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    logout() { localStorage.clear(); this.$router.push("/"); }
  },
  mounted() { this.getData(); this.$router.afterEach(() => { this.openSidebar = false; }); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
</style>