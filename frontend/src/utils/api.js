import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cr-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verify: (data) => api.post("/auth/verify-otp", data),
  me: () => api.get("/auth/me"),
};
export const courseApi = {
  list: () => api.get("/courses"),
  adminList: () => api.get("/admin/courses"),
  create: (data) => api.post("/admin/courses", data),
  update: (id, data) => api.patch(`/admin/courses/${id}`, data),
  remove: (id) => api.delete(`/admin/courses/${id}`),
};
export const bookingApi = {
  mine: () => api.get("/bookings/mine"),
  create: (courseId) => api.post("/bookings", { courseId }),
  cancel: (id) => api.delete(`/bookings/${id}`),
  adminList: () => api.get("/admin/bookings"),
  review: (id, data) => api.patch(`/admin/bookings/${id}`, data),
};
export const errorMessage = (error) =>
  error.response?.data?.error ||
  error.response?.data?.message ||
  "Something went wrong. Please try again.";
