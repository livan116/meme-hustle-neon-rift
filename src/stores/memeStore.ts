import { create } from 'zustand';
import { supabase, type Meme as SupabaseMeme, type Bid as SupabaseBid } from '@/lib/supabase';
import img1 from '@/assets/cybercat.png';
import img2 from '@/assets/cyberdog.png';
import img3 from '@/assets/stonks.png';

export type Meme = {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  ownerId: string;
  ownerName: string;
  price: number;
  createdAt: Date;
  aiCaption?: string;
  vibeAnalysis?: string;
};

export type Bid = {
  id: string;
  memeId: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: Date;
};

export type MemeStore = {
  memes: Meme[];
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  fetchMemes: () => Promise<void>;
  addMeme: (meme: Omit<Meme, 'id' | 'createdAt'>) => Promise<void>;
  addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => Promise<void>;
  upvoteMeme: (memeId: string) => Promise<void>;
  downvoteMeme: (memeId: string) => Promise<void>;
  getLeaderboard: () => Promise<Meme[]>;
  getTopBids: (memeId: string) => Promise<Bid[]>;
  getMemeById: (id: string) => Meme | undefined;
  updateMemeOwner: (memeId: string, userId: string, userName: string, price: number) => Promise<void>;
};

// Helper function to convert Supabase meme to app meme
const convertSupabaseMeme = (meme: SupabaseMeme): Meme => ({
  id: meme.id,
  title: meme.title,
  imageUrl: meme.image_url,
  tags: meme.tags,
  upvotes: meme.upvotes,
  downvotes: meme.downvotes,
  ownerId: meme.owner_id,
  ownerName: meme.owner_name,
  price: meme.price,
  createdAt: new Date(meme.created_at),
  aiCaption: meme.ai_caption,
  vibeAnalysis: meme.vibe_analysis,
});

// Helper function to convert app meme to Supabase meme
const convertToSupabaseMeme = (meme: Omit<Meme, 'id' | 'createdAt'>): Omit<SupabaseMeme, 'id' | 'created_at'> => ({
  title: meme.title,
  image_url: meme.imageUrl,
  tags: meme.tags,
  upvotes: meme.upvotes,
  downvotes: meme.downvotes,
  owner_id: meme.ownerId,
  owner_name: meme.ownerName,
  price: meme.price,
  ai_caption: meme.aiCaption,
  vibe_analysis: meme.vibeAnalysis,
});

// Generate some placeholder memes
const generatePlaceholderMemes = (): Meme[] => {
  const placeholders = [
    {
      id: '1',
      title: 'Cyber Doge',
      imageUrl: img1,
      tags: ['doge', 'cyberpunk', 'neon'],
      upvotes: 69,
      downvotes: 4,
      ownerId: 'system',
      ownerName: 'SYSTEM',
      price: 420,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      aiCaption: 'When you hack the mainframe but forget to pet the doge',
      vibeAnalysis: 'Neon Doge Energy'
    },
    {
      id: '2',
      title: 'Stonks Guy in 2077',
      imageUrl: img2,
      tags: ['stonks', 'crypto', 'money'],
      upvotes: 42,
      downvotes: 7,
      ownerId: 'system',
      ownerName: 'SYSTEM',
      price: 1337,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      aiCaption: 'When your crypto portfolio goes up 0.001%',
      vibeAnalysis: 'Dystopian Market Chaos'
    },
    {
      id: '3',
      title: 'Matrix Cat',
      imageUrl: img3,
      tags: ['cat', 'matrix', 'glitch'],
      upvotes: 128,
      downvotes: 2,
      ownerId: 'system',
      ownerName: 'SYSTEM',
      price: 777,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      aiCaption: 'I know kung-meow',
      vibeAnalysis: 'Digital Feline Override'
    }
  ];

  return placeholders;
};

export const useMemeStore = create<MemeStore>((set, get) => ({
  memes: [],
  bids: [],
  isLoading: false,
  error: null,

  fetchMemes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      set({
        memes: data.map(convertSupabaseMeme),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching memes:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch memes',
        isLoading: false
      });
    }
  },

  addMeme: async (meme) => {
    set({ isLoading: true, error: null });
    try {
      // Validate required fields
      if (!meme.title || !meme.imageUrl) {
        throw new Error('Title and image URL are required');
      }

      const supabaseMeme = convertToSupabaseMeme(meme);

      const { data, error } = await supabase
        .from('memes')
        .insert([supabaseMeme])
        .select()
        .single();

      if (error) {
        throw error;
      }

      set((state) => ({
        memes: [convertSupabaseMeme(data), ...state.memes],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error in addMeme:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add meme',
        isLoading: false
      });
      throw error; // Re-throw to handle in the component
    }
  },

  addBid: async (bid) => {
    set({ isLoading: true, error: null });
    try {
      // Validate bid amount
      if (bid.amount <= 0) {
        throw new Error('Bid amount must be greater than 0');
      }

      const { data, error } = await supabase
        .from('bids')
        .insert([{
          meme_id: bid.memeId,
          user_id: bid.userId,
          user_name: bid.userName,
          amount: bid.amount,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update both bids and memes state
      set((state) => {
        const newBid = {
          id: data.id,
          memeId: data.meme_id,
          userId: data.user_id,
          userName: data.user_name,
          amount: data.amount,
          createdAt: new Date(data.created_at),
        };

        // Update the meme's price if this is the highest bid
        const updatedMemes = state.memes.map(meme => {
          if (meme.id === bid.memeId && bid.amount > meme.price) {
            return { ...meme, price: bid.amount };
          }
          return meme;
        });

        return {
          bids: [newBid, ...state.bids],
          memes: updatedMemes,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add bid',
        isLoading: false
      });
      throw error; // Re-throw to handle in the component
    }
  },

  upvoteMeme: async (memeId) => {
    set({ isLoading: true, error: null }); // Clear error on upvote start
    try {
      // Fetch the current meme to get the current upvote count
      const currentMemes = get().memes;
      const memeToUpdate = currentMemes.find(meme => meme.id === memeId);

      if (!memeToUpdate) {
        throw new Error(`Meme with ID ${memeId} not found`);
      }

      const newUpvotes = memeToUpdate.upvotes + 1;

      const { error } = await supabase
        .from('memes')
        .update({ upvotes: newUpvotes })
        .eq('id', memeId);

      if (error) throw error;

      set((state) => ({
        memes: state.memes.map(meme =>
          meme.id === memeId
            ? { ...meme, upvotes: newUpvotes }
            : meme
        ),
        isLoading: false,
        error: null, // Clear error on success
      }));
    } catch (error) {
      console.error('Error upvoting meme:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to upvote meme.',
        isLoading: false
      });
    }
  },

  downvoteMeme: async (memeId) => {
    set({ isLoading: true, error: null }); // Clear error on downvote start
    try {
      // Fetch the current meme to get the current downvote count
      const currentMemes = get().memes;
      const memeToUpdate = currentMemes.find(meme => meme.id === memeId);

      if (!memeToUpdate) {
        throw new Error(`Meme with ID ${memeId} not found`);
      }

      const newDownvotes = memeToUpdate.downvotes + 1;

      const { error } = await supabase
        .from('memes')
        .update({ downvotes: newDownvotes })
        .eq('id', memeId);

      if (error) throw error;

      set((state) => ({
        memes: state.memes.map(meme =>
          meme.id === memeId
            ? { ...meme, downvotes: newDownvotes }
            : meme
        ),
        isLoading: false,
        error: null, // Clear error on success
      }));
    } catch (error) {
      console.error('Error downvoting meme:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to downvote meme.',
        isLoading: false
      });
    }
  },

  getLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      // Ensure memes are loaded
      if (get().memes.length === 0) {
        await get().fetchMemes();
      }

      const { memes } = get();
      set({ isLoading: false, error: null });
      return [...memes].sort((a, b) =>
        (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      );
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to get leaderboard',
        isLoading: false
      });
      return [];
    }
  },

  getTopBids: async (memeId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('meme_id', memeId)
        .order('amount', { ascending: false })
        .limit(5);

      if (error) throw error;

      set({ isLoading: false, error: null });
      return data.map(bid => ({
        id: bid.id,
        memeId: bid.meme_id,
        userId: bid.user_id,
        userName: bid.user_name,
        amount: bid.amount,
        createdAt: new Date(bid.created_at),
      }));
    } catch (error) {
      console.error('Failed to fetch top bids:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch top bids',
        isLoading: false
      });
      return [];
    }
  },

  getMemeById: (id) => {
    return get().memes.find(meme => meme.id === id);
  },

  updateMemeOwner: async (memeId, userId, userName, price) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('memes')
        .update({
          owner_id: userId,
          owner_name: userName,
          price: price,
        })
        .eq('id', memeId);

      if (error) throw error;

      set((state) => ({
        memes: state.memes.map(meme =>
          meme.id === memeId
            ? { ...meme, ownerId: userId, ownerName: userName, price }
            : meme
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update meme owner',
        isLoading: false
      });
    }
  },
}));
