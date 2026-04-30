"use client";

import { create } from "zustand";
import { api } from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: "",
  login: async (email, password) => {
    set({ loading: true, error: "" });
    try {
      const data = await api.login({ email, password });
      set({ user: data.user, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },
  register: async (name, email, password) => {
    set({ loading: true, error: "" });
    try {
      await api.register({ name, email, password });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },
  bootstrap: async () => {
    try {
      const user = await api.me();
      set({ user, initialized: true });
    } catch (_e) {
      set({ user: null, initialized: true });
    }
  },
  logout: async () => {
    await api.logout();
    set({ user: null });
  }
}));
