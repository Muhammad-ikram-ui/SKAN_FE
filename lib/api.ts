import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * Base URL Laravel Backend API (SKAN_BE).
 * Ubah lewat environment variable NEXT_PUBLIC_API_URL bila perlu.
 */
export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT ?? "http://127.0.0.1:8000";
export const API_BASE_URL = `${API_ROOT}/api`;

/** Bangun URL penuh untuk file/foto yang disimpan Laravel di storage (disk "public"). */
export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ROOT}/storage/${path}`;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("skan_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("skan_token");
    }
    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------- */
/* Endpoint helper — sesuai routes/api.php di SKAN_BE                          */
/* -------------------------------------------------------------------------- */

export const authApi = {
  login: (payload: { username: string; password: string }) => api.post("/auth/login", payload),
  register: (payload: {
    name: string;
    username: string;
    email?: string;
    password: string;
    role: "siswa" | "guru";
  }) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const standApi = {
  list: () => api.get("/stands"),
  detail: (id: number | string) => api.get(`/stands/${id}`),
  create: (payload: Record<string, unknown>) => api.post("/stands", payload),
  update: (id: number | string, payload: Record<string, unknown>) =>
    api.put(`/stands/${id}`, payload),
  remove: (id: number | string) => api.delete(`/stands/${id}`),
};

export const menuApi = {
  list: (params?: { stand_id?: number | string; jenis?: string; status?: string }) =>
    api.get("/menus", { params }),
  detail: (id: number | string) => api.get(`/menus/${id}`),
  create: (payload: FormData) =>
    api.post("/menus", payload, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: number | string, payload: FormData) =>
    api.post(`/menus/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } }),
  /** Update ringan tanpa foto (mis. quick-toggle status tersedia/habis) — pakai PUT JSON biasa */
  updateStatus: (id: number | string, status: "tersedia" | "habis") =>
    api.put(`/menus/${id}`, { status }),
  remove: (id: number | string) => api.delete(`/menus/${id}`),
};

export const orderApi = {
  /** GET /orders — hasil otomatis difilter backend sesuai role user yang login */
  list: (params?: { status?: string }) => api.get("/orders", { params }),
  detail: (id: number | string) => api.get(`/orders/${id}`),
  /** POST /orders — khusus role siswa & guru */
  create: (payload: {
    stand_id: number;
    catatan?: string;
    items: { menu_id: number; jumlah: number }[];
  }) => api.post("/orders", payload),
  /** PATCH /orders/{id}/status — khusus role petugas_kantin & admin */
  updateStatus: (id: number | string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

export const userApi = {
  list: (role?: string) => api.get("/users", { params: role ? { role } : undefined }),
  detail: (id: number | string) => api.get(`/users/${id}`),
  createPetugas: (payload: {
    name: string;
    username: string;
    email?: string;
    password: string;
    stand_id: number;
  }) => api.post("/users/petugas", payload),
  remove: (id: number | string) => api.delete(`/users/${id}`),
};

export default api;
