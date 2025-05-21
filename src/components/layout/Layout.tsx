
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUserStore } from '@/stores/userStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useUserStore();
  const [binaryText, setBinaryText] = useState('');
  const [showHackerHUD, setShowHackerHUD] = useState(false);
  
  // Generate random binary
  useEffect(() => {
    const generateBinary = () => {
      let binary = '';
      for (let i = 0; i < 200; i++) {
        binary += Math.random() > 0.5 ? '1' : '0';
      }
      return binary;
    };
    
    let interval: NodeJS.Timeout;
    
    if (showHackerHUD) {
      setBinaryText(generateBinary());
      interval = setInterval(() => {
        setBinaryText(generateBinary());
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showHackerHUD]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Hacker HUD toggle button */}
      <button 
        onClick={() => setShowHackerHUD(!showHackerHUD)} 
        className="fixed top-20 right-4 z-50 bg-cyber-darker border border-neon-green px-2 py-1 rounded text-xs text-neon-green"
      >
        {showHackerHUD ? 'HIDE HUD' : 'SHOW HUD'}
      </button>
      
      {/* Binary code scrolling (HUD element) */}
      {showHackerHUD && (
        <div className="fixed right-0 top-0 bottom-0 w-16 md:w-24 bg-black/50 backdrop-blur-sm overflow-hidden z-40 flex flex-col justify-between">
          <div className="text-neon-green text-[6px] opacity-70 font-mono overflow-hidden animate-text-flicker p-2">
            {binaryText}
          </div>
          
          {user && (
            <div className="p-2 border-t border-neon-green/30">
              <div className="text-[6px] text-neon-blue mb-1">USER_CREDS</div>
              <div className="text-neon-green text-xs font-mono">{user.credits}</div>
              
              <div className="text-[6px] text-neon-pink mt-2 mb-1">STATUS</div>
              <div className="text-neon-green text-[8px] font-mono">CONNECTED</div>
              
              <div className="w-full h-[2px] bg-neon-green/20 mt-2 mb-2">
                <div className="h-full bg-neon-green animate-pulse" style={{ width: '67%' }}></div>
              </div>
              
              <div className="text-[6px] text-neon-green">SYSTEM::OK</div>
            </div>
          )}
        </div>
      )}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
