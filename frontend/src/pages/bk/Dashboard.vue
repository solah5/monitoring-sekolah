<template>
  <div class="min-h-screen bg-gray-50 flex">
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
              <router-link
                to="/bk"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'BKDashboard' }"
              >
                <HomeIcon class="w-5 h-5" />
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/bk/rekap"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'BKRekap' }"
              >
                <ChartBarIcon class="w-5 h-5" />
                <span>Rekap & Eligible</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/bk/prestasi"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'BKPrestasi' }"
              >
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
            <h1 class="text-lg font-semibold text-gray-700">Dashboard BK</h1>
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
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Statistik Siswa</h2>
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h3 class="font-medium text-gray-700 text-sm">Total Siswa</h3>
            <p class="text-4xl font-bold mt-2 text-blue-900">
              {{ stats.total_siswa }}
            </p>
          </div>
          <div
            class="bg-green-50 p-6 rounded-xl shadow-md border border-green-200"
          >
            <h3 class="font-medium text-green-800 text-sm">Siswa Eligible</h3>
            <p class="text-4xl font-bold mt-2 text-green-900">
              {{ stats.siswa_eligible }}
            </p>
          </div>
          <div
            class="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200"
          >
            <h3 class="font-medium text-yellow-800 text-sm">Total Prestasi</h3>
            <p class="text-4xl font-bold mt-2 text-yellow-900">
              {{ stats.total_prestasi }}
            </p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Avatar from "@/components/Avatar.vue";
import {
  HomeIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

// Gunakan BASE_URL
const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: {
    Avatar,
    HomeIcon,
    ChartBarIcon,
    TrophyIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
  },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      stats: { total_siswa: 0, siswa_eligible: 0, total_prestasi: 0 },
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    async getStats() {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/bk/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.stats = data;
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) this.logout();
      }
    },
  },
  mounted() {
    this.getStats();
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