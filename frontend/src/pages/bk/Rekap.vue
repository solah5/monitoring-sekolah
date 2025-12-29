<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
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
              <router-link
                to="/bk/rekap"
                class="nav-link nav-link-active"
              >
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
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
           <h2 class="hidden md:block text-xl font-bold text-gray-800">Daftar Peringkat</h2>

           <div class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari siswa atau kelas..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center w-20">
                  Peringkat
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Nama Siswa
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Kelas
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">
                  Rata-rata
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">
                  Prestasi
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">
                  Status Eligible
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0">
                <td colspan="7" class="py-8 text-center text-gray-500">
                  {{ searchQuery ? 'Siswa tidak ditemukan.' : 'Memuat data...' }}
                </td>
              </tr>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-5 text-center text-gray-500 font-bold">
                  #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <td class="py-4 px-5 text-sm">
                  <div class="font-semibold text-gray-800">{{ item.nama }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ item.nis }}</div>
                </td>

                <td class="py-4 px-5 text-sm text-gray-700">
                  {{ item.kelas }} <span v-if="item.rombel" class="text-gray-500">- {{ item.rombel }}</span>
                </td>

                <td class="py-4 px-5 text-sm text-center font-bold text-blue-600">
                  {{ parseFloat(item.rata_rata || 0).toFixed(2) }}
                </td>

                <td class="py-4 px-5 text-center">
                  <span class="inline-flex items-center justify-center w-8 h-6 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                    {{ item.jumlah_prestasi }}
                  </span>
                </td>

                <td class="py-4 px-5 text-center">
                  <span
                    :class="{
                      'bg-green-100 text-green-700 border border-green-200': item.status_eligible === 'Eligible',
                      'bg-red-100 text-red-700 border border-red-200': item.status_eligible === 'Tidak Eligible',
                      'bg-gray-100 text-gray-600 border border-gray-200': !item.status_eligible || item.status_eligible === 'Pending',
                    }"
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ item.status_eligible || 'Pending' }}
                  </span>
                </td>

                <td class="py-4 px-5 text-center whitespace-nowrap">
                  <button
                    @click="openDetail(item)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4 transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    @click="openEligible(item)"
                    class="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                  >
                    Status
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </div>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </main>
    </div>

    <div
      v-if="showDetail"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 transition-opacity"
      @click.self="showDetail = false"
    >
      <div class="bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto transform transition-all">
        <button
          @click="showDetail = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        
        <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-900">{{ selectedSiswa?.nama }}</h3>
            <p class="text-sm text-gray-500">NIS: {{ selectedSiswa?.nis }} | Kelas: {{ selectedSiswa?.kelas }} - {{ selectedSiswa?.rombel }}</p>
        </div>

        <h4 class="font-semibold text-gray-800 mb-3 border-b pb-2">Daftar Nilai</h4>
        <div class="border rounded-lg overflow-hidden mb-6">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="p-3 font-medium">Mata Pelajaran</th>
                <th class="p-3 font-medium">Jenis Nilai</th>
                <th class="p-3 font-medium text-right">Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="n in detailData.nilai" :key="n.id">
                <td class="p-3">{{ n.nama_mapel }}</td>
                <td class="p-3 capitalize">{{ n.jenis_nilai }}</td>
                <td class="p-3 text-right font-bold text-gray-800">{{ n.nilai }}</td>
              </tr>
              <tr v-if="detailData.nilai.length === 0">
                <td colspan="3" class="p-4 text-center text-gray-500 italic">Belum ada data nilai.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="font-semibold text-gray-800 mb-3 border-b pb-2">Daftar Prestasi</h4>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="p-3 font-medium">Judul</th>
                <th class="p-3 font-medium">Tingkat</th>
                <th class="p-3 font-medium text-right">Tahun</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="p in detailData.prestasi" :key="p.id">
                <td class="p-3">{{ p.judul_prestasi }}</td>
                <td class="p-3">
                    <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">{{ p.tingkat }}</span>
                </td>
                <td class="p-3 text-right">{{ p.tahun }}</td>
              </tr>
              <tr v-if="detailData.prestasi.length === 0">
                <td colspan="3" class="p-4 text-center text-gray-500 italic">Belum ada prestasi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showEligible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 transition-opacity"
      @click.self="showEligible = false"
    >
      <div class="bg-white w-full max-w-sm p-6 rounded-xl shadow-2xl relative transform transition-all">
        <button
          @click="showEligible = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-bold mb-2 text-gray-800">Status Eligible</h3>
        <p class="mb-5 text-sm text-gray-600">
          Ubah status siswa <b>{{ selectedSiswa?.nama }}</b>:
        </p>
        <div class="space-y-3">
          <button
            @click="setStatus('Eligible')"
            class="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition font-medium"
          >
            <span>Eligible (Layak)</span>
            <span v-if="selectedSiswa?.status_eligible === 'Eligible'" class="text-green-600">✓</span>
          </button>
          
          <button
            @click="setStatus('Tidak Eligible')"
            class="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition font-medium"
          >
            <span>Tidak Eligible</span>
            <span v-if="selectedSiswa?.status_eligible === 'Tidak Eligible'" class="text-red-600">✓</span>
          </button>

          <button
            @click="setStatus('Pending')"
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition font-medium"
          >
            <span>Pending</span>
            <span v-if="selectedSiswa?.status_eligible === 'Pending' || !selectedSiswa?.status_eligible" class="text-gray-600">✓</span>
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
    filteredData() {
      if (!this.searchQuery) return this.siswaList;
      const q = this.searchQuery.toLowerCase();
      // Filter mencakup Nama, Kelas, Rombel, dan NIS
      return this.siswaList.filter(item => 
        (item.nama && item.nama.toLowerCase().includes(q)) || 
        (item.kelas && item.kelas.toLowerCase().includes(q)) ||
        (item.rombel && item.rombel.toLowerCase().includes(q)) ||
        (item.nis && item.nis.includes(q))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
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
        if (e.response?.status === 401) this.logout();
        else this.$refs.toast.show("Gagal memuat data siswa", "error");
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
        this.$refs.toast.show("Gagal mengambil detail", "error");
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
        this.getData(); // Refresh data
        this.$refs.toast.show(`Status berhasil diubah menjadi ${status}`, "success");
      } catch (e) {
        this.$refs.toast.show("Gagal mengubah status", "error");
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
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