<template>
  <div class="min-h-screen bg-gray-50 flex">
    <div
      v-if="openSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="openSidebar = false"
    ></div>

    <aside
      :class="[
        'h-screen w-64 bg-[#0057A8] text-white flex-col overflow-y-auto transition-transform duration-300 fixed md:relative z-50',
        openSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        openSidebar ? 'flex' : 'hidden md:flex',
      ]"
    >
      <div class="relative z-50 bg-[#0057A8] h-full flex flex-col">
        <button
          @click="openSidebar = false"
          class="md:hidden absolute top-4 right-4 p-1 text-white"
        >
          <XMarkIcon class="w-7 h-7" />
        </button>

        <div class="flex flex-col items-center mt-8 gap-3 px-2 text-center">
          <img src="/logo-sma.png" class="w-20" />
          <h1 class="text-base font-semibold leading-tight">
            SMA Negeri 1<br />Gunung Sindur
          </h1>
        </div>

        <nav class="flex-1 w-full mt-10 px-4">
          <ul class="space-y-3">
            <li>
              <router-link to="/admin" class="nav-link">
                <HomeIcon class="w-5 h-5" /><span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/guru" class="nav-link">
                <UserGroupIcon class="w-5 h-5" /><span>Kelola Guru</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/guru-bk" class="nav-link">
                <ClipboardDocumentCheckIcon class="w-5 h-5" /><span>Kelola Guru BK</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/siswa" class="nav-link nav-link-active">
                <AcademicCapIcon class="w-5 h-5" /><span>Kelola Siswa</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/mapel" class="nav-link">
                <BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/users" class="nav-link">
                <UsersIcon class="w-5 h-5" /><span>Kelola Akun</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="p-4 mt-auto">
          <button
            @click="logout"
            class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeftOnRectangleIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            @click="openSidebar = true"
            class="md:hidden p-1 text-gray-700"
          >
            <Bars3Icon class="w-7 h-7" />
          </button>
          <div class="hidden md:block">
            <h1 class="text-lg font-semibold text-gray-700">
              Kelola Data Siswa
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-600 text-sm hidden md:block">
              Halo, <b>{{ user?.name }}</b>
            </span>
            <Avatar :name="user?.name" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <h2 class="md:hidden text-2xl font-bold text-gray-800 mb-6">
          Kelola Data Siswa
        </h2>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          <div class="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              @click="openForm"
              class="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 flex-1 md:flex-none transition-colors"
            >
              <PlusIcon class="w-5 h-5" />
              <span>Tambah</span>
            </button>
            
            <button
              @click="exportExcel"
              class="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2 flex-1 md:flex-none transition-colors"
            >
              <TableCellsIcon class="w-5 h-5" />
              <span>Excel</span>
            </button>

            <button
              @click="exportPDF"
              class="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 flex-1 md:flex-none transition-colors"
            >
              <DocumentTextIcon class="w-5 h-5" />
              <span>PDF</span>
            </button>
          </div>

          <div class="relative w-full md:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau NIS..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
            />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap w-12">No</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">NIS</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Nama Siswa</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Kelas</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Rombel</th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0">
                <td colspan="6" class="py-6 text-center text-gray-500">
                   {{ searchQuery ? 'Data tidak ditemukan.' : 'Memuat data...' }}
                </td>
              </tr>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap font-mono">
                    {{ item.nis }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700 font-bold whitespace-nowrap">
                    {{ item.nama }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap">
                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                      {{ item.kelas }}
                    </span>
                </td>
                <td class="py-3 px-5 text-sm text-gray-700 whitespace-nowrap">
                    {{ item.rombel }}
                </td>
                <td class="py-3 px-5 text-sm text-center whitespace-nowrap">
                  <button
                    @click="edit(item)"
                    class="text-yellow-600 hover:text-yellow-700 p-1 mx-1"
                    title="Edit"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="remove(item.id)"
                    class="text-red-600 hover:text-red-700 p-1 mx-1"
                    title="Hapus"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
          <div class="text-sm text-gray-500">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </div>
          <div class="flex gap-2">
             <button 
               @click="prevPage" 
               :disabled="currentPage === 1"
               class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
             >
               Sebelumnya
             </button>
             <button 
               @click="nextPage" 
               :disabled="currentPage === totalPages"
               class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
             >
               Selanjutnya
             </button>
          </div>
        </div>

      </main>
    </div>

    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeForm"
    >
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          @click="closeForm"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">
          {{ isEdit ? "Edit Siswa" : "Tambah Siswa" }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">NIS</label>
            <input
              v-model="form.nis"
              placeholder="Masukkan NIS"
              class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.nis" class="text-red-600 text-sm mt-1">
              {{ errors.nis }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <input
              v-model="form.nama"
              placeholder="Masukkan nama siswa"
              class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.nama" class="text-red-600 text-sm mt-1">
              {{ errors.nama }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Kelas</label>
              <select
                v-model="form.kelas"
                class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Pilih --</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
              <p v-if="errors.kelas" class="text-red-600 text-sm mt-1">
                {{ errors.kelas }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Rombel</label>
              <input
                v-model="form.rombel"
                placeholder="Contoh: 1, 2, IPA 1"
                class="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errors.rombel" class="text-red-600 text-sm mt-1">
                {{ errors.rombel }}
              </p>
            </div>
          </div>
        </div>

        <button
          @click="save"
          class="bg-blue-600 text-white w-full py-2.5 rounded-lg mt-6 text-sm font-medium hover:bg-blue-700"
        >
          Simpan
        </button>
      </div>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon, 
  TableCellsIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/siswa`;

export default {
  components: {
    Toast,
    Avatar,
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    UsersIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon,
    TableCellsIcon,
    DocumentTextIcon,
  },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      siswa: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      showForm: false,
      isEdit: false,
      // FIELD FORM DISESUAIKAN: nis, nama, kelas, rombel
      form: { id: null, nama: "", nis: "", kelas: "", rombel: "" },
      errors: { nama: "", nis: "", kelas: "", rombel: "" },
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.siswa;
      const lowerQuery = this.searchQuery.toLowerCase();
      return this.siswa.filter(item => 
        item.nama.toLowerCase().includes(lowerQuery) || 
        item.nis.includes(lowerQuery)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    }
  },
  methods: {
    getAuthConfig() {
      const token = localStorage.getItem("token");
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    async getData() {
      try {
        const { data } = await axios.get(API_URL, this.getAuthConfig());
        this.siswa = data;
      } catch (e) {
        this.$refs.toast.show("Gagal mengambil data siswa", "error");
        if (e.response?.status === 401) this.logout();
      }
    },
    
    // --- EXPORT EXCEL ---
    exportExcel() {
      try {
        const dataToExport = this.filteredData.map(s => ({
          "Nama Lengkap": s.nama,
          "NIS": s.nis,
          "Kelas": s.kelas,
          "Rombel": s.rombel
        }));

        if (dataToExport.length === 0) return this.$refs.toast.show("Tidak ada data", "error");

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");

        XLSX.writeFile(wb, "Data_Siswa.xlsx");
        this.$refs.toast.show("Download Excel Berhasil!", "success");
      } catch (e) {
        this.$refs.toast.show("Gagal download", "error");
      }
    },

    // --- EXPORT PDF ---
    exportPDF() {
        try {
            if (this.filteredData.length === 0) return this.$refs.toast.show("Tidak ada data", "error");

            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("Data Siswa SMA Negeri 1 Gunung Sindur", 14, 22);
            doc.setFontSize(11);
            doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

            const tableColumn = ["No", "NIS", "Nama", "Kelas", "Rombel"];
            const tableRows = [];

            this.filteredData.forEach((s, index) => {
                tableRows.push([
                    index + 1,
                    s.nis,
                    s.nama,
                    s.kelas,
                    s.rombel
                ]);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
            });

            doc.save("Data_Siswa.pdf");
            this.$refs.toast.show("Download PDF Berhasil!", "success");
        } catch(e) {
            this.$refs.toast.show("Gagal download PDF", "error");
        }
    },

    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    
    openForm() {
      this.form = { id: null, nama: "", nis: "", kelas: "", rombel: "" };
      this.resetErrors();
      this.isEdit = false;
      this.showForm = true;
    },
    edit(item) {
      this.form = { ...item };
      this.resetErrors();
      this.isEdit = true;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    validate() {
      let valid = true;
      this.resetErrors();

      if (!this.form.nis) { this.errors.nis = "NIS wajib diisi"; valid = false; }
      else if (!/^[0-9]+$/.test(this.form.nis)) { this.errors.nis = "NIS harus angka"; valid = false; }
      
      if (!this.form.nama) { this.errors.nama = "Nama wajib diisi"; valid = false; }
      if (!this.form.kelas) { this.errors.kelas = "Kelas wajib dipilih"; valid = false; }
      if (!this.form.rombel) { this.errors.rombel = "Rombel wajib diisi"; valid = false; }

      return valid;
    },
    resetErrors() {
      this.errors = { nama: "", nis: "", kelas: "", rombel: "" };
    },
    async save() {
      if (!this.validate()) return this.$refs.toast.show("Lengkapi data inputan!", "error");

      try {
        if (this.isEdit) {
          await axios.put(`${API_URL}/${this.form.id}`, this.form, this.getAuthConfig());
          this.$refs.toast.show("Siswa berhasil diperbarui!", "success");
        } else {
          await axios.post(API_URL, this.form, this.getAuthConfig());
          this.$refs.toast.show("Siswa berhasil ditambahkan!", "success");
        }
        this.showForm = false;
        this.getData();
      } catch (e) {
        this.$refs.toast.show(e.response?.data?.message || "Terjadi kesalahan!", "error");
      }
    },
    async remove(id) {
      if (!confirm("Yakin ingin menghapus siswa ini?")) return;
      try {
        await axios.delete(`${API_URL}/${id}`, this.getAuthConfig());
        this.$refs.toast.show("Siswa berhasil dihapus!", "success");
        this.getData();
      } catch (e) {
        this.$refs.toast.show("Gagal menghapus!", "error");
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
  mounted() {
    this.getData();
    this.$router.afterEach(() => {
      this.openSidebar = false;
    });
  },
};
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors;
}
.nav-link-active {
  @apply bg-white text-[#0057A8] font-semibold shadow;
}
</style>