<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    
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
          <img src="/logo-sma.png" class="w-20 drop-shadow-md" />
          <h1 class="text-base font-bold leading-tight tracking-wide">
            SMA Negeri 1<br />Gunung Sindur
          </h1>
        </div>

        <nav class="flex-1 w-full mt-10 px-4">
          <ul class="space-y-3">
            <li>
              <router-link to="/guru" class="nav-link">
                <HomeIcon class="w-5 h-5" />
                <span>Dashboard</span>
              </router-link>
            </li>
            
            <li>
              <router-link to="/guru/nilai" class="nav-link nav-link-active">
                <ClipboardDocumentListIcon class="w-5 h-5" />
                <span>Input Nilai</span>
              </router-link>
            </li>
            
            <li>
              <router-link to="/guru/prestasi" class="nav-link">
                <TrophyIcon class="w-5 h-5" />
                <span>Prestasi Siswa</span>
              </router-link>
            </li>
            
            <li>
              <router-link to="/guru/mapel" class="nav-link">
                <BookOpenIcon class="w-5 h-5" />
                <span>Kelola Mapel</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="p-4 mt-auto mb-4">
          <button
            @click="logout"
            class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeftOnRectangleIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700 hover:bg-gray-100 rounded">
            <Bars3Icon class="w-7 h-7" />
          </button>
          
          <div class="hidden md:block">
            <h1 class="text-lg font-bold text-gray-800">Input Nilai Siswa (Wali Kelas)</h1>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block leading-tight">
              <span class="text-gray-600 text-sm block">Halo,</span>
              <span class="text-gray-900 font-bold text-sm">{{ user?.name }}</span>
            </div>
            <Avatar :name="user?.name" class="border-2 border-gray-100 shadow-sm" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <label class="block text-gray-700 font-bold mb-2">Pilih Mata Pelajaran:</label>
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
            <span class="text-sm text-gray-500 italic bg-blue-50 px-3 py-1 rounded-md text-blue-700">
              *Pilih mapel untuk menampilkan siswa
            </span>
          </div>
        </div>

        <div v-if="selectedMapelId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
            <div>
               <h3 class="font-bold text-gray-800 text-lg">Input Nilai</h3>
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
          <p class="text-gray-500 mt-2 max-w-sm text-center">Silakan pilih mata pelajaran di bagian atas untuk menampilkan daftar siswa dan mulai mengisi nilai.</p>
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
  BookOpenIcon 
} from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Toast, Avatar, HomeIcon, ClipboardDocumentListIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, BookOpenIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      mapelList: [],
      siswaList: [],
      selectedMapelId: "",
      
      // Struktur Data Input: { id_siswa: { tugas: 0, uts: 0, uas: 0 } }
      inputNilai: {}, 
      loadingId: null,
    };
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    
    async getData() {
      const auth = this.getAuth();
      try {
        const [siswaRes, mapelRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/siswa`, auth), // Sudah difilter wali kelas oleh backend
          axios.get(`${BASE_URL}/api/mapel`, auth),
        ]);
        
        this.siswaList = siswaRes.data;
        this.mapelList = mapelRes.data;

        // Inisialisasi object inputNilai agar tidak error saat render
        this.siswaList.forEach(s => {
          // Backend mengirim kolom: tugas, uts, uas (jika ada nilai, jika tidak null)
          // Kita pastikan nilainya angka atau string kosong
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

    // Dipanggil saat dropdown mapel berubah
    async fetchNilaiExisting() {
       // Idealnya fetch data nilai khusus mapel ini.
       // Untuk sementara kita reload data dasar agar form input ter-reset atau terisi data terbaru dari state lokal
       // Di production, logic ini harus memanggil endpoint: GET /api/nilai?mapel_id=...
       
       // Simulasi reset jika data belum ada di backend
       /* this.siswaList.forEach(s => {
          this.inputNilai[s.id] = { tugas: '', uts: '', uas: '' };
       });
       */
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
        
        // Jika semua kosong, tampilkan strip
        if(val.tugas === '' && val.uts === '' && val.uas === '') return "-";
        
        // Rumus Rata-rata
        return ((t + u1 + u2) / 3).toFixed(0); // Dibulatkan tanpa koma agar rapi
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

    logout() { localStorage.clear(); this.$router.push("/"); },
  },
  mounted() { this.getData(); },
};
</script>

<style scoped>
/* GAYA CSS ORIGINAL ANDA */
.nav-link {
  @apply flex items-center gap-3 py-3 px-4 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-all duration-200 font-medium;
}

/* Style Aktif: Background Putih, Teks Biru, Shadow */
.nav-link-active {
  @apply bg-white text-[#0057A8] font-bold shadow-md;
}

/* Pastikan icon mengikuti warna teks parent */
.nav-link svg {
  @apply transition-colors duration-200;
}
</style>