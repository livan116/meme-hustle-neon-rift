
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemesGrid from '@/components/memes/MemesGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <section className="mb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green animate-text-flicker">
              MemeHustle
            </span>
            <span className="text-3xl text-neon-purple">_</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Trade, collect, and profit from the hottest memes in the neon-soaked cyberweb.
            <span className="text-neon-blue"> Upvote</span> what you love,
            <span className="text-neon-pink"> bid</span> on what you want,
            <span className="text-neon-green"> create</span> what you imagine.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link to="/create">
              <Button className="cyber-button text-sm" size="lg">
                Create Meme
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button className="cyber-button text-sm" size="lg">
                Enter Marketplace
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button className="cyber-button text-sm" size="lg">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Terminal-style text */}
        <div className="mb-10 max-w-3xl mx-auto overflow-hidden">
          <div className="bg-black border border-neon-green p-4 rounded font-mono text-sm">
            <p className="text-neon-green mb-2">
              <span className="text-neon-pink">root@cybermeme:~$</span> connect --memehustle --mode=dystopian
            </p>
            <p className="text-neon-green mb-2">
              <span className="animate-pulse">Connecting to MemeHustle mainframe...</span>
            </p>
            <p className="text-neon-blue">
              <span className="terminal-text animate-terminal-typing">Access granted. Welcome to the meme marketplace. Trade wisely.</span>
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <span className="text-neon-blue">Trending</span> Memes
          </h2>
          <MemesGrid />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
