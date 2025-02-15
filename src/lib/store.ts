import { create } from 'zustand';

export interface User {
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
    set({ user }); 
  },
}));
