<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <aside class="h-screen w-64 bg-[#0057A8] text-white flex-col fixed md:relative z-50 hidden md:flex">
       <div class="flex flex-col items-center mt-8 gap-3 px-2 text-center">
          <img src="/logo-sma.png" class="w-20" />
          <h1 class="text-base font-bold">SMA Negeri 1<br />Gunung Sindur</h1>
       </div>
       <nav class="flex-1 w-full mt-10 px-4 space-y-3">
          <router-link to="/admin" class="nav-link"><HomeIcon class="w-5 h-5"/><span>Dashboard</span></router-link>
          <router-link to="/admin/guru" class="nav-link"><UserGroupIcon class="w-5 h-5"/><span>Kelola Guru</span></router-link>
          <router-link to="/admin/guru-bk" class="nav-link"><ClipboardDocumentCheckIcon class="w-5 h-5"/><span>Kelola Guru BK</span></router-link>
          <router-link to="/admin/siswa" class="nav-link"><AcademicCapIcon class="w-5 h-5"/><span>Kelola Siswa</span></router-link>
          <router-link to="/admin/mapel" class="nav-link"><BookOpenIcon class="w-5 h-5"/><span>Kelola Mapel</span></router-link>
          <router-link to="/admin/users" class="nav-link nav-link-active"><UsersIcon class="w-5 h-5"/><span>Kelola Akun</span></router-link>
       </nav>
       <div class="p-4"><button @click="logout" class="w-full bg-red-500 py-2 rounded flex justify-center gap-2 hover:bg-red-600"><ArrowLeftOnRectangleIcon class="w-5 h-5"/>Logout</button></div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header class="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
        <h1 class="text-lg font-bold text-gray-700">Kelola Akun Pengguna</h1>
        <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">Halo, <b>{{ user?.name }}</b></span>
            <Avatar :name="user?.name" />
        </div>
      </header>

      <main class="p-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2">
                <PlusIcon class="w-5 h-5"/> Tambah Akun
            </button>

            <div class="flex gap-4 w-full md:w-auto">
                <select v-model="filterRole" class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="guru">Guru</option>
                    <option value="bk">Guru BK</option>
                    <option value="siswa">Siswa</option>
                </select>

                <input v-model="search" placeholder="Cari Username / Nama..." class="border rounded px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-100 border-b">
                    <tr>
                        <th class="p-4">No</th>
                        <th class="p-4">Username</th>
                        <th class="p-4">Nama Pengguna</th>
                        <th class="p-4 text-center">Role</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredList.length === 0"><td colspan="5" class="p-6 text-center text-gray-500">Data tidak ditemukan.</td></tr>
                    <tr v-for="(u, i) in filteredList" :key="u.id" class="border-b hover:bg-gray-50">
                        <td class="p-4">{{ i+1 }}</td>
                        <td class="p-4 font-mono text-blue-600">{{ u.username }}</td>
                        <td class="p-4 font-bold text-gray-800">{{ u.name }}</td>
                        <td class="p-4 text-center">
                            <span :class="roleClass(u.role)" class="px-2 py-1 rounded text-xs font-bold uppercase">{{ u.role }}</span>
                        </td>
                        <td class="p-4 text-center space-x-2">
                            <button @click="edit(u)" class="text-yellow-600 hover:text-yellow-800"><PencilIcon class="w-5 h-5"/></button>
                            <button @click="remove(u.id)" class="text-red-600 hover:text-red-800" :disabled="u.role === 'admin'"><TrashIcon class="w-5 h-5"/></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </main>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Akun' : 'Tambah Akun' }}</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Role</label>
                    <select v-model="form.role" class="w-full border p-2 rounded">
                        <option value="admin">Admin</option>
                        <option value="guru">Guru</option>
                        <option value="bk">Guru BK</option>
                        <option value="siswa">Siswa</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Username</label>
                    <input v-model="form.username" placeholder="Username" class="w-full border p-2 rounded" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <input v-model="form.name" placeholder="Nama Lengkap" class="w-full border p-2 rounded" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input v-model="form.password" type="password" placeholder="Isi jika ingin mengganti password" class="w-full border p-2 rounded" />
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-2">
                <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                <button @click="save" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
            </div>
        </div>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Avatar from "@/components/Avatar.vue";
import { HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon } from "@heroicons/vue/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  components: { Toast, Avatar, HomeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ArrowLeftOnRectangleIcon, PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon },
  data() {
    return {
        user: JSON.parse(localStorage.getItem("user")),
        usersList: [],
        search: "",
        filterRole: "", // Filter Dropdown
        showModal: false,
        isEdit: false,
        form: { id: null, username: "", name: "", password: "", role: "guru" }
    };
  },
  computed: {
    filteredList() {
        return this.usersList.filter(u => {
            const matchRole = this.filterRole ? u.role === this.filterRole : true;
            const matchSearch = u.name.toLowerCase().includes(this.search.toLowerCase()) || u.username.includes(this.search);
            return matchRole && matchSearch;
        });
    }
  },
  methods: {
    getAuth() { return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }; },
    async getData() {
        try {
            const res = await axios.get(`${BASE_URL}/api/users`, this.getAuth());
            this.usersList = res.data;
        } catch(e) { console.error(e); }
    },
    roleClass(role) {
        if(role==='admin') return 'bg-red-100 text-red-800';
        if(role==='guru') return 'bg-blue-100 text-blue-800';
        if(role==='bk') return 'bg-orange-100 text-orange-800';
        return 'bg-green-100 text-green-800';
    },
    openModal() { this.form = { id: null, username:"", name:"", password:"", role:"guru" }; this.isEdit=false; this.showModal=true; },
    edit(item) { this.form = {...item, password:""}; this.isEdit=true; this.showModal=true; },
    closeModal() { this.showModal=false; },
    async save() {
        if(!this.form.username || !this.form.name) return this.$refs.toast.show("Lengkapi data!", "error");
        try {
            const auth = this.getAuth();
            if(this.isEdit) await axios.put(`${BASE_URL}/api/users/${this.form.id}`, this.form, auth);
            else await axios.post(`${BASE_URL}/api/users`, this.form, auth);
            this.getData(); this.closeModal(); this.$refs.toast.show("Berhasil!", "success");
        } catch(e) { this.$refs.toast.show("Gagal menyimpan", "error"); }
    },
    async remove(id) {
        if(!confirm("Hapus akun ini?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/users/${id}`, this.getAuth());
            this.getData();
        } catch(e) { alert("Gagal menghapus"); }
    },
    logout() { localStorage.clear(); this.$router.push("/"); }
  },
  mounted() { this.getData(); }
};
</script>

<style scoped>
.nav-link { @apply flex items-center gap-3 py-3 px-4 rounded text-blue-100 hover:bg-blue-800 hover:text-white transition-colors; }
.nav-link-active { @apply bg-white text-[#0057A8] font-bold shadow; }
</style>