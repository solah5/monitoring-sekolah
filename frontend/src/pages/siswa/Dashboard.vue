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
            <li>
              <router-link to="/siswa" class="nav-link nav-link-active">
                <HomeIcon class="w-5 h-5" /><span>Dashboard Saya</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="p-4 mt-auto">
          <button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Dashboard Siswa</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
            <div class="w-full md:w-auto">
                <h2 class="text-2xl font-bold text-gray-800">{{ dataSiswa.profil?.nama || 'Memuat...' }}</h2>
                <p class="text-gray-500 mt-1">Kelas: {{ dataSiswa.profil?.kelas || '-' }}</p>
            </div>
            <div class="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span class="text-sm font-medium text-gray-500">Status SNBP:</span>
                <span 
                    class="px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wide"
                    :class="{
                        'bg-gray-200 text-gray-700': !dataSiswa.profil?.status_eligible || dataSiswa.profil?.status_eligible === 'Pending',
                        'bg-green-100 text-green-700': dataSiswa.profil?.status_eligible === 'Eligible',
                        'bg-red-100 text-red-700': dataSiswa.profil?.status_eligible === 'Tidak Eligible'
                    }"
                >
                    {{ dataSiswa.profil?.status_eligible || 'Pending' }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-5 border-b border-gray-100">
                        <h3 class="font-bold text-gray-700">Rapor Akademik (Rata-rata)</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-white border-b border-gray-100 text-gray-500">
                                <tr>
                                    <th class="p-4 font-medium">Mata Pelajaran</th>
                                    <th class="p-4 font-medium text-center">Nilai Akhir</th>
                                    <th class="p-4 font-medium text-center">Predikat</th>
                                    <th class="p-4 font-medium text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-if="dataSiswa.nilai.length === 0">
                                    <td colspan="4" class="p-6 text-center text-gray-500">Belum ada data nilai.</td>
                                </tr>
                                <tr v-for="(n, idx) in dataSiswa.nilai" :key="idx" class="hover:bg-gray-50 transition-colors">
                                    <td class="p-4 text-gray-800 font-medium">{{ n.nama_mapel }}</td>
                                    <td class="p-4 text-center font-bold text-blue-600">{{ n.nilai_akhir }}</td>
                                    <td class="p-4 text-center">
                                        <span :class="getPredikatColor(n.nilai_akhir)" class="px-2 py-1 rounded text-xs font-bold">
                                            {{ getPredikat(n.nilai_akhir) }}
                                        </span>
                                    </td>
                                    <td class="p-4 text-center">
                                        <button 
                                            @click="openDetail(n)" 
                                            class="text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs font-medium transition-colors"
                                        >
                                            Lihat
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                    <div class="p-5 border-b border-gray-100">
                         <h3 class="font-bold text-gray-700">Prestasi Saya</h3>
                    </div>
                    <div class="p-5">
                        <ul v-if="dataSiswa.prestasi.length > 0" class="space-y-4">
                            <li v-for="(p, idx) in dataSiswa.prestasi" :key="idx" class="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div class="mt-0.5">
                                    <TrophyIcon class="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">{{ p.judul_prestasi }}</p>
                                    <p class="text-xs text-gray-500 mt-0.5">{{ p.tingkat }} • {{ p.tahun }}</p>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="text-center py-6 text-gray-500 text-sm">
                            Belum ada data prestasi.
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" @click.self="showDetailModal = false">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative animate-fade-in-up">
        <button @click="showDetailModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
        <h3 class="text-lg font-bold mb-1 text-gray-800">{{ detailMapel.nama }}</h3>
        <p class="text-sm text-gray-500 mb-4">Rincian Komponen Nilai</p>

        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="p-3 font-semibold">Jenis Nilai</th>
                <th class="p-3 font-semibold text-right">Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(d, idx) in detailMapel.data" :key="idx">
                <td class="p-3 font-medium text-gray-700">{{ d.jenis_nilai }}</td>
                <td class="p-3 text-right font-bold text-gray-900">{{ d.nilai }}</td>
              </tr>
              <tr v-if="detailMapel.data.length === 0">
                <td colspan="2" class="p-4 text-center text-gray-500">Belum ada rincian.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right">
          <button @click="showDetailModal = false" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Tutup</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import Avatar from "@/components/Avatar.vue";
import { HomeIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, TrophyIcon, BookOpenIcon } from "@heroicons/vue/24/solid";

// Gunakan BASE_URL
const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Avatar, HomeIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, TrophyIcon, BookOpenIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      dataSiswa: { profil: {}, nilai: [], prestasi: [] },
      showDetailModal: false,
      detailMapel: { nama: "", data: [] },
    };
  },
  methods: {
    async getData() {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/siswa-area/dashboard`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        this.dataSiswa = data;
      } catch (e) {
        if (e.response?.status === 401) this.logout();
      }
    },
    async openDetail(mapel) {
      this.detailMapel.nama = "Memuat...";
      this.detailMapel.data = [];
      this.showDetailModal = true;
      try {
        const { data } = await axios.get(`${BASE_URL}/api/siswa-area/detail/${mapel.mapel_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        this.detailMapel.nama = data.nama_mapel;
        this.detailMapel.data = data.detail;
      } catch (e) { this.detailMapel.nama = "Gagal memuat data"; }
    },
    getPredikat(nilai) {
      if (nilai >= 90) return "A";
      if (nilai >= 80) return "B";
      if (nilai >= 70) return "C";
      return "D";
    },
    getPredikatColor(nilai) {
      if (nilai >= 90) return "bg-green-100 text-green-800";
      if (nilai >= 80) return "bg-blue-100 text-blue-800";
      if (nilai >= 70) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    },
    logout() { localStorage.clear(); this.$router.push("/"); },
  },
  mounted() { this.getData(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
</style>