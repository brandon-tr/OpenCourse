import { create } from "zustand";

const useStore = create((set) => ({
  alert: { active: false, message: "", severity: "" },
}));
