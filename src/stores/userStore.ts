
import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  credits: number;
};

type UserStore = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateCredits: (amount: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  updateCredits: (amount) => set((state) => {
    if (!state.user) return state;
    return {
      user: {
        ...state.user,
        credits: state.user.credits + amount
      }
    };
  })
}));
