<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0057A8] text-white transition-transform duration-300 ease-in-out transform md:relative md:translate-x-0',
        openSidebar ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col items-center justify-center h-24 mt-4 border-b border-blue-800/30">
        <div class="flex items-center gap-3">
          <img src="/logo-sma.png" alt="Logo" class="w-10 h-10 bg-white rounded-full p-1" />
          <div class="text-left">
            <h1 class="text-lg font-bold leading-none">SMA Negeri 1</h1>
            <p class="text-xs text-blue-200">Gunung Sindur</p>
          </div>
        </div>
      </div>

      <nav class="mt-6 px-4 space-y-2">
        <router-link 
          to="/guru" 
          class="nav-item" 
          active-class="active-link"
          exact-active-class="exact-active-link"
        >
          <HomeIcon class="w-5 h-5" />
          <span class="font-medium">Dashboard</span>
        </router-link>

        <router-link 
          to="/guru/nilai" 
          class="nav-item active-link" 
        >
          <ClipboardDocumentListIcon class="w-5 h-5" />
          <span class="font-medium">Input Nilai</span>
        </router-link>

        <router-link 
          to="/guru/prestasi" 
          class="nav-item" 
          active-class="active-link"
        >
          <TrophyIcon class="w-5 h-5" />
          <span class="font-medium">Prestasi Siswa</span>
        </router-link>

        <router-link 
          to="/guru/mapel" 
          class="nav-item" 
          active-class="active-link"
        >
          <BookOpenIcon class="w-5 h-5" />
          <span class="font-medium">Kelola Mapel</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 w-full p-4 border-t border-blue-800/30 bg-[#004e96]">
        <button
          @click="logout"
          class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <div 
      v-if="openSidebar" 
      class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
      @click="openSidebar = false"
    ></div>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
        <button @click="openSidebar = true" class="p-1 text-gray-500 md:hidden hover:text-gray-700">
          <Bars3Icon class="w-6 h-6" />
        </button>
        
        <h2 class="text-xl font-bold text-gray-800 hidden md:block">Input Nilai Akademik</h2>
        
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-semibold text-gray-800">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">Wali Kelas</p>
          </div>
          <Avatar :name="user?.name" class="w-10 h-10 border-2 border-blue-100 rounded-full" />
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <div class="w-full md:w-1/2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Pilih Mata Pelajaran</label>
              <select 
                v-model="selectedMapelId" 
                @change="fetchNilaiExisting"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
              >
                <option disabled value="">-- Pilih Mata Pelajaran --</option>
                <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                  {{ mapel.nama_mapel }}
                </option>
              </select>
            </div>
            <div class="w-full md:w-1/2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p><strong>Info:</strong> Memilih mapel akan otomatis menampilkan daftar siswa di kelas binaan Anda untuk diinput nilainya.</p>
            </div>
          </div>
        </div>

        <div v-if="selectedMapelId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Form Input Nilai: <span class="text-blue-600">{{ getNamaMapel() }}</span></h3>
            <span class="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Semester Ganjil</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 w-12 text-center">No</th>
                  <th class="px-6 py-3">Nama Siswa</th>
                  <th class="px-2 py-3 w-24 text-center">Tugas</th>
                  <th class="px-2 py-3 w-24 text-center">UTS</th>
                  <th class="px-2 py-3 w-24 text-center">UAS</th>
                  <th class="px-4 py-3 w-24 text-center font-bold text-gray-900">Akhir</th>
                  <th class="px-6 py-3 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="siswaList.length === 0">
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    Tidak ada siswa ditemukan di kelas binaan Anda.
                  </td>
                </tr>
                <tr v-for="(siswa, index) in siswaList" :key="siswa.id" class="bg-white hover:bg-blue-50/50 transition-colors">
                  <td class="px-6 py-4 text-center font-medium text-gray-500">{{ index + 1 }}</td>
                  <td class="px-6 py-4">
                    <div class="font-medium text-gray-900">{{ siswa.nama }}</div>
                    <div class="text-xs text-gray-500">{{ siswa.nis }}</div>
                  </td>
                  
                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].tugas" min="0" max="100" class="w-16 p-1 text-center border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
                  </td>
                  
                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uts" min="0" max="100" class="w-16 p-1 text-center border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
                  </td>

                  <td class="px-2 py-4 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uas" min="0" max="100" class="w-16 p-1 text-center border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
                  </td>

                  <td class="px-4 py-4 text-center font-bold text-blue-700 bg-gray-50/50">
                    {{ hitungAkhir(siswa.id) }}
                  </td>

                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="simpanNilai(siswa.id)" 
                      :disabled="loadingId === siswa.id" 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-300 transition-all"
                    >
                      <span v-if="loadingId === siswa.id" class="flex items-center gap-1">
                        <svg class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Simpan
                      </span>
                      <span v-else>Simpan</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <div class="p-4 bg-gray-50 rounded-full mb-3">
            <ClipboardDocumentListIcon class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Belum ada Mapel dipilih</h3>
          <p class="text-gray-500">Silakan pilih mata pelajaran di atas untuk mulai input nilai.</p>
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
          // Jika backend mengirim data nilai (karena JOIN), kita isi di sini
          // Untuk simplifikasi awal, kita set kosong/0 dulu
          this.inputNilai[s.id] = { 
            tugas: s.tugas || '', 
            uts: s.uts || '', 
            uas: s.uas || '' 
          };
        });

      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
      }
    },

    fetchNilaiExisting() {
       // Saat ganti mapel, idealnya kita fetch nilai siswa khusus mapel tsb
       // Untuk saat ini kita reset form dulu agar guru bisa input baru
       this.siswaList.forEach(s => {
          this.inputNilai[s.id] = { tugas: '', uts: '', uas: '' };
       });
       // TODO: Implementasi fetch nilai existing by mapelId
    },

    getNamaMapel() {
        const m = this.mapelList.find(x => x.id === this.selectedMapelId);
        return m ? m.nama_mapel : '';
    },

    hitungAkhir(siswaId) {
        const val = this.inputNilai[siswaId];
        // Konversi ke number, default 0 jika kosong
        const t = Number(val.tugas) || 0;
        const u1 = Number(val.uts) || 0;
        const u2 = Number(val.uas) || 0;
        
        // Jika semua kosong, tampilkan strip
        if(val.tugas === '' && val.uts === '' && val.uas === '') return "-";
        
        // Rumus Rata-rata
        return ((t + u1 + u2) / 3).toFixed(2);
    },

    async simpanNilai(siswaId) {
      const val = this.inputNilai[siswaId];
      if (!this.selectedMapelId) return this.$refs.toast.show("Pilih Mapel dulu!", "error");

      this.loadingId = siswaId;

      try {
        await axios.post(`${BASE_URL}/api/nilai`, {
            siswa_id: siswaId,
            mapel_id: this.selectedMapelId,
            tugas: val.tugas,
            uts: val.uts,
            uas: val.uas,
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
/* CSS Khusus Sidebar agar lebih rapi */
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-100 rounded-xl transition-all duration-200 group hover:bg-[#004e96] hover:text-white;
}

/* Style saat menu aktif */
.active-link {
  @apply bg-white text-[#0057A8] shadow-lg font-bold;
}

/* Agar ikon sedikit lebih terang saat hover */
.nav-item:hover svg {
  @apply text-white;
}
</style>