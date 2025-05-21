
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useMemeStore, Meme } from '@/stores/memeStore';
import { Heart, Bookmark, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MemeCardProps {
  meme: Meme;
  showActions?: boolean;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, showActions = true }) => {
  const { user } = useUserStore();
  const { upvoteMeme, downvoteMeme } = useMemeStore();
  const [isGlitching, setIsGlitching] = useState(false);
  const { toast } = useToast();

  const handleUpvote = () => {
    if (!user) {
      toast({
        title: "ACCESS DENIED",
        description: "Connect to the mainframe first",
        variant: "destructive",
      });
      return;
    }
    
    upvoteMeme(meme.id);
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
    
    toast({
      title: "UPVOTED",
      description: `${meme.title} boosted in the cyberspace`,
    });
  };

  const handleDownvote = () => {
    if (!user) {
      toast({
        title: "ACCESS DENIED",
        description: "Connect to the mainframe first",
        variant: "destructive",
      });
      return;
    }
    
    downvoteMeme(meme.id);
    
    toast({
      title: "DOWNVOTED",
      description: `${meme.title} degraded in the cyberspace`,
      variant: "destructive",
    });
  };

  return (
    <div className={`cyber-card relative overflow-hidden ${isGlitching ? 'animate-glitch' : ''}`}>
      {/* Score indicator */}
      <div className="absolute top-2 right-2 bg-cyber-darker/80 backdrop-blur-sm px-2 py-1 rounded-sm z-10 flex items-center">
        <span className="text-neon-green font-mono text-sm mr-1">{meme.upvotes - meme.downvotes}</span>
        <Heart className="h-3 w-3 text-neon-pink" />
      </div>
      
      {/* Tags */}
      <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1">
        {meme.tags.map((tag, index) => (
          <span 
            key={index} 
            className="text-xs bg-black/50 backdrop-blur-sm text-neon-blue px-2 py-0.5 rounded-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      {/* Image with overlay */}
      <div className="relative group overflow-hidden rounded">
        <Link to={`/meme/${meme.id}`}>
          <img 
            src={meme.imageUrl} 
            alt={meme.title} 
            className="w-full h-48 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
          
          {/* Glitch overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker to-transparent opacity-70"></div>
          
          {/* Image scanlines */}
          <div className="absolute inset-0 bg-glitch-pattern opacity-20"></div>
        </Link>
      </div>
      
      {/* Meme info */}
      <div className="mt-2">
        <h3 className="text-lg font-bold truncate">
          <Link to={`/meme/${meme.id}`} className="text-neon-blue hover:text-neon-pink transition-colors">
            {meme.title}
          </Link>
        </h3>
        
        <div className="text-xs text-foreground/70 mt-1 flex items-center">
          <span className="text-neon-green mr-1">Owner:</span> 
          <span className="text-foreground/90">{meme.ownerName}</span>
        </div>
        
        {meme.aiCaption && (
          <div className="text-xs italic text-foreground/60 mt-1 truncate">
            "{meme.aiCaption}"
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-neon-purple">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-mono">{meme.price}</span>
            <span className="text-xs ml-1 text-foreground/70">creds</span>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleUpvote}
                className="text-foreground/70 hover:text-neon-green p-1 transition-colors"
                aria-label="Upvote"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <button 
                onClick={handleDownvote}
                className="text-foreground/70 hover:text-neon-pink p-1 transition-colors"
                aria-label="Downvote"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
              <Link to={`/meme/${meme.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  BID
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
