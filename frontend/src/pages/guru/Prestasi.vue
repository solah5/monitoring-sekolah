<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    
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
          <img src="/logo-sma.png" class="w-20 drop-shadow-md" />
          <h1 class="text-base font-bold leading-tight tracking-wide">SMA Negeri 1<br />Gunung Sindur</h1>
        </div>
        <nav class="flex-1 w-full mt-10 px-4">
          <ul class="space-y-3">
            <li><router-link to="/guru" class="nav-link"><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link></li>
            <li><router-link to="/guru/nilai" class="nav-link"><ClipboardDocumentListIcon class="w-5 h-5" /><span>Input Nilai</span></router-link></li>
            <li><router-link to="/guru/prestasi" class="nav-link nav-link-active"><TrophyIcon class="w-5 h-5" /><span>Prestasi Siswa</span></router-link></li>
            <li><router-link to="/guru/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto mb-4">
          <button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700 hover:bg-gray-100 rounded"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-bold text-gray-800">Data Prestasi Siswa</h1></div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block leading-tight"><span class="text-gray-600 text-sm block">Halo,</span><span class="text-gray-900 font-bold text-sm">{{ user?.name }}</span></div>
            <Avatar :name="user?.name" class="border-2 border-gray-100 shadow-sm" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        
        <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-3">
            <TrophyIcon class="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
                <h3 class="font-bold text-blue-800">Kelola Prestasi</h3>
                <p class="text-sm text-blue-600">Klik tombol <b>(+) Tambah</b> pada baris nama siswa untuk menambahkan prestasi baru.</p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
               <h3 class="font-bold text-gray-800 text-lg">Daftar Siswa Perwalian</h3>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 w-10 text-center">No</th>
                            <th class="px-6 py-3 w-64">Nama Siswa</th>
                            <th class="px-6 py-3">Riwayat Prestasi</th>
                            <th class="px-6 py-3 w-32 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="siswaList.length === 0">
                            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                                Tidak ada siswa di kelas binaan Anda.
                            </td>
                        </tr>
                        <tr v-for="(siswa, index) in siswaList" :key="siswa.id" class="hover:bg-blue-50/30 transition-colors">
                            <td class="px-6 py-4 text-center font-medium text-gray-500">{{ index + 1 }}</td>
                            <td class="px-6 py-4 align-top">
                                <div class="font-bold text-gray-800 text-base">{{ siswa.nama }}</div>
                                <div class="text-xs text-gray-500 mt-0.5 font-mono">{{ siswa.nis }}</div>
                            </td>
                            
                            <td class="px-6 py-4 align-top">
                                <div v-if="getPrestasiBySiswa(siswa.id).length > 0" class="flex flex-wrap gap-2">
                                    <div v-for="p in getPrestasiBySiswa(siswa.id)" :key="p.id" 
                                         class="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm group">
                                        <TrophyIcon class="w-3 h-3 text-yellow-600" />
                                        <span>{{ p.judul_prestasi }} ({{ p.tingkat }})</span>
                                        <button @click="removePrestasi(p.id)" class="text-red-400 hover:text-red-600 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TrashIcon class="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <span v-else class="text-gray-400 italic text-xs">- Belum ada prestasi -</span>
                            </td>

                            <td class="px-6 py-4 text-center align-top">
                                <button 
                                    @click="openAddModal(siswa)" 
                                    class="inline-flex items-center gap-1 bg-[#0057A8] hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                                >
                                    <PlusIcon class="w-4 h-4" />
                                    Tambah
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </main>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-fade-in" @click.self="closeModal">
        <div class="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon class="w-6 h-6" /></button>
            
            <h3 class="text-xl font-bold text-gray-800 mb-1">Tambah Prestasi</h3>
            <p class="text-sm text-gray-500 mb-6">Siswa: <span class="font-bold text-[#0057A8]">{{ form.nama_siswa }}</span></p>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Judul Prestasi</label>
                    <input v-model="form.judul_prestasi" type="text" placeholder="Contoh: Juara 1 Lomba Futsal" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0057A8] outline-none" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Tingkat</label>
                        <select v-model="form.tingkat" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0057A8] outline-none bg-white">
                            <option value="Sekolah">Sekolah</option>
                            <option value="Kecamatan">Kecamatan</option>
                            <option value="Kabupaten">Kabupaten</option>
                            <option value="Provinsi">Provinsi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Tahun</label>
                        <input v-model="form.tahun" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0057A8] outline-none" />
                    </div>
                </div>
            </div>

            <button @click="savePrestasi" class="w-full mt-6 bg-[#0057A8] hover:bg-blue-800 text-white py-2.5 rounded-lg font-bold transition-all">
                Simpan Prestasi
            </button>
        </div>
    </div>
    
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import { HomeIcon, ClipboardDocumentListIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, TrashIcon, BookOpenIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Toast, Avatar, HomeIcon, ClipboardDocumentListIcon, TrophyIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PlusIcon, TrashIcon, BookOpenIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      
      siswaList: [],
      prestasiList: [],
      
      showModal: false,
      form: {
          siswa_id: null,
          nama_siswa: '',
          judul_prestasi: '',
          tingkat: 'Sekolah',
          tahun: new Date().getFullYear()
      }
    };
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    
    async getData() {
      const auth = this.getAuth();
      try {
        // Ambil Data Siswa (Sudah difilter Wali Kelas dari backend)
        const siswaRes = await axios.get(`${BASE_URL}/api/siswa`, auth);
        this.siswaList = siswaRes.data;

        // Ambil Data Prestasi
        const prestasiRes = await axios.get(`${BASE_URL}/api/prestasi`, auth);
        this.prestasiList = prestasiRes.data;

      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
      }
    },

    // Helper: Cari prestasi milik siswa tertentu
    getPrestasiBySiswa(siswaId) {
        return this.prestasiList.filter(p => p.siswa_id === siswaId);
    },

    openAddModal(siswa) {
        this.form = {
            siswa_id: siswa.id,
            nama_siswa: siswa.nama, // Untuk display di modal
            judul_prestasi: '',
            tingkat: 'Sekolah',
            tahun: new Date().getFullYear()
        };
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
    },

    async savePrestasi() {
        if(!this.form.judul_prestasi) return this.$refs.toast.show("Judul prestasi wajib diisi", "error");
        
        try {
            await axios.post(`${BASE_URL}/api/prestasi`, this.form, this.getAuth());
            this.$refs.toast.show("Berhasil ditambahkan", "success");
            this.closeModal();
            this.getData(); // Refresh data
        } catch(e) {
            console.error(e);
            this.$refs.toast.show("Gagal menyimpan", "error");
        }
    },

    async removePrestasi(id) {
        if(!confirm("Hapus prestasi ini?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/prestasi/${id}`, this.getAuth());
            this.$refs.toast.show("Terhapus", "success");
            this.getData();
        } catch(e) {
            this.$refs.toast.show("Gagal menghapus", "error");
        }
    },

    logout() { localStorage.clear(); this.$router.push("/"); },
  },
  mounted() { this.getData(); },
};
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors;
}
.nav-link-active {
  @apply bg-white text-[#0057A8] font-semibold shadow;
}
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>