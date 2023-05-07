import { create } from "zustand";

interface UiStore {
  alert: {
    active: boolean;
    message: string;
    severity: string;
  };
  appBarHeight: number;
  setAppBarHeight: (height: number) => void;
  isSideNavOpen: boolean;
  setIsSideNavOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  alert: { active: false, message: "", severity: "" },
  appBarHeight: 0,
  setAppBarHeight: (height: number) => set({ appBarHeight: height }),
  isSideNavOpen: false,
  setIsSideNavOpen: (isOpen: boolean) => set({ isSideNavOpen: isOpen }),
}));
