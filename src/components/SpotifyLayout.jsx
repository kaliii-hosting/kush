import { useState, cloneElement } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SpotifyTopBar from './SpotifyTopBar';
import SpotifyPlayerBar from './SpotifyPlayerBar';
import CartSlideOut from './CartSlideOut';
import GlobalFooter from './GlobalFooter';

const SpotifyLayout = ({ children }) => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  
  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden max-w-full relative">
      {/* Top bar */}
      <SpotifyTopBar onCartClick={handleCartOpen} />
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
        <div className="pb-24 min-h-screen max-w-full overflow-x-hidden">
          {children ? 
            cloneElement(children, { onCartClick: handleCartOpen }) :
            <Outlet context={{ onCartClick: handleCartOpen }} />
          }
          {location.pathname !== '/accessibility' && <GlobalFooter />}
        </div>
      </main>
      
      {/* Player bar */}
      <SpotifyPlayerBar />
      
      {/* Cart Slide-out */}
      <CartSlideOut isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
};

export default SpotifyLayout;