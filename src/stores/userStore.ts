
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  name: string;
  credits: number;
  avatar?: string;
  joinedDate: Date;
  ownedMemes: string[];
};

type UserStore = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  updateCredits: (amount: number) => void;
  addOwnedMeme: (memeId: string) => void;
};

// Mock user data
const mockUsers = [
  {
    id: 'user1',
    name: 'CyberNinja',
    credits: 1000,
    avatar: 'https://source.unsplash.com/random/100x100/?cyberpunk,avatar',
    joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    ownedMemes: [],
  },
  {
    id: 'user2',
    name: 'NeonHacker',
    credits: 2500,
    avatar: 'https://source.unsplash.com/random/100x100/?hacker,neon',
    joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    ownedMemes: [],
  },
  {
    id: 'user3',
    name: 'GlitchQueen',
    credits: 1750,
    avatar: 'https://source.unsplash.com/random/100x100/?cyberpunk,woman',
    joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    ownedMemes: [],
  }
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (name) => {
        try {
          // First, check if we're in Supabase development mode
          if (supabaseUrl && supabaseAnonKey) {
            // In a real implementation, we would authenticate with Supabase here
            // For now, we'll simulate by checking if the user exists in Supabase users table
            // and create it if not
            
            // For now, using mock data
            const existingUser = mockUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
            
            if (existingUser) {
              set({ user: existingUser });
            } else {
              // Create new user if not found
              const newUser = {
                id: `user-${Date.now()}`,
                name,
                credits: 1000, // Starting credits
                joinedDate: new Date(),
                ownedMemes: [],
              };
              
              set({ user: newUser });
            }
          } else {
            // Fallback to mock data when Supabase is not configured
            const existingUser = mockUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
            
            if (existingUser) {
              set({ user: existingUser });
            } else {
              // Create new user if not found
              const newUser = {
                id: `user-${Date.now()}`,
                name,
                credits: 1000, // Starting credits
                joinedDate: new Date(),
                ownedMemes: [],
              };
              
              set({ user: newUser });
            }
          }
        } catch (error) {
          console.error('Error logging in:', error);
          // Fall back to mock data on error
          const existingUser = mockUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
          
          if (existingUser) {
            set({ user: existingUser });
          } else {
            const newUser = {
              id: `user-${Date.now()}`,
              name,
              credits: 1000,
              joinedDate: new Date(),
              ownedMemes: [],
            };
            
            set({ user: newUser });
          }
        }
      },
      logout: () => set({ user: null }),
      updateCredits: (amount) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            credits: state.user.credits + amount
          }
        };
      }),
      addOwnedMeme: (memeId) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            ownedMemes: [...state.user.ownedMemes, memeId]
          }
        };
      })
    }),
    {
      name: 'meme-hustle-user-storage',
    }
  )
);
