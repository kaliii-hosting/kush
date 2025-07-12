import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SpotifyTopBar from './SpotifyTopBar';
import SpotifyPlayerBar from './SpotifyPlayerBar';
import CartSlideOut from './CartSlideOut';
import GlobalFooter from './GlobalFooter';

const SpotifyLayout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Top bar */}
      <SpotifyTopBar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="pb-24 min-h-screen">
          {children || <Outlet />}
          <GlobalFooter />
        </div>
      </main>
      
      {/* Player bar */}
      <SpotifyPlayerBar />
      
      {/* Cart Slide-out */}
      <CartSlideOut isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default SpotifyLayout;