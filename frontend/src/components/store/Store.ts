import { create } from "zustand";

interface UiStore {
  alert: {
    active: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  };
  showAlert: (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => void;
  hideAlert: () => void;
  appBarHeight: number;
  setAppBarHeight: (height: number) => void;
  isSideNavOpen: boolean;
  setIsSideNavOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  alert: { active: false, message: "", severity: "info" },
  showAlert: (message, severity) =>
    set((state) => ({
      alert: {
        active: true,
        message,
        severity,
      },
    })),
  hideAlert: () =>
    set((state) => ({
      alert: {
        ...state.alert,
        active: false,
      },
    })),
  appBarHeight: 0,
  setAppBarHeight: (height: number) => set({ appBarHeight: height }),
  isSideNavOpen: false,
  setIsSideNavOpen: (isOpen: boolean) => set({ isSideNavOpen: isOpen }),
}));
