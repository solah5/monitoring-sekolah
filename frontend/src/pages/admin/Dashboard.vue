<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <aside class="h-screen w-64 bg-[#0057A8] text-white flex-col fixed md:relative z-50 hidden md:flex">
       <div class="flex flex-col items-center mt-8 gap-3 px-2 text-center">
          <img src="/logo-sma.png" class="w-20" />
          <h1 class="text-base font-bold">SMA Negeri 1<br />Gunung Sindur</h1>
       </div>
       <nav class="flex-1 w-full mt-10 px-4 space-y-3">
          <router-link to="/admin" class="nav-link nav-link-active"><HomeIcon class="w-5 h-5"/><span>Dashboard</span></router-link>
          <router-link to="/admin/guru" class="nav-link"><UserGroupIcon class="w-5 h-5"/><span>Kelola Guru</span></router-link>
          <router-link to="/admin/guru-bk" class="nav-link"><ClipboardDocumentCheckIcon class="w-5 h-5"/><span>Kelola Guru BK</span></router-link>
          <router-link to="/admin/siswa" class="nav-link"><AcademicCapIcon class="w-5 h-5"/><span>Kelola Siswa</span></router-link>
          <router-link to="/admin/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5"/><span>Kelola Mapel</span></router-link>
          <router-link to="/admin/users" class="nav-link"><UsersIcon class="w-5 h-5"/><span>Kelola Akun</span></router-link>
       </nav>
       <div class="p-4"><button @click="logout" class="w-full bg-red-500 py-2 rounded flex justify-center gap-2 hover:bg-red-600"><ArrowLeftOnRectangleIcon class="w-5 h-5"/>Logout</button></div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
        <h1 class="text-lg font-bold text-gray-700">Dashboard Admin</h1>
        <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">Halo, <b>{{ user?.name }}</b></span>
            <Avatar :name="user?.name" />
        </div>
      </header>

      <main class="p-8">
        <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <div class="flex justify-between items-center">
                <div><p class="text-gray-500 text-sm">Total Guru</p><p class="text-3xl font-bold text-gray-800">{{ stats.guru }}</p></div>
                <UserGroupIcon class="w-10 h-10 text-purple-200" />
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
            <div class="flex justify-between items-center">
                <div><p class="text-gray-500 text-sm">Guru BK</p><p class="text-3xl font-bold text-gray-800">{{ stats.guruBk }}</p></div>
                <ClipboardDocumentCheckIcon class="w-10 h-10 text-orange-200" />
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <div class="flex justify-between items-center">
                <div><p class="text-gray-500 text-sm">Total Siswa</p><p class="text-3xl font-bold text-gray-800">{{ stats.siswa }}</p></div>
                <AcademicCapIcon class="w-10 h-10 text-green-200" />
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <div class="flex justify-between items-center">
                <div><p class="text-gray-500 text-sm">Mata Pelajaran</p><p class="text-3xl font-bold text-gray-800">{{ stats.mapel }}</p></div>
                <BookOpenIcon class="w-10 h-10 text-blue-200" />
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Aktivitas Terakhir</h3>
          <ul class="space-y-4">
            <li v-for="log in aktivitas" :key="log.id" class="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                    <p class="text-sm font-bold text-gray-800">{{ log.username }} <span class="font-normal text-gray-500">melakukan</span> {{ log.action }}</p>
                    <p class="text-xs text-gray-400">{{ log.details }}</p>
                </div>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ formatWaktu(log.timestamp) }}</span>
            </li>
            <li v-if="aktivitas.length === 0" class="text-center text-gray-500 py-4">Belum ada aktivitas.</li>
          </ul>
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
import { HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, ClipboardDocumentCheckIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Avatar, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, ClipboardDocumentCheckIcon },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      stats: { guru: 0, guruBk: 0, siswa: 0, mapel: 0 },
      aktivitas: [],
    };
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async fetchStats() {
      try {
        const auth = this.getAuth();
        // Panggil endpoint baru
        const statsRes = await axios.get(`${BASE_URL}/api/dashboard/stats`, auth);
        this.stats = statsRes.data;

        // Panggil aktivitas
        const actRes = await axios.get(`${BASE_URL}/api/aktivitas`, auth);
        this.aktivitas = actRes.data;
      } catch (e) {
        console.error(e);
      }
    },
    formatWaktu(time) {
      return formatDistanceToNow(new Date(time), { addSuffix: true, locale: id });
    },
    logout() { localStorage.clear(); this.$router.push("/"); }
  },
  mounted() { this.fetchStats(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-3 px-4 rounded text-blue-100 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-bold shadow; }
</style>