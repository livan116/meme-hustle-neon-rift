
import { create } from 'zustand';

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

type Bid = {
  id: string;
  memeId: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: Date;
};

type MemeStore = {
  memes: Meme[];
  bids: Bid[];
  addMeme: (meme: Omit<Meme, 'id' | 'createdAt'>) => void;
  addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void;
  upvoteMeme: (memeId: string) => void;
  downvoteMeme: (memeId: string) => void;
  getLeaderboard: () => Meme[];
  getTopBids: (memeId: string) => Bid[];
  getMemeById: (id: string) => Meme | undefined;
  updateMemeOwner: (memeId: string, userId: string, userName: string, price: number) => void;
};

// Generate some placeholder memes
const generatePlaceholderMemes = (): Meme[] => {
  const placeholders = [
    {
      id: '1',
      title: 'Cyber Doge',
      imageUrl: 'https://source.unsplash.com/random/600x400/?cyberpunk,dog',
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
      imageUrl: 'https://source.unsplash.com/random/600x400/?stock,neon',
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
      imageUrl: 'https://source.unsplash.com/random/600x400/?matrix,cat',
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
  memes: generatePlaceholderMemes(),
  bids: [],
  addMeme: (meme) => set((state) => ({
    memes: [
      ...state.memes, 
      { 
        ...meme, 
        id: `meme-${Date.now()}`, 
        createdAt: new Date(),
        upvotes: 0,
        downvotes: 0
      }
    ]
  })),
  addBid: (bid) => set((state) => ({
    bids: [
      ...state.bids,
      {
        ...bid,
        id: `bid-${Date.now()}`,
        createdAt: new Date()
      }
    ]
  })),
  upvoteMeme: (memeId) => set((state) => ({
    memes: state.memes.map(meme => 
      meme.id === memeId 
      ? { ...meme, upvotes: meme.upvotes + 1 } 
      : meme
    )
  })),
  downvoteMeme: (memeId) => set((state) => ({
    memes: state.memes.map(meme => 
      meme.id === memeId 
      ? { ...meme, downvotes: meme.downvotes + 1 } 
      : meme
    )
  })),
  getLeaderboard: () => {
    const { memes } = get();
    return [...memes].sort((a, b) => 
      (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    );
  },
  getTopBids: (memeId) => {
    const { bids } = get();
    return bids
      .filter(bid => bid.memeId === memeId)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  },
  getMemeById: (id) => {
    return get().memes.find(meme => meme.id === id);
  },
  updateMemeOwner: (memeId, userId, userName, price) => set((state) => ({
    memes: state.memes.map(meme => 
      meme.id === memeId 
      ? { ...meme, ownerId: userId, ownerName: userName, price } 
      : meme
    )
  }))
}));
