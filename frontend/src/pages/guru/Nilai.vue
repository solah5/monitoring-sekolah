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
              <router-link to="/guru" class="nav-link"
                ><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link
              >
            </li>
            <li>
              <router-link to="/guru/nilai" class="nav-link nav-link-active"
                ><ClipboardDocumentListIcon class="w-5 h-5" /><span
                  >Input Nilai</span
                ></router-link
              >
            </li>
            <li>
              <router-link to="/guru/prestasi" class="nav-link"
                ><TrophyIcon class="w-5 h-5" /><span
                  >Prestasi Siswa</span
                ></router-link
              >
            </li>
            <li>
              <router-link to="/guru/mapel" class="nav-link">
                <BookOpenIcon class="w-5 h-5" />
                <span>Kelola Mapel</span>
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
              Input Nilai Siswa (Wali Kelas)
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
          <select 
            v-model="selectedMapelId" 
            @change="resetInput"
            class="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option disabled value="">-- Pilih Mapel --</option>
            <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
              {{ mapel.nama_mapel }}
            </option>
          </select>
          <p class="text-sm text-gray-500 mt-2">*Pilih mapel untuk menampilkan daftar siswa kelas binaan Anda.</p>
        </div>

        <div v-if="selectedMapelId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <span class="text-blue-800 font-bold">Daftar Siswa</span>
            <span class="text-sm text-gray-600 bg-white px-3 py-1 rounded border">Semester: Ganjil</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="py-3 px-5 text-sm font-semibold text-gray-600 w-16">No</th>
                  <th class="py-3 px-5 text-sm font-semibold text-gray-600">NIS</th>
                  <th class="py-3 px-5 text-sm font-semibold text-gray-600">Nama Siswa</th>
                  <th class="py-3 px-5 text-sm font-semibold text-gray-600 w-40">Nilai (0-100)</th>
                  <th class="py-3 px-5 text-sm font-semibold text-gray-600 text-center w-32">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="siswaList.length === 0">
                  <td colspan="5" class="p-8 text-center text-gray-500">
                    Tidak ada siswa di kelas binaan Anda.
                  </td>
                </tr>
                <tr
                  v-for="(siswa, index) in siswaList"
                  :key="siswa.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-3 px-5 text-sm text-gray-700">{{ index + 1 }}</td>
                  <td class="py-3 px-5 text-sm text-gray-600 font-mono">{{ siswa.nis }}</td>
                  <td class="py-3 px-5 text-sm font-medium text-gray-800">{{ siswa.nama }}</td>
                  
                  <td class="py-3 px-5">
                    <input 
                      type="number" 
                      v-model="inputNilai[siswa.id]" 
                      min="0" max="100"
                      placeholder="0"
                      class="w-full border border-gray-300 rounded px-3 py-1.5 text-center focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    />
                  </td>

                  <td class="py-3 px-5 text-center">
                    <button 
                      @click="simpanNilai(siswa.id)"
                      :disabled="loadingId === siswa.id"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors disabled:bg-blue-300 flex items-center justify-center w-full"
                    >
                      <span v-if="loadingId === siswa.id">...</span>
                      <span v-else>Simpan</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
          <div class="bg-gray-100 p-4 rounded-full mb-3">
            <ClipboardDocumentListIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-gray-900 font-medium">Belum memilih Mata Pelajaran</h3>
          <p class="text-gray-500 text-sm mt-1">Silakan pilih mapel di atas untuk mulai menginput nilai.</p>
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
      
      // Data untuk Bulk Input
      mapelList: [],
      siswaList: [],
      selectedMapelId: "",
      
      // Menyimpan nilai yang diketik: { id_siswa: nilai }
      inputNilai: {}, 
      loadingId: null, // Untuk efek loading tombol simpan
    };
  },
  methods: {
    getAuth() {
      return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
    },
    
    // 1. Ambil Data Mapel & Siswa saat halaman dimuat
    async getData() {
      const auth = this.getAuth();
      try {
        const [siswaRes, mapelRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/siswa`, auth),
          axios.get(`${BASE_URL}/api/mapel`, auth),
        ]);
        
        // Backend sudah otomatis memfilter siswa berdasarkan Wali Kelas
        this.siswaList = siswaRes.data;
        this.mapelList = mapelRes.data;
        
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
        else this.$refs.toast.show("Gagal memuat data", "error");
      }
    },

    resetInput() {
        // Reset input nilai jika ganti mapel (opsional)
        // this.inputNilai = {};
    },

    // 2. Fungsi Simpan Nilai (Per Siswa)
    async simpanNilai(siswaId) {
      const nilai = this.inputNilai[siswaId];

      // Validasi sederhana
      if (!this.selectedMapelId) {
        this.$refs.toast.show("Pilih Mapel dulu!", "error");
        return;
      }
      if (nilai === undefined || nilai === "" || nilai === null) {
        this.$refs.toast.show("Nilai tidak boleh kosong", "error");
        return;
      }

      this.loadingId = siswaId; // Efek loading nyala

      try {
        await axios.post(
          `${BASE_URL}/api/nilai`,
          {
            siswa_id: siswaId,
            mapel_id: this.selectedMapelId,
            nilai_pengetahuan: nilai,
            semester: 'Ganjil', // Default semester
            jenis_nilai: 'PAS'  // Atau bisa dibuat dropdown juga
          },
          this.getAuth()
        );

        this.$refs.toast.show("Nilai tersimpan!", "success");
      } catch (e) {
        console.error(e);
        this.$refs.toast.show("Gagal menyimpan", "error");
      } finally {
        this.loadingId = null; // Efek loading mati
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
.nav-link {
  @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors;
}
.nav-link-active {
  @apply bg-white text-[#0057A8] font-semibold shadow;
}
</style>