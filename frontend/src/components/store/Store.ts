import {create} from "zustand";
import {UserLogin} from "@/components/ui/forms/LoginForm";

interface UiStore {
    alert: {
        active: boolean;
        message: string;
        severity: "success" | "info" | "warning" | "error";
    };
    showAlert: (
        message: string,
        severity: "success" | "info" | "warning" | "error",
        notification?: boolean
    ) => void;
    hideAlert: () => void;
    appBarHeight: number;
    setAppBarHeight: (height: number) => void;
    loadingState: boolean;
    setLoadingState: (value: boolean) => void;
    isSideNavOpen: boolean;
    setIsSideNavOpen: (isOpen: boolean) => void;
    notification: {
        active: boolean;
        message: string;
        severity: "success" | "info" | "warning" | "error";
    };
    showNotification: (
        message: string,
        severity: "success" | "info" | "warning" | "error"
    ) => void;
    hideNotification: () => void;
    user: UserLogin
    setUser: (user: {
        level: number,
        loggedIn: boolean,
        Email: string,
        FirstName: string,
        IsBanned: boolean,
        LastName: string
    }) => void;
    tableData: any,
    setTableData: (data: any) => void,
}

export const useUiStore = create<UiStore>((set) => ({
    alert: {active: false, message: "", severity: "info"},
    showAlert: (message, severity, notification = false) =>
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
    setAppBarHeight: (height: number) => set({appBarHeight: height}),
    loadingState: false,
    setLoadingState: (value: boolean) => set({loadingState: value}),
    isSideNavOpen: false,
    setIsSideNavOpen: (isOpen: boolean) => set({isSideNavOpen: isOpen}),
    notification: {
        active: false,
        message: "",
        severity: "info",
    },
    showNotification: (message, severity) =>
        set((state) => ({
            notification: {
                active: true,
                message,
                severity,
            },
        })),
    hideNotification: () =>
        set((state) => ({
            notification: {
                ...state.notification,
                active: false,
            },
        })),
    user: {
        level: 0,
        loggedIn: false,
        Email: "",
        FirstName: "",
        LastName: "",
        IsBanned: false,
    },
    setUser: (user) => set({user}),
    tableData: [],
    setTableData: (data) => set({tableData: data}),
}));
