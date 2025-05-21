
import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { X, User, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useUserStore();
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "USERNAME REQUIRED",
        description: "Enter a valid user identifier",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      try {
        login(username);
        
        toast({
          title: "ACCESS GRANTED",
          description: "Connection to mainframe established",
        });
        
        onClose();
      } catch (error) {
        toast({
          title: "LOGIN ERROR",
          description: "Connection failed. Try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  // Generate random fake binary for cyberpunk effect
  const generateRandomBinary = (length: number): string => {
    return Array.from({ length }, () => Math.round(Math.random())).join('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-cyber-darker border-2 border-neon-blue w-full max-w-md rounded-md overflow-hidden animate-scale-in">
        {/* Glitch lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-neon-pink"></div>
          <div className="absolute top-0 left-0 w-2 h-full bg-neon-blue"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-neon-green"></div>
          <div className="absolute bottom-0 right-0 w-1 h-full bg-neon-purple"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neon-blue/30">
          <h2 className="text-neon-blue font-mono text-lg">SYSTEM ACCESS</h2>
          <button 
            className="text-foreground/70 hover:text-neon-pink transition-colors" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Binary code effect for cyberpunk feel */}
          <div className="mb-4 text-[8px] font-mono text-neon-green/40 overflow-hidden h-8">
            {generateRandomBinary(200)}
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-neon-green text-sm mb-1">
                ENTER IDENTIFIER
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  className="terminal-input pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-foreground/50 text-xs mt-1">
                Use existing handle or create new identity
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="cyber-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  CONNECTING...
                </span>
              ) : (
                "ESTABLISH CONNECTION"
              )}
            </Button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-neon-blue/20 text-xs text-foreground/50 text-center">
            <p>Existing identities: CyberNinja, NeonHacker, GlitchQueen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
