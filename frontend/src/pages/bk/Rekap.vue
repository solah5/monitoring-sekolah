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
              <router-link to="/bk" class="nav-link">
                <HomeIcon class="w-5 h-5" />
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/bk/rekap" class="nav-link nav-link-active">
                <ChartBarIcon class="w-5 h-5" />
                <span>Rekap & Eligible</span>
              </router-link>
            </li>
            <li>
              <router-link to="/bk/prestasi" class="nav-link">
                <TrophyIcon class="w-5 h-5" />
                <span>Prestasi Siswa</span>
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
              Rekapitulasi Nilai Siswa
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
          Rekapitulasi Nilai Siswa
        </h2>

        <div class="flex justify-end mb-6">
          <div class="relative w-full md:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari siswa atau kelas..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Peringkat
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Nama Siswa
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Kelas
                </th>
                <th
                  class="py-3 px-5 text-sm font-semibold text-gray-600 text-center"
                >
                  Rata-rata
                </th>
                <th
                  class="py-3 px-5 text-sm font-semibold text-gray-600 text-center"
                >
                  Prestasi
                </th>
                <th
                  class="py-3 px-5 text-sm font-semibold text-gray-600 text-center"
                >
                  Status Eligible
                </th>
                <th
                  class="py-3 px-5 text-sm font-semibold text-gray-600 text-center"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0">
                <td colspan="7" class="py-6 text-center text-gray-500">
                  {{ searchQuery ? 'Siswa tidak ditemukan.' : 'Memuat data...' }}
                </td>
              </tr>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-5 text-center font-bold text-gray-500">
                  #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700">
                  {{ item.nama }} <br /><span class="text-xs text-gray-400">{{ item.nis }}</span>
                </td>
                <td class="py-3 px-5 text-sm text-gray-700">
                  {{ item.kelas }}
                </td>
                <td class="py-3 px-5 text-sm font-bold text-center text-blue-700">
                  {{ parseFloat(item.rata_rata).toFixed(2) }}
                </td>
                <td class="py-3 px-5 text-center">
                  <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    {{ item.jumlah_prestasi }}
                  </span>
                </td>
                <td class="py-3 px-5 text-center">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': item.status_eligible === 'Eligible',
                      'bg-red-100 text-red-800': item.status_eligible === 'Tidak Eligible',
                      'bg-gray-100 text-gray-800': item.status_eligible === 'Pending',
                    }"
                    class="px-2 py-1 rounded text-xs font-semibold"
                    >{{ item.status_eligible }}</span
                  >
                </td>
                <td class="py-3 px-5 text-center whitespace-nowrap">
                  <button
                    @click="openDetail(item)"
                    class="text-blue-600 hover:underline text-sm mr-3 font-medium"
                  >
                    Detail Nilai
                  </button>
                  <button
                    @click="openEligible(item)"
                    class="text-purple-600 hover:underline text-sm font-medium"
                  >
                    Set Status
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
      v-if="showDetail"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
      @click.self="showDetail = false"
    >
      <div
        class="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="showDetail = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        <h3 class="text-xl font-bold mb-2 text-gray-800">
          {{ selectedSiswa?.nama }}
        </h3>
        <p class="text-sm text-gray-500 mb-4">Rincian Nilai dan Prestasi</p>

        <h4 class="font-semibold mb-2 text-gray-700">Daftar Nilai</h4>
        <div class="border rounded-lg overflow-hidden mb-6">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-2 font-medium text-gray-600">Mapel</th>
                <th class="p-2 font-medium text-gray-600">Jenis</th>
                <th class="p-2 font-medium text-gray-600">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="n in detailData.nilai"
                :key="n.id"
                class="border-t"
              >
                <td class="p-2">{{ n.nama_mapel }}</td>
                <td class="p-2">{{ n.jenis_nilai }}</td>
                <td class="p-2 font-bold text-gray-800">{{ n.nilai }}</td>
              </tr>
              <tr v-if="detailData.nilai.length === 0">
                <td colspan="3" class="p-2 text-center text-gray-500">
                  Belum ada nilai
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="font-semibold mb-2 text-gray-700">Daftar Prestasi</h4>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-2 font-medium text-gray-600">Judul</th>
                <th class="p-2 font-medium text-gray-600">Tingkat</th>
                <th class="p-2 font-medium text-gray-600">Tahun</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in detailData.prestasi"
                :key="p.id"
                class="border-t"
              >
                <td class="p-2">{{ p.judul_prestasi }}</td>
                <td class="p-2">{{ p.tingkat }}</td>
                <td class="p-2">{{ p.tahun }}</td>
              </tr>
              <tr v-if="detailData.prestasi.length === 0">
                <td colspan="3" class="p-2 text-center text-gray-500">
                  Belum ada prestasi
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showEligible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
      @click.self="showEligible = false"
    >
      <div class="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative">
        <button
          @click="showEligible = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">
          Set Status Eligible
        </h3>
        <p class="mb-4 text-sm text-gray-600">
          Tentukan status untuk <b>{{ selectedSiswa?.nama }}</b>:
        </p>
        <div class="space-y-2">
          <button
            @click="setStatus('Eligible')"
            class="w-full bg-green-100 text-green-800 py-2 rounded font-semibold hover:bg-green-200 transition"
          >
            Eligible (Layak)
          </button>
          <button
            @click="setStatus('Tidak Eligible')"
            class="w-full bg-red-100 text-red-800 py-2 rounded font-semibold hover:bg-red-200 transition"
          >
            Tidak Eligible
          </button>
          <button
            @click="setStatus('Pending')"
            class="w-full bg-gray-100 text-gray-800 py-2 rounded font-semibold hover:bg-gray-200 transition"
          >
            Pending
          </button>
        </div>
      </div>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import {
  HomeIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";

// Gunakan BASE_URL dari environment variable
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/bk`;

export default {
  components: {
    Toast,
    Avatar,
    HomeIcon,
    ChartBarIcon,
    TrophyIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
  },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      siswaList: [],
      
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,

      showDetail: false,
      showEligible: false,
      selectedSiswa: null,
      detailData: { nilai: [], prestasi: [] },
    };
  },
  computed: {
    // 1. Filter data berdasarkan pencarian
    filteredData() {
      if (!this.searchQuery) return this.siswaList;
      const q = this.searchQuery.toLowerCase();
      return this.siswaList.filter(item => 
        item.nama.toLowerCase().includes(q) || 
        item.kelas.toLowerCase().includes(q) ||
        item.nis.includes(q)
      );
    },
    // 2. Hitung total halaman
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    // 3. Potong data untuk halaman saat ini
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    }
  },
  watch: {
    // Reset ke halaman 1 jika user melakukan pencarian baru
    searchQuery() {
      this.currentPage = 1;
    }
  },
  methods: {
    getAuthConfig() {
      const token = localStorage.getItem("token");
      return {
        headers: { Authorization: `Bearer ${token}` },
      };
    },
    async getData() {
      try {
        const { data } = await axios.get(`${API_URL}/rekap`, this.getAuthConfig());
        this.siswaList = data;
      } catch (e) {
        console.error(e);
        if(e.response?.status === 401) this.logout();
      }
    },
    async openDetail(item) {
      this.selectedSiswa = item;
      try {
        const { data } = await axios.get(
          `${API_URL}/detail/${item.id}`,
          this.getAuthConfig()
        );
        this.detailData = data;
        this.showDetail = true;
      } catch (e) {
        this.$refs.toast.show("Gagal ambil detail", "error");
      }
    },
    openEligible(item) {
      this.selectedSiswa = item;
      this.showEligible = true;
    },
    async setStatus(status) {
      try {
        await axios.put(
          `${API_URL}/eligibility/${this.selectedSiswa.id}`,
          { status },
          this.getAuthConfig()
        );
        this.showEligible = false;
        this.getData(); // Refresh list
        this.$refs.toast.show(`Status diubah menjadi ${status}`, "success");
      } catch (e) {
        this.$refs.toast.show("Gagal update status", "error");
      }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
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