
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemeStore } from '@/stores/memeStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Heart, Clock, Tag, DollarSign, User, X } from 'lucide-react';

const MemeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemeById, upvoteMeme, downvoteMeme, addBid, getTopBids, updateMemeOwner } = useMemeStore();
  const { user, updateCredits } = useUserStore();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setBidSubmitting] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const meme = getMemeById(id || '');
  const bids = id ? getTopBids(id) : [];

  useEffect(() => {
    if (!meme) {
      navigate('/');
    }
  }, [meme, navigate]);

  if (!meme) {
    return null;
  }

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

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "ACCESS DENIED",
        description: "Connect to the mainframe first",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(bidAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "INVALID BID",
        description: "Bid amount must be a positive number",
        variant: "destructive",
      });
      return;
    }

    if (amount <= meme.price) {
      toast({
        title: "BID TOO LOW",
        description: `Minimum bid is ${meme.price + 1} credits`,
        variant: "destructive",
      });
      return;
    }

    if (amount > (user?.credits || 0)) {
      toast({
        title: "INSUFFICIENT FUNDS",
        description: "Your account doesn't have enough credits",
        variant: "destructive",
      });
      return;
    }

    setBidSubmitting(true);

    try {
      // Add bid to store
      addBid({
        memeId: meme.id,
        userId: user.id,
        userName: user.name,
        amount
      });

      // Subtract credits from user
      updateCredits(-amount);

      // Transfer ownership if this is an instant buy (for the hackathon simplicity)
      if (amount >= meme.price * 2) {
        updateMemeOwner(meme.id, user.id, user.name, amount);

        toast({
          title: "OWNERSHIP TRANSFERRED",
          description: `You now own "${meme.title}" for ${amount} credits!`,
          className: "bg-neon-green/20 border-neon-green",
        });
      } else {
        toast({
          title: "BID PLACED",
          description: `Bid of ${amount} credits placed on "${meme.title}"`,
        });
      }

      setBidAmount('');
    } catch (error) {
      toast({
        title: "BID FAILED",
        description: "Transaction error with the mainframe",
        variant: "destructive",
      });
    } finally {
      setBidSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* Left column - Meme Image */}
      <div className={`md:col-span-3 ${isGlitching ? 'animate-glitch' : ''}`}>
        <div className="cyber-card overflow-hidden">
          <div className="relative group">
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-full object-cover rounded"
            />

            {/* Glitch overlay */}
            <div className="absolute inset-0 bg-glitch-pattern opacity-20"></div>

            {/* Tags */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1">
              {meme.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-black/70 backdrop-blur-sm text-neon-blue px-2 py-0.5 rounded-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-neon-blue">{meme.title}</h2>

            {meme.aiCaption && (
              <p className="text-sm italic text-foreground/80 mt-2">
                "{meme.aiCaption}"
              </p>
            )}

            {meme.vibeAnalysis && (
              <div className="mt-4 inline-block">
                <span className="text-xs font-bold tracking-wider uppercase bg-cyber-primary/20 text-neon-pink px-3 py-1 rounded-sm">
                  {meme.vibeAnalysis}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-neon-green mr-1" />
                <span className="text-sm">{meme.ownerName}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-neon-blue mr-1" />
                <span className="text-sm">{formatDate(meme.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleUpvote}
                className="text-foreground/70 hover:text-neon-green p-1 transition-colors"
                aria-label="Upvote"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="text-foreground/90 font-mono">
                {meme.upvotes - meme.downvotes}
              </span>
              <button
                onClick={handleDownvote}
                className="text-foreground/70 hover:text-neon-pink p-1 transition-colors"
                aria-label="Downvote"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Bidding and Info */}
      <div className="md:col-span-2">
        {/* Current price */}
        <div className="cyber-card mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-neon-purple text-lg">Current Price</h3>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-neon-purple mr-1" />
              <span className="text-xl font-mono">{meme.price}</span>
              <span className="text-sm ml-1 text-foreground/70">creds</span>
            </div>
          </div>

          {/* Bidding form */}
          <form onSubmit={handleBidSubmit} className="mt-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                min={meme.price + 1}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="terminal-input"
                placeholder={`Min bid: ${meme.price + 1}`}
                disabled={isSubmitting || !user}
              />
              <Button
                type="submit"
                className="cyber-button whitespace-nowrap"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  "PLACE BID"
                )}
              </Button>
            </div>

            <p className="text-xs text-foreground/50 mt-2">
              Bid higher than 2x the price for instant purchase
            </p>
          </form>
        </div>

        {/* Current bids */}
        <div className="cyber-card">
          <h3 className="text-neon-blue text-lg mb-3">Recent Bids</h3>

          {bids.length > 0 ? (
            <div className="space-y-3">
              {bids.map(bid => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-2 border border-cyber-primary/30 rounded bg-cyber-darker"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-neon-green mr-2" />
                    <span className="text-sm">{bid.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-neon-purple font-mono">{bid.amount}</span>
                    <span className="text-xs ml-1 text-foreground/70">creds</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border border-cyber-primary/20 rounded">
              <p className="text-foreground/50 text-sm">No bids yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemeDetail;
