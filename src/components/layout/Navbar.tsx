
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from '@/stores/userStore';

const Navbar = () => {
  const { toast } = useToast();
  const { user, login, logout } = useUserStore();

  const handleAuth = () => {
    if (user) {
      logout();
      toast({
        title: "LOGGED OUT",
        description: "User disconnected from the mainframe",
        variant: "destructive"
      });
    } else {
      login({ id: 'user-' + Math.floor(Math.random() * 1000), name: 'CyberHacker_' + Math.floor(Math.random() * 100), credits: 1000 });
      toast({
        title: "ACCESS GRANTED",
        description: "Terminal connection established",
      });
    }
  };

  return (
    <nav className="border-b border-cyber-primary bg-cyber-darker/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink animate-text-flicker">
              <span className="text-neon-green">{'{/'}</span>MEME<span className="text-neon-pink">HUSTLE</span><span className="text-neon-green">{'}'}</span>
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-neon-pink transition-colors">
            Home
          </Link>
          <Link to="/marketplace" className="text-foreground hover:text-neon-blue transition-colors">
            Marketplace
          </Link>
          <Link to="/create" className="text-foreground hover:text-neon-green transition-colors">
            Create
          </Link>
          <Link to="/leaderboard" className="text-foreground hover:text-neon-yellow transition-colors">
            Leaderboard
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden md:flex items-center mr-4">
              <span className="text-neon-green mr-1">[</span>
              <span className="text-neon-blue">{user.credits}</span>
              <span className="text-neon-green ml-1">creds]</span>
            </div>
          )}
          
          <Button 
            onClick={handleAuth}
            className="cyber-button"
          >
            {user ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu - Simplified for the hackathon */}
      <div className="md:hidden border-t border-cyber-primary mt-2">
        <div className="flex justify-between px-4 py-2 text-sm">
          <Link to="/" className="text-foreground hover:text-neon-pink">
            Home
          </Link>
          <Link to="/marketplace" className="text-foreground hover:text-neon-blue">
            Marketplace
          </Link>
          <Link to="/create" className="text-foreground hover:text-neon-green">
            Create
          </Link>
          <Link to="/leaderboard" className="text-foreground hover:text-neon-yellow">
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
