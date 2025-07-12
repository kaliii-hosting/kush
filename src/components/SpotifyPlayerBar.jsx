import { Play, SkipBack, SkipForward, Repeat, Shuffle, Mic2, ListMusic, Laptop2, Volume2, Maximize2 } from 'lucide-react';

const SpotifyPlayerBar = () => {
  return (
    <div className="bg-gray-darkest border-t border-border px-4 py-3 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50">
      {/* Left section - Current track */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 bg-gray-dark rounded-md"></div>
        <div>
          <div className="text-white text-sm">No product selected</div>
          <div className="text-text-secondary text-xs">Browse our collection</div>
        </div>
      </div>

      {/* Center section - Player controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[722px]">
        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-white transition-colors">
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-text-secondary hover:text-white transition-colors">
            <SkipBack className="h-5 w-5" />
          </button>
          <button className="bg-primary rounded-full p-2 hover:bg-primary-hover hover:scale-105 transition-transform">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </button>
          <button className="text-text-secondary hover:text-white transition-colors">
            <SkipForward className="h-5 w-5" />
          </button>
          <button className="text-text-secondary hover:text-white transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-text-secondary text-xs">0:00</span>
          <div className="flex-1 bg-gray-light rounded-full h-1 relative group cursor-pointer">
            <div className="absolute left-0 top-0 h-full w-0 bg-white rounded-full group-hover:bg-primary transition-colors"></div>
          </div>
          <span className="text-text-secondary text-xs">0:00</span>
        </div>
      </div>

      {/* Right section - Volume and other controls */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <button className="text-spotify-text-subdued hover:text-white transition-colors">
          <Mic2 className="h-4 w-4" />
        </button>
        <button className="text-spotify-text-subdued hover:text-white transition-colors">
          <ListMusic className="h-4 w-4" />
        </button>
        <button className="text-spotify-text-subdued hover:text-white transition-colors">
          <Laptop2 className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <button className="text-text-secondary hover:text-white transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
          <div className="w-24 bg-gray-light rounded-full h-1 relative group cursor-pointer">
            <div className="absolute left-0 top-0 h-full w-3/4 bg-white rounded-full group-hover:bg-primary transition-colors"></div>
          </div>
        </div>
        <button className="text-spotify-text-subdued hover:text-white transition-colors">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayerBar;