import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";

const AdminDashboard = () => import("../pages/admin/Dashboard.vue");
const SiswaDashboard = () => import("../pages/siswa/Dashboard.vue");

const GuruDashboard = () => import("../pages/guru/Dashboard.vue");
const GuruNilai = () => import("../pages/guru/Nilai.vue");
const GuruPrestasi = () => import("../pages/guru/Prestasi.vue")
const GuruMapel = () => import("../pages/guru/Mapel.vue");

const BKDashboard = () => import("../pages/bk/Dashboard.vue");
const BKRekap = () => import("../pages/bk/Rekap.vue");
const BKPrestasi = () => import("../pages/bk/Prestasi.vue");

const routes = [
  { path: "/", name: "Login", component: Login },

  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { role: "admin" },
  },
  {
    path: "/guru",
    name: "GuruDashboard",
    component: GuruDashboard,
    meta: { role: "guru" },
  },
  {
    path: "/siswa",
    name: "SiswaDashboard",
    component: SiswaDashboard,
    meta: { role: "siswa" },
  },
  {
    path: "/admin/guru",
    name: "Guru",
    component: () => import("../pages/admin/Guru.vue"),
    meta: { role: "admin" }, 
  },
  {
    path: "/admin/siswa",
    name: "Siswa",
    component: () => import("../pages/admin/Siswa.vue"), 
    meta: { role: "admin" }, 
  },
  {
    path: "/admin/mapel",
    name: "Mapel",
    component: () => import("../pages/admin/Mapel.vue"),
    meta: { role: "admin" },
  },
  {
    path: "/admin/users",
    name: "Users",
    component: () => import("../pages/admin/Users.vue"),
    meta: { role: "admin" },
  },
  {
    path: "/admin/guru-bk",
    name: "GuruBK",
    component: () => import("../pages/admin/GuruBK.vue"),
    meta: { role: "admin" },
  },
  {
    path: "/guru",
    name: "GuruDashboard",
    component: GuruDashboard,
    meta: { role: "guru" },
  },
  {
    path: "/guru/nilai",
    name: "GuruNilai",
    component: GuruNilai,
    meta: { role: "guru" },
  },
  {
    path: "/guru/prestasi",
    name: "GuruPrestasi",
    component: GuruPrestasi,
    meta: { role: "guru" },
  },
  {
    path: "/guru/mapel",
    name: "GuruMapel",
    component: GuruMapel,
    meta: { role: "guru" },
  },
  {
    path: "/bk",
    name: "BKDashboard",
    component: BKDashboard,
    meta: { role: "bk" },
  },
  {
    path: "/bk/rekap",
    name: "BKRekap",
    component: BKRekap,
    meta: { role: "bk" },
  },
  {
    path: "/bk/prestasi",
    name: "BKPrestasi",
    component: BKPrestasi,
    meta: { role: "bk" },
  },
  {
    path: "/siswa",
    name: "SiswaDashboard",
    component: SiswaDashboard,
    meta: { role: "siswa" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.role) return next();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role === to.meta.role) return next();

  return next("/");
});

export default router;