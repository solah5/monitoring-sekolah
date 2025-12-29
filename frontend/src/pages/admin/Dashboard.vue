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
            <li><router-link to="/admin" class="nav-link nav-link-active"><HomeIcon class="w-5 h-5" /><span>Dashboard</span></router-link></li>
            <li><router-link to="/admin/guru" class="nav-link"><UserGroupIcon class="w-5 h-5" /><span>Kelola Guru</span></router-link></li>
            <li><router-link to="/admin/guru-bk" class="nav-link"><ClipboardDocumentCheckIcon class="w-5 h-5" /><span>Kelola Guru BK</span></router-link></li>
            <li><router-link to="/admin/siswa" class="nav-link"><AcademicCapIcon class="w-5 h-5" /><span>Kelola Siswa</span></router-link></li>
            <li><router-link to="/admin/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5" /><span>Kelola Mapel</span></router-link></li>
            <li><router-link to="/admin/users" class="nav-link"><UsersIcon class="w-5 h-5" /><span>Kelola Akun</span></router-link></li>
          </ul>
        </nav>
        <div class="p-4 mt-auto"><button @click="logout" class="w-full bg-red-500 py-2.5 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><ArrowLeftOnRectangleIcon class="w-5 h-5" /><span>Logout</span></button></div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="px-4 md:px-8 h-16 flex items-center justify-between">
          <button @click="openSidebar = true" class="md:hidden p-1 text-gray-700"><Bars3Icon class="w-7 h-7" /></button>
          <div class="hidden md:block"><h1 class="text-lg font-semibold text-gray-700">Dashboard</h1></div>
          <div class="flex items-center gap-3"><span class="text-gray-600 text-sm hidden md:block">Halo, <b>{{ user?.name }}</b></span><Avatar :name="user?.name" /></div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h2>

        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-700 text-sm">Total Guru</h3>
              <UserGroupIcon class="w-6 h-6 text-purple-600" />
            </div>
            <p class="text-4xl font-bold mt-2 text-purple-900">{{ stats.guru }}</p>
          </div>

          <div class="bg-orange-100 p-6 rounded-xl shadow-sm border border-orange-200">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-700 text-sm">Guru BK</h3>
              <ClipboardDocumentCheckIcon class="w-6 h-6 text-orange-600" />
            </div>
            <p class="text-4xl font-bold mt-2 text-orange-900">{{ stats.guruBk }}</p>
          </div>

          <div class="bg-green-100 p-6 rounded-xl shadow-sm border border-green-200">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-700 text-sm">Total Siswa</h3>
              <AcademicCapIcon class="w-6 h-6 text-green-600" />
            </div>
            <p class="text-4xl font-bold mt-2 text-green-900">{{ stats.siswa }}</p>
          </div>

          <div class="bg-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-700 text-sm">Mata Pelajaran</h3>
              <BookOpenIcon class="w-6 h-6 text-blue-600" />
            </div>
            <p class="text-4xl font-bold mt-2 text-blue-900">{{ stats.mapel }}</p>
          </div>
        </section>

        <section class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Aktivitas Terakhir</h3>
          <div class="overflow-x-auto">
            <div class="min-w-full">
              <div class="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase px-4 pb-2 border-b">
                <span class="md:col-span-3">Pengguna</span>
                <span class="md:col-span-6">Aktivitas</span>
                <span class="md:col-span-3 text-right">Waktu</span>
              </div>
              <ul v-if="aktivitas.length > 0" class="space-y-2 mt-2">
                <li v-for="log in aktivitas" :key="log.id" class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center p-4 rounded-lg hover:bg-gray-50">
                  <div class="md:col-span-3">
                    <p class="text-sm font-medium text-gray-900">{{ log.username }}</p>
                    <p class="md:hidden text-xs text-gray-500">{{ log.action }}</p>
                  </div>
                  <div class="hidden md:block md:col-span-6">
                    <p class="text-sm text-gray-700">{{ log.action }}</p>
                    <p v-if="log.details" class="text-xs text-gray-500 truncate" :title="log.details">{{ log.details }}</p>
                  </div>
                  <div class="md:col-span-3 text-left md:text-right">
                    <p class="text-sm text-gray-500">{{ formatWaktu(log.timestamp) }}</p>
                  </div>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500 p-4">Belum ada aktivitas terbaru.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Avatar from "@/components/Avatar.vue";
import { HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, ClipboardDocumentCheckIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Avatar, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, ClipboardDocumentCheckIcon },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      stats: { guru: 0, guruBk: 0, siswa: 0, mapel: 0 },
      aktivitas: [],
    };
  },
  methods: {
    logout() { localStorage.clear(); this.$router.push("/"); },
    getAuthConfig() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async fetchStats() {
      try {
        const auth = this.getAuthConfig();
        // LOGIKA BARU: Panggil endpoint dashboard yang sudah kita perbaiki
        const statsRes = await axios.get(`${BASE_URL}/api/dashboard/stats`, auth);
        this.stats = statsRes.data;

        // Panggil aktivitas
        const actRes = await axios.get(`${BASE_URL}/api/aktivitas`, auth);
        this.aktivitas = actRes.data;
      } catch (e) {
        console.error("Gagal ambil stats:", e);
        if (e.response?.status === 401) this.logout();
      }
    },
    formatWaktu(timestamp) {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id });
    },
  },
  mounted() { this.fetchStats(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-semibold shadow; }
</style>