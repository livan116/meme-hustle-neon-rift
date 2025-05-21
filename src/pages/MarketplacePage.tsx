
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MemesGrid from '@/components/memes/MemesGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  const popularTags = ['doge', 'cyberpunk', 'neon', 'crypto', 'glitch', 'matrix', 'cat'];
  
  const handleTagClick = (tag: string) => {
    setActiveFilter(activeFilter === tag ? '' : tag);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue">
          Meme Marketplace
        </h1>
        <p className="text-center text-foreground/70 mb-8 max-w-2xl mx-auto">
          Browse, bid, and collect the rarest digital assets in the cyberspace.
          The higher the upvotes, the more valuable the meme becomes.
        </p>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search memes..."
                className="terminal-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  activeFilter === tag 
                    ? 'bg-cyber-primary text-foreground' 
                    : 'bg-transparent hover:bg-cyber-primary/20'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Memes grid */}
        <MemesGrid filter={activeFilter} />
      </div>
    </Layout>
  );
};

export default MarketplacePage;
