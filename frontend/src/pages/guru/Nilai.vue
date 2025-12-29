<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <aside
      :class="[
        'h-screen w-64 bg-[#0057A8] text-white flex-col overflow-y-auto transition-transform duration-300 fixed md:relative z-50',
        openSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        openSidebar ? 'flex' : 'hidden md:flex',
      ]"
    >
      <div
        v-if="openSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="openSidebar = false"
      ></div>
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
              <router-link to="/guru" class="nav-link">
                <HomeIcon class="w-5 h-5" /><span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/guru/nilai" class="nav-link nav-link-active">
                <ClipboardDocumentListIcon class="w-5 h-5" /><span>Input Nilai</span>
              </router-link>
            </li>
            <li>
              <router-link to="/guru/prestasi" class="nav-link">
                <TrophyIcon class="w-5 h-5" /><span>Prestasi Siswa</span>
              </router-link>
            </li>
            <li>
              <router-link to="/guru/mapel" class="nav-link">
                <BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="p-4 mt-auto">
          <button
            @click="logout"
            class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span>
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
              Input Nilai Siswa
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-600 text-sm hidden md:block"
              >Halo, <b>{{ user?.name }}</b></span
            ><Avatar :name="user?.name" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Pilih Mata Pelajaran:</label>
          <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <select 
              v-model="selectedMapelId" 
              @change="fetchNilaiExisting"
              class="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0057A8] focus:border-[#0057A8] outline-none transition-all"
            >
              <option disabled value="">-- Pilih Mata Pelajaran --</option>
              <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                {{ mapel.nama_mapel }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="selectedMapelId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
               <h3 class="font-bold text-gray-800 text-lg">Daftar Nilai</h3>
               <p class="text-sm text-gray-500">{{ getNamaMapel() }}</p>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
              Semester Ganjil
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 w-10 text-center">No</th>
                  <th class="px-6 py-3 min-w-[200px]">Nama Siswa</th>
                  <th class="px-2 py-3 w-20 text-center">Tugas</th>
                  <th class="px-2 py-3 w-20 text-center">UTS</th>
                  <th class="px-2 py-3 w-20 text-center">UAS</th>
                  <th class="px-4 py-3 w-20 text-center font-bold text-gray-800">Akhir</th>
                  <th class="px-6 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="siswaList.length === 0">
                  <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                      <p class="text-base">Tidak ada siswa ditemukan di kelas binaan Anda.</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="(siswa, index) in siswaList" :key="siswa.id" class="hover:bg-blue-50/30 transition-colors">
                  <td class="px-6 py-4 text-center font-medium text-gray-500">{{ index + 1 }}</td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-gray-800 text-base">{{ siswa.nama }}</div>
                    <div class="text-xs text-gray-500 mt-0.5 font-mono">{{ siswa.nis }}</div>
                  </td>
                  
                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].tugas" min="0" max="100" class="w-16 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="0" />
                  </td>
                  
                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uts" min="0" max="100" class="w-16 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="0" />
                  </td>

                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uas" min="0" max="100" class="w-16 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="0" />
                  </td>

                  <td class="px-4 py-4 text-center">
                    <span class="inline-block w-12 py-1 bg-gray-100 text-gray-800 font-bold rounded">
                        {{ hitungAkhir(siswa.id) }}
                    </span>
                  </td>

                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="simpanNilai(siswa.id)" 
                      :disabled="loadingId === siswa.id" 
                      class="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-[#0057A8] rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <span v-if="loadingId === siswa.id">Wait...</span>
                      <span v-else>Simpan</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-80 bg-white rounded-xl border border-dashed border-gray-300">
          <div class="p-5 bg-blue-50 rounded-full mb-4">
            <BookOpenIcon class="w-12 h-12 text-[#0057A8]" />
          </div>
          <h3 class="text-xl font-bold text-gray-800">Mulai Input Nilai</h3>
          <p class="text-gray-500 mt-2 max-w-sm text-center">Silakan pilih mata pelajaran di bagian atas untuk menampilkan daftar siswa.</p>
        </div>

      </main>
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
  ClipboardDocumentListIcon,
  TrophyIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
} from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: {
    Toast,
    Avatar,
    HomeIcon,
    ClipboardDocumentListIcon,
    TrophyIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BookOpenIcon,
  },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      
      // Data Logic Baru
      mapelList: [],
      siswaList: [],
      selectedMapelId: "",
      inputNilai: {}, 
      loadingId: null,
    };
  },
  methods: {
    getAuth() {
      return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
    },
    
    async getData() {
      const auth = this.getAuth();
      try {
        const [siswaRes, mapelRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/siswa`, auth),
          axios.get(`${BASE_URL}/api/mapel`, auth),
        ]);
        
        this.siswaList = siswaRes.data;
        this.mapelList = mapelRes.data;

        // Inisialisasi Data agar tidak error
        this.siswaList.forEach(s => {
          this.inputNilai[s.id] = { 
            tugas: s.tugas !== null ? s.tugas : '', 
            uts: s.uts !== null ? s.uts : '', 
            uas: s.uas !== null ? s.uas : '' 
          };
        });

      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
      }
    },

    fetchNilaiExisting() {
       // Logic reset atau fetch ulang nilai jika ganti mapel
       // Sementara reset form dulu (atau ambil nilai lama jika backend support)
       // this.getData(); // Bisa dipanggil ulang untuk refresh
    },

    getNamaMapel() {
        const m = this.mapelList.find(x => x.id === this.selectedMapelId);
        return m ? m.nama_mapel : '';
    },

    hitungAkhir(siswaId) {
        const val = this.inputNilai[siswaId];
        if (!val) return "-";

        const t = Number(val.tugas) || 0;
        const u1 = Number(val.uts) || 0;
        const u2 = Number(val.uas) || 0;
        
        if(val.tugas === '' && val.uts === '' && val.uas === '') return "-";
        
        return ((t + u1 + u2) / 3).toFixed(0);
    },

    async simpanNilai(siswaId) {
      const val = this.inputNilai[siswaId];
      if (!this.selectedMapelId) return this.$refs.toast.show("Pilih Mapel dulu!", "error");

      this.loadingId = siswaId;

      try {
        await axios.post(`${BASE_URL}/api/nilai`, {
            siswa_id: siswaId,
            mapel_id: this.selectedMapelId,
            tugas: val.tugas || 0,
            uts: val.uts || 0,
            uas: val.uas || 0,
            semester: 'Ganjil'
          }, this.getAuth());

        this.$refs.toast.show("Tersimpan!", "success");
      } catch (e) {
        console.error(e);
        this.$refs.toast.show("Gagal menyimpan", "error");
      } finally {
        this.loadingId = null;
      }
    },

    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
/* CSS ORIGINAL ANDA - AGAR TAMPILAN KEMBALI SEPERTI SEMULA */
.nav-link {
  @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors;
}
.nav-link-active {
  @apply bg-white text-[#0057A8] font-semibold shadow;
}
</style>