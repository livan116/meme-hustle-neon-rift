
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useUserStore } from '@/stores/userStore';
import { useMemeStore } from '@/stores/memeStore';
import { Button } from '@/components/ui/button';
import { User, Star, Clock, DollarSign, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, logout, updateCredits } = useUserStore();
  const { memes } = useMemeStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user) {
    navigate('/');
    return null;
  }
  
  // Find memes owned by user
  const userMemes = memes.filter(meme => meme.ownerId === user.id);
  
  // Get total value of user's memes
  const totalMemeValue = userMemes.reduce((total, meme) => total + meme.price, 0);
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "DISCONNECTED",
      description: "Mainframe connection terminated",
    });
    navigate('/');
  };
  
  const handleClaimBonus = () => {
    updateCredits(500);
    toast({
      title: "BONUS CLAIMED",
      description: "+500 credits added to your account",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
          User Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="md:col-span-1">
            <div className="cyber-card">
              <div className="text-center mb-4">
                <div className="inline-block w-24 h-24 rounded-full border-2 border-neon-blue overflow-hidden mb-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-cyber-primary/30 flex items-center justify-center">
                      <User className="h-12 w-12 text-neon-blue" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-neon-blue">{user.name}</h2>
                
                <div className="text-xs text-foreground/50 flex items-center justify-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-cyber-primary/10 rounded p-3 flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Credits</span>
                  <span className="font-mono text-neon-purple">{user.credits}</span>
                </div>
                
                <div className="bg-cyber-primary/10 rounded p-3 flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Owned Memes</span>
                  <span className="font-mono text-neon-blue">{userMemes.length}</span>
                </div>
                
                <div className="bg-cyber-primary/10 rounded p-3 flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Portfolio Value</span>
                  <span className="font-mono text-neon-green">{totalMemeValue}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  className="cyber-button w-full text-sm"
                  onClick={handleClaimBonus}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  CLAIM DAILY BONUS
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full text-sm text-neon-pink"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  DISCONNECT FROM MAINFRAME
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Owned Memes */}
          <div className="md:col-span-2">
            <div className="cyber-card">
              <h3 className="text-xl font-bold text-neon-green mb-4">Owned Memes</h3>
              
              {userMemes.length > 0 ? (
                <div className="space-y-4">
                  {userMemes.map(meme => (
                    <div 
                      key={meme.id}
                      className="border border-cyber-primary/30 rounded bg-cyber-darker p-3 flex items-center"
                    >
                      <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded">
                        <img 
                          src={meme.imageUrl} 
                          alt={meme.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-bold text-neon-blue">{meme.title}</h4>
                        <div className="flex items-center text-xs text-foreground/70 mt-1">
                          <Star className="h-3 w-3 text-neon-pink mr-1" />
                          <span>{meme.upvotes - meme.downvotes} points</span>
                          <span className="mx-2">•</span>
                          <DollarSign className="h-3 w-3 text-neon-purple mr-1" />
                          <span>{meme.price} credits</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs ml-2"
                        onClick={() => navigate(`/meme/${meme.id}`)}
                      >
                        VIEW
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-foreground/20 rounded">
                  <p className="text-foreground/50 mb-3">No memes owned yet</p>
                  <p className="text-xs text-foreground/30 max-w-sm mx-auto mb-4">
                    Head to the marketplace to bid on memes or create your own memes to start building your collection
                  </p>
                  <Button 
                    className="cyber-button text-sm"
                    onClick={() => navigate('/marketplace')}
                  >
                    BROWSE MARKETPLACE
                  </Button>
                </div>
              )}
            </div>
            
            {/* Stats Section */}
            <div className="cyber-card mt-6">
              <h3 className="text-xl font-bold text-neon-pink mb-4">Activity Log</h3>
              
              <div className="border border-neon-green/20 p-3 rounded font-mono text-xs">
                <div className="text-neon-green mb-1">
                  &gt; system.stats.init(user="{user.name}")
                </div>
                <div className="text-neon-blue mb-1">
                  &gt; loading user data...complete
                </div>
                <div className="text-neon-purple mb-1">
                  &gt; credits.verify(amount={user.credits})...verified
                </div>
                <div className="text-neon-green mb-1">
                  &gt; memes.owned({userMemes.length})...indexed
                </div>
                <div className="text-neon-pink mb-1">
                  &gt; value.total({totalMemeValue})...calculated
                </div>
                <div className="text-neon-blue mb-1">
                  &gt; status: ACTIVE | permissions: FULL_ACCESS
                </div>
                <div className="text-neon-green animate-terminal-typing">
                  &gt; ready for transactions...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
