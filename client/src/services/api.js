import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// --- Group API ---

export const createGroup = (name, memberIds) =>
  api.post("/groups", { name, memberIds }).then((r) => r.data);

export const inviteMember = (groupId, userId) =>
  api.post(`/groups/${groupId}/invite`, { userId }).then((r) => r.data);

export const getGroupMembers = (groupId) =>
  api.get(`/groups/${groupId}/members`).then((r) => r.data);

export const removeMember = (groupId, userId) =>
  api.delete(`/groups/${groupId}/members/${userId}`).then((r) => r.data);

export default api;
