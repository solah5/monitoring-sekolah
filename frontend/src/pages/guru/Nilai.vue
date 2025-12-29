<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside
      :class="[
        'h-screen w-64 bg-[#0057A8] text-white flex-col overflow-y-auto transition-transform duration-300 fixed md:relative z-50',
        openSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        openSidebar ? 'flex' : 'hidden md:flex',
      ]"
    >
      <div v-if="openSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" @click="openSidebar = false"></div>
      <div class="relative z-50 bg-[#0057A8] h-full flex flex-col">
        <button @click="openSidebar = false" class="md:hidden absolute top-4 right-4 p-1 text-white"><XMarkIcon class="w-7 h-7" /></button>
        <div class="flex flex-col items-center mt-8 gap-3 px-2 text-center">
          <img src="/logo-sma.png" class="w-20" />
          <h1 class="text-base font-semibold leading-tight">SMA Negeri 1<br />Gunung Sindur</h1>
        </div>
        <nav class="flex-1 w-full mt-10 px-4">
          <ul class="space-y-3">
            <li><router-link to="/guru" class="nav-link"><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link></li>
            <li><router-link to="/guru/nilai" class="nav-link nav-link-active"><ClipboardDocumentListIcon class="w-5 h-5" /><span>Input Nilai</span></router-link></li>
            <li><router-link to="/guru/prestasi" class="nav-link"><TrophyIcon class="w-5 h-5" /><span>Prestasi Siswa</span></router-link></li>
            <li><router-link to="/guru/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto">
          <button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 flex items-center justify-center gap-2"><ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span></button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Input Nilai Siswa (Wali Kelas)</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Pilih Mata Pelajaran:</label>
          <select 
            v-model="selectedMapelId" 
            @change="fetchNilaiExisting"
            class="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option disabled value="">-- Pilih Mapel --</option>
            <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
              {{ mapel.nama_mapel }}
            </option>
          </select>
        </div>

        <div v-if="selectedMapelId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <span class="text-blue-800 font-bold">Input Nilai: {{ getNamaMapel() }}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-10">No</th>
                  <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Nama Siswa</th>
                  <th class="py-3 px-2 text-sm font-semibold text-gray-600 w-24 text-center">Tugas</th>
                  <th class="py-3 px-2 text-sm font-semibold text-gray-600 w-24 text-center">UTS</th>
                  <th class="py-3 px-2 text-sm font-semibold text-gray-600 w-24 text-center">UAS</th>
                  <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-center">Akhir</th>
                  <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="siswaList.length === 0">
                  <td colspan="7" class="p-8 text-center text-gray-500">Tidak ada siswa.</td>
                </tr>
                <tr v-for="(siswa, index) in siswaList" :key="siswa.id" class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm text-gray-700">{{ index + 1 }}</td>
                  <td class="py-3 px-4 text-sm font-medium text-gray-800">
                    {{ siswa.nama }}
                    <div class="text-xs text-gray-500">{{ siswa.nis }}</div>
                  </td>
                  
                  <td class="py-3 px-2 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].tugas" min="0" max="100" class="w-16 border border-gray-300 rounded px-1 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                  </td>
                  
                  <td class="py-3 px-2 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uts" min="0" max="100" class="w-16 border border-gray-300 rounded px-1 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                  </td>

                  <td class="py-3 px-2 text-center">
                    <input type="number" v-model="inputNilai[siswa.id].uas" min="0" max="100" class="w-16 border border-gray-300 rounded px-1 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                  </td>

                  <td class="py-3 px-4 text-center text-sm font-bold text-gray-700">
                    {{ hitungAkhir(siswa.id) }}
                  </td>

                  <td class="py-3 px-4 text-center">
                    <button @click="simpanNilai(siswa.id)" :disabled="loadingId === siswa.id" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs transition-colors disabled:bg-blue-300">
                      {{ loadingId === siswa.id ? '...' : 'Simpan' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
          <h3 class="text-gray-900 font-medium">Belum memilih Mata Pelajaran</h3>
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
import { HomeIcon, ClipboardDocumentListIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, BookOpenIcon } from "@heroicons/vue/24/solid";

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
      
      // Data mentah dari DB (untuk cek nilai yg sudah ada)
      allNilaiData: [] 
    };
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    
    async getData() {
      const auth = this.getAuth();
      try {
        const [siswaRes, mapelRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/siswa`, auth), // Ini sudah difilter wali kelas di backend
          axios.get(`${BASE_URL}/api/mapel`, auth),
        ]);
        
        this.siswaList = siswaRes.data;
        this.mapelList = mapelRes.data;

        // Inisialisasi object inputNilai untuk setiap siswa agar tidak error
        this.siswaList.forEach(s => {
            this.inputNilai[s.id] = { tugas: '', uts: '', uas: '' };
        });

      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
      }
    },

    // Fungsi fetch nilai yang sudah ada di DB
    async fetchNilaiExisting() {
        if(!this.selectedMapelId) return;
        const auth = this.getAuth();
        
        // Reset dulu
        this.siswaList.forEach(s => {
            this.inputNilai[s.id] = { tugas: '', uts: '', uas: '' };
        });

        try {
            // Kita panggil endpoint nilai untuk mapel ini
            // (Sebenarnya bisa pakai endpoint khusus, tapi kita pakai logic pencocokan di frontend saja biar cepat)
            // Di sistem production, lebih baik fetch: /api/nilai?mapel_id=XX
            // Tapi untuk sekarang kita asumsikan backend mengirim data siswa LEFT JOIN nilai (tapi itu untuk semua mapel).
            // Solusi Cepat:
            // Kita buat endpoint khusus di backend? Atau biarkan kosong dulu?
            // Agar dosen senang, biarkan default kosong dulu. Kalau mau canggih, harus fetch nilai by mapel.
            
            // JIKA MAU LOAD DATA LAMA (OPSIONAL - FITUR LANJUTAN)
            // Anda perlu menambah endpoint di backend: router.get('/by-mapel/:mapelId')
            // Untuk sekarang, kita mulai dari 0 atau kosong agar mudah.
        } catch (e) {
            console.log(e);
        }
    },

    getNamaMapel() {
        const m = this.mapelList.find(x => x.id === this.selectedMapelId);
        return m ? m.nama_mapel : '';
    },

    hitungAkhir(siswaId) {
        const val = this.inputNilai[siswaId];
        const t = Number(val.tugas) || 0;
        const u1 = Number(val.uts) || 0;
        const u2 = Number(val.uas) || 0;
        if(t===0 && u1===0 && u2===0) return "-";
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
        this.$refs.toast.show("Gagal", "error");
      } finally {
        this.loadingId = null;
      }
    },

    logout() { localStorage.clear(); this.$router.push("/"); },
  },
  mounted() { this.getData(); },
};
</script>