import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";
// import dotenv from "dotenv";
// dotenv.config();

const API_END_POINT = 'https://food-2fnpcty2k-mritunjay-natwarlal-nagars-projects.vercel.app/api/v1/menu';
type MenuState = {
    loading: boolean;
    menu: null;
    createMenu: (formData: FormData) => Promise<void>;
    editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(persist((set) => ({
    loading: false,
    menu: null,
    // add menu api implementation
    createMenu: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if(response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, menu: response.data.menu });
            }
            // update restaurant
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    // edit menu api implementation
    editMenu: async (menuId: string, formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if(response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, menu: response.data.menu });
            }
            // update restaurant menu
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
}), {
    name: "menu-name",
    storage: createJSONStorage(() => localStorage)
}));