
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-cyber-darker py-6 border-t border-cyber-primary mt-auto relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-foreground/70 text-sm">
              <span className="text-neon-green">{'>'}</span> MemeHustle v0.1.0 <span className="text-neon-pink">:: Neon Rift Edition</span>
            </p>
            <p className="text-xs text-foreground/50 mt-1">
              Hack together with 💾 in the neon-soaked underbelly of the web
            </p>
          </div>
          
          <div>
            <div className="flex space-x-4 text-sm text-foreground/70">
              <span className="hover:text-neon-blue cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-neon-pink cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-neon-green cursor-pointer transition-colors">Support</span>
              <span className="hover:text-neon-yellow cursor-pointer transition-colors">About</span>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-foreground/30 mt-6">
          <p>Running on mainframe node: C8-FR-NR // Last sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      
      {/* Decorative scanline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent absolute top-0 left-0 opacity-30"></div>
    </footer>
  );
};

export default Footer;
