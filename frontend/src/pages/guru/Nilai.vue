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
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        >
          <button
            @click="openForm"
            class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" /><span>Input Nilai</span>
          </button>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari siswa atau mapel..."
            class="w-full md:w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto"
        >
          <table class="w-full text-left min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Nama Siswa
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Mata Pelajaran
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Jenis
                </th>
                <th class="py-3 px-5 text-sm font-semibold text-gray-600">
                  Nilai
                </th>
                <th
                  class="py-3 px-5 text-sm font-semibold text-gray-600 text-center"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0">
                <td colspan="5" class="py-6 text-center text-gray-500">
                  Belum ada data nilai.
                </td>
              </tr>
              <tr
                v-for="item in paginatedData"
                :key="item.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-5 text-sm text-gray-700">
                  {{ item.nama_siswa }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700">
                  {{ item.nama_mapel }}
                </td>
                <td class="py-3 px-5 text-sm text-gray-700">
                  <span
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold"
                    >{{ item.jenis_nilai }}</span
                  >
                </td>
                <td class="py-3 px-5 text-sm font-bold text-gray-900">
                  {{ item.nilai }}
                </td>
                <td class="py-3 px-5 text-sm text-center">
                  <button
                    @click="edit(item)"
                    class="text-yellow-600 hover:text-yellow-700 p-1 mx-1"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="remove(item.id)"
                    class="text-red-600 hover:text-red-700 p-1 mx-1"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
      @click.self="closeForm"
    >
      <div
        class="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative h-auto max-h-[90vh] overflow-visible"
      >
        <button
          @click="closeForm"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-bold mb-5 text-gray-800">
          {{ isEdit ? "Edit Nilai" : "Input Nilai" }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Siswa</label
            >
            <SearchableSelect
              :options="siswaOptions"
              v-model="form.siswa_nama"
              @selected="(opt) => (form.siswa_id = opt.originalId)"
              placeholder="Cari siswa..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Mata Pelajaran</label
            >
            <SearchableSelect
              :options="mapelOptions"
              v-model="form.nama_mapel_display"
              @selected="(opt) => (form.mapel_id = opt.originalId)"
              placeholder="Cari mata pelajaran..."
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Jenis Nilai</label
              >
              <select
                v-model="form.jenis_nilai"
                class="border border-gray-300 p-2 w-full rounded-lg bg-white"
              >
                <option value="UH1">UH1</option>
                <option value="UH2">UH2</option>
                <option value="UH3">UH3</option>
                <option value="PTS">PTS</option>
                <option value="PAS">PAS</option>
                <option value="Tugas">Tugas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Nilai (0-100)</label
              >
              <input
                v-model="form.nilai"
                type="number"
                min="0"
                max="100"
                class="border border-gray-300 p-2 w-full rounded-lg"
              />
            </div>
          </div>
        </div>
        <button
          @click="save"
          class="bg-blue-600 text-white w-full py-2.5 rounded-lg mt-6 text-sm font-medium hover:bg-blue-700"
        >
          Simpan
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
import SearchableSelect from "@/components/SearchableSelect.vue";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
} from "@heroicons/vue/24/solid";

// Gunakan BASE_URL dari environment variable
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/nilai`;

export default {
  components: {
    Toast,
    Avatar,
    SearchableSelect,
    HomeIcon,
    ClipboardDocumentListIcon,
    TrophyIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    BookOpenIcon,
  },
  data() {
    return {
      openSidebar: false,
      user: JSON.parse(localStorage.getItem("user")),
      nilaiList: [],
      siswaList: [],
      mapelList: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      showForm: false,
      isEdit: false,
      form: {
        id: null,
        siswa_id: null,
        siswa_nama: "", // v-model untuk SearchableSelect Siswa
        mapel_id: null,
        nama_mapel_display: "", // v-model untuk SearchableSelect Mapel
        jenis_nilai: "UH1",
        nilai: 0,
      },
    };
  },
  computed: {
    // Format data siswa untuk SearchableSelect
    siswaOptions() {
      return this.siswaList.map((s) => ({
        label: `${s.nama} (${s.kelas})`,
        value: s.nama,
        originalId: s.id,
      }));
    },
    // Format data mapel untuk SearchableSelect
    mapelOptions() {
      return this.mapelList.map((m) => ({
        label: m.nama_mapel,
        value: m.nama_mapel,
        originalId: m.id,
      }));
    },
    filteredData() {
      if (!this.searchQuery) return this.nilaiList;
      const q = this.searchQuery.toLowerCase();
      return this.nilaiList.filter(
        (i) =>
          i.nama_siswa.toLowerCase().includes(q) ||
          i.nama_mapel.toLowerCase().includes(q)
      );
    },
    paginatedData() {
      // Logic pagination sederhana (bisa dikembangkan)
      return this.filteredData;
    },
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
        // Gunakan BASE_URL di sini juga
        const [nilaiRes, siswaRes, mapelRes] = await Promise.all([
          axios.get(API_URL, auth),
          axios.get(`${BASE_URL}/api/siswa`, auth),
          axios.get(`${BASE_URL}/api/mapel`, auth),
        ]);
        this.nilaiList = nilaiRes.data;
        this.siswaList = siswaRes.data;
        this.mapelList = mapelRes.data;
      } catch (e) {
        console.error(e);
        if (e.response?.status === 403)
          this.$refs.toast.show("Akses ditolak! Cek backend.", "error");
        else if (e.response?.status === 401) this.logout();
      }
    },
    openForm() {
      this.form = {
        id: null,
        siswa_id: null,
        siswa_nama: "",
        mapel_id: null,
        nama_mapel_display: "",
        jenis_nilai: "UH1",
        nilai: 0,
      };
      this.isEdit = false;
      this.showForm = true;
    },
    edit(item) {
      this.form = {
        ...item,
        siswa_nama: item.nama_siswa, // Pre-fill nama siswa
        nama_mapel_display: item.nama_mapel, // Pre-fill nama mapel
      };
      this.isEdit = true;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    async save() {
      if (!this.form.siswa_id || !this.form.mapel_id) {
        this.$refs.toast.show("Lengkapi data!", "error");
        return;
      }
      try {
        if (this.isEdit)
          await axios.put(
            `${API_URL}/${this.form.id}`,
            this.form,
            this.getAuth()
          );
        else await axios.post(API_URL, this.form, this.getAuth());
        this.showForm = false;
        this.getData();
        this.$refs.toast.show("Berhasil!", "success");
      } catch (e) {
        this.$refs.toast.show("Error!", "error");
      }
    },
    async remove(id) {
      if (!confirm("Hapus?")) return;
      await axios.delete(`${API_URL}/${id}`, this.getAuth());
      this.getData();
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