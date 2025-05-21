
import React from 'react';
import MemeCard from './MemeCard';
import { useMemeStore } from '@/stores/memeStore';

interface MemesGridProps {
  filter?: string;
  showActions?: boolean;
}

const MemesGrid: React.FC<MemesGridProps> = ({ filter, showActions = true }) => {
  const { memes } = useMemeStore();
  
  const filteredMemes = filter 
    ? memes.filter(meme => meme.tags.includes(filter))
    : memes;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMemes.length > 0 ? (
        filteredMemes.map(meme => (
          <MemeCard key={meme.id} meme={meme} showActions={showActions} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-foreground/50 text-lg">No memes found in the cyberspace...</p>
        </div>
      )}
    </div>
  );
};

export default MemesGrid;
