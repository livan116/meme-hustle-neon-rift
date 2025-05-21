
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MemeDetail from '@/components/memes/MemeDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MemeDetailPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/marketplace">
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-neon-blue hover:text-neon-pink">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Button>
        </Link>
      </div>
      
      <MemeDetail />
      
      <div className="mt-12 border-t border-cyber-primary/30 pt-6">
        <h2 className="text-xl font-bold text-neon-green mb-4">System Analysis</h2>
        <div className="bg-black border border-neon-green p-4 rounded font-mono text-sm">
          <p className="text-neon-green mb-2">
            <span className="text-neon-pink">root@cybermeme:~$</span> analyze --meme-value --mode=cyberpunk
          </p>
          <p className="text-neon-blue">
            <span className="animate-terminal-typing">Analyzing transaction potential... Memetic resonance confirmed at 89%... Investment recommended.</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MemeDetailPage;
