<template>
  <div class="min-h-screen flex bg-gray-100">
    <div
      class="hidden md:flex w-1/2 bg-[#0057A8] items-center justify-center p-10"
    >
      <div class="text-center text-white">
        <img
          src="/logo-sma.png"
          alt="Logo SMA"
          class="w-32 mx-auto mb-6"
        />

        <h1 class="text-3xl font-bold mb-3 tracking-wide">
          Sistem Monitoring Nilai
        </h1>

        <p class="text-sm opacity-90 leading-relaxed">
          SMA Negeri 1 Gunung Sindur <br />
          Monitoring nilai akademik secara mudah, cepat, dan akurat
        </p>
      </div>
    </div>

    <div class="w-full md:w-1/2 flex items-center justify-center p-6">
      <div
        class="w-full max-w-sm bg-white shadow-lg rounded-2xl p-8 border-t-4 border-[#FFCC00]"
      >
        <h2 class="text-2xl font-bold text-center mb-6 text-[#0057A8]">
          Login
        </h2>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block mb-1 text-gray-600 font-medium">Username</label>
            <input
              v-model="username"
              type="text"
              class="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
              placeholder="Masukkan username"
            />
          </div>

          <div class="mb-4 relative">
            <label class="block mb-1 text-gray-600 font-medium">Password</label>

            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="w-full border rounded-lg p-2 pr-10 focus:ring focus:ring-blue-300"
              placeholder="••••••"
            />

            <span
              @click="togglePassword"
              class="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 
                  7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943
                   -9.542-7a9.97 9.97 0 012.357-4.362M9.88 9.88A3 3 0 0114.12
                   14.12M3 3l18 18"
                />
              </svg>
            </span>
          </div>

          <button
            class="w-full bg-[#0057A8] text-white p-2 rounded-lg hover:bg-blue-900 transition font-semibold"
          >
            Masuk
          </button>
        </form>

        <p class="text-center text-gray-500 text-sm mt-6">
          © {{ new Date().getFullYear() }} — SMA Negeri 1 Gunung Sindur
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// Ambil URL dari environment variable (file .env)
// Jika di lokal, dia baca dari .env
// Jika di Vercel, dia baca dari Environment Variables setting Vercel
const BASE_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        // Gunakan BASE_URL di sini
        const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect by role
        const role = data.user.role;
        if (role === "admin") this.$router.push("/admin");
        else if (role === "guru") this.$router.push("/guru");
        else if (role === "bk") this.$router.push("/bk");
        else this.$router.push("/siswa");
      } catch (e) {
        console.error(e); // Tambahkan log error agar mudah debug
        alert(e.response?.data?.message || "Login gagal");
      }
    },
  },
};
</script>