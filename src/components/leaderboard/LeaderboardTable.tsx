
import React from 'react';
import { Link } from 'react-router-dom';
import { useMemeStore } from '@/stores/memeStore';
import { Heart, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';

const LeaderboardTable: React.FC = () => {
  const { getLeaderboard } = useMemeStore();
  const memes = getLeaderboard();

  return (
    <div className="cyber-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-cyber-primary/30">
              <th className="py-3 px-4 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                Rank
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                Meme
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-neon-green uppercase tracking-wider">
                Score
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-neon-pink uppercase tracking-wider">
                <ArrowUp className="h-3 w-3 inline mr-1" />
                Upvotes
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-neon-pink uppercase tracking-wider">
                <ArrowDown className="h-3 w-3 inline mr-1" />
                Downvotes
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-neon-purple uppercase tracking-wider">
                <DollarSign className="h-3 w-3 inline mr-1" />
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-primary/20">
            {memes.map((meme, index) => (
              <tr 
                key={meme.id} 
                className="hover:bg-cyber-primary/10 transition-colors group"
              >
                <td className="py-3 px-4 text-sm">
                  <span className={`font-mono ${index < 3 ? 'text-neon-green' : 'text-foreground/70'}`}>
                    {index === 0 && '🏆 '}
                    {index === 1 && '🥈 '}
                    {index === 2 && '🥉 '}
                    {(index > 2) && `#${index + 1}`}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link to={`/meme/${meme.id}`} className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3 overflow-hidden rounded">
                      <img 
                        src={meme.imageUrl} 
                        alt={meme.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium group-hover:text-neon-blue transition-colors">
                        {meme.title}
                      </div>
                      <div className="text-xs text-foreground/50">
                        by {meme.ownerName}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyber-primary/20 text-neon-green">
                    {meme.upvotes - meme.downvotes}
                    <Heart className="h-3 w-3 ml-1" />
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground/70">
                  {meme.upvotes}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground/70">
                  {meme.downvotes}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono text-neon-purple">
                    {meme.price}
                  </span>
                  <span className="text-xs text-foreground/50 ml-1">creds</span>
                </td>
              </tr>
            ))}
            
            {memes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground/50">
                  No memes found in the database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
