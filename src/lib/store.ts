import { create } from 'zustand';

export interface User {
  id: number,
  email: string;
  name: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => {
    console.log("Setting user:", user); 
    set({ user }); 
    console.log("Updated state:", useUserStore.getState()); // Log the updated state
  },
}));
