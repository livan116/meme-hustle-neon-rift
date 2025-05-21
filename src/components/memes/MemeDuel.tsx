
import React, { useState, useEffect } from 'react';
import { useMemeStore, Meme } from '@/stores/memeStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Heart, ArrowUp, X } from 'lucide-react';

const MemeDuel: React.FC = () => {
  const { memes, upvoteMeme } = useMemeStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const [leftMeme, setLeftMeme] = useState<Meme | null>(null);
  const [rightMeme, setRightMeme] = useState<Meme | null>(null);
  const [winner, setWinner] = useState<Meme | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [isDuelActive, setIsDuelActive] = useState(false);
  
  // Get random meme
  const getRandomMeme = (excludeMeme?: Meme): Meme => {
    const availableMemes = excludeMeme 
      ? memes.filter(m => m.id !== excludeMeme.id)
      : memes;
    
    const randomIndex = Math.floor(Math.random() * availableMemes.length);
    return availableMemes[randomIndex];
  };
  
  // Start a new duel
  const startDuel = () => {
    const meme1 = getRandomMeme();
    const meme2 = getRandomMeme(meme1);
    
    setLeftMeme(meme1);
    setRightMeme(meme2);
    setWinner(null);
    setCountdown(10);
    setIsDuelActive(true);
  };
  
  // Vote for a meme
  const voteMeme = (meme: Meme) => {
    if (!user) {
      toast({
        title: "ACCESS DENIED",
        description: "Connect to the mainframe first",
        variant: "destructive",
      });
      return;
    }
    
    upvoteMeme(meme.id);
    setWinner(meme);
    setIsDuelActive(false);
    
    toast({
      title: "DUEL VOTE CAST",
      description: `You chose ${meme.title} as the winner!`,
    });
  };
  
  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isDuelActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isDuelActive && countdown === 0) {
      setIsDuelActive(false);
      toast({
        title: "DUEL TIMEOUT",
        description: "No vote cast in time, duel ended",
        variant: "destructive",
      });
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isDuelActive, toast]);
  
  return (
    <div className="cyber-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-neon-pink">Meme Duel</h2>
        {!isDuelActive && !winner && (
          <Button 
            onClick={startDuel}
            className="cyber-button text-xs"
          >
            START DUEL
          </Button>
        )}
        {(isDuelActive || winner) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-neon-blue text-xs"
            onClick={() => {
              setIsDuelActive(false);
              setWinner(null);
            }}
          >
            <X className="h-3 w-3 mr-1" /> CANCEL
          </Button>
        )}
      </div>
      
      {isDuelActive && leftMeme && rightMeme ? (
        <>
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-cyber-primary/30 text-neon-green rounded-md">
              TIME REMAINING: <span className="font-mono">{countdown}s</span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Left Meme */}
            <div className="cyber-darker border border-neon-blue/50 rounded overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={leftMeme.imageUrl} 
                  alt={leftMeme.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-sm font-semibold text-white">
                  {leftMeme.title}
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 text-neon-pink mr-1" />
                  <span className="text-xs">{leftMeme.upvotes - leftMeme.downvotes}</span>
                </div>
                <Button
                  onClick={() => voteMeme(leftMeme)}
                  size="sm"
                  className="text-xs bg-neon-blue/20 hover:bg-neon-blue/40 text-neon-blue"
                >
                  <ArrowUp className="h-3 w-3 mr-1" /> VOTE
                </Button>
              </div>
            </div>
            
            {/* Right Meme */}
            <div className="cyber-darker border border-neon-pink/50 rounded overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={rightMeme.imageUrl} 
                  alt={rightMeme.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-sm font-semibold text-white">
                  {rightMeme.title}
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 text-neon-pink mr-1" />
                  <span className="text-xs">{rightMeme.upvotes - rightMeme.downvotes}</span>
                </div>
                <Button
                  onClick={() => voteMeme(rightMeme)}
                  size="sm"
                  className="text-xs bg-neon-pink/20 hover:bg-neon-pink/40 text-neon-pink"
                >
                  <ArrowUp className="h-3 w-3 mr-1" /> VOTE
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-xs text-foreground/50">
            Vote for the meme you think is better!
          </div>
        </>
      ) : winner ? (
        <div className="text-center py-6">
          <div className="mb-4">
            <span className="text-neon-green text-lg font-bold">DUEL WINNER</span>
          </div>
          
          <div className="max-w-xs mx-auto cyber-darker border border-neon-green/50 rounded overflow-hidden">
            <div className="relative h-40 overflow-hidden">
              <img 
                src={winner.imageUrl} 
                alt={winner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div className="p-3 text-center">
              <div className="text-neon-green font-semibold">{winner.title}</div>
              <div className="text-xs text-foreground/70 mt-1">
                by {winner.ownerName}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={startDuel}
            className="mt-4 text-xs bg-neon-green/20 hover:bg-neon-green/40 text-neon-green"
          >
            START NEW DUEL
          </Button>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-foreground/20 rounded">
          <p className="text-foreground/50 mb-3">No active duel</p>
          <p className="text-xs text-foreground/30 max-w-sm mx-auto">
            Start a meme duel to pit two random memes against each other in real-time combat
          </p>
        </div>
      )}
    </div>
  );
};

export default MemeDuel;
