
import React from 'react';
import Layout from '@/components/layout/Layout';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

const LeaderboardPage = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
          Meme Leaderboard
        </h1>
        <p className="text-center text-foreground/70 mb-8 max-w-2xl mx-auto">
          The most upvoted, most valuable memes in the cyberspace.
          These digital assets command the highest respect in the network.
        </p>
        
        <LeaderboardTable />
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
