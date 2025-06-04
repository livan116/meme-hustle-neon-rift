import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Meme = {
    id: string;
    title: string;
    image_url: string;
    tags: string[];
    upvotes: number;
    downvotes: number;
    owner_id: string;
    owner_name: string;
    price: number;
    created_at: string;
    ai_caption?: string;
    vibe_analysis?: string;
};

export type Bid = {
    id: string;
    meme_id: string;
    user_id: string;
    user_name: string;
    amount: number;
    created_at: string;
};
