import { useEffect, useRef, useState } from 'react';
import { MapPin, Store, Truck, Play, Building2, Package, Users, ChevronRight, Eye, ShoppingCart } from 'lucide-react';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import { usePageContent } from '../context/PageContentContext';
import ProductModal from '../components/ProductModal';
import DynamicSection from '../components/DynamicSection';
import './WholesaleStyles.css';

// States where we operate
const operatingStates = [
  { code: 'CA', name: 'California', link: '/wholesale/california' },
  { code: 'NM', name: 'New Mexico', link: '/wholesale/new-mexico' },
  { code: 'NY', name: 'New York', link: '/wholesale/new-york' },
  { code: 'NV', name: 'Nevada', link: '/wholesale/nevada' },
  { code: 'NJ', name: 'New Jersey', link: '/wholesale/new-jersey' },
  { code: 'FL', name: 'Florida', link: '/wholesale/florida' }
];

const WholesaleDynamic = ({ onCartClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const stateLayersRef = useRef([]);
  
  // Products state
  const { firebaseProducts, loading } = useEnhancedProducts();
  const { addToCart } = useWholesaleCart();
  const { pageContent } = usePageContent();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get wholesale sections
  const sections = pageContent?.wholesale?.sections || [];

  // Initialize map
  useEffect(() => {
    let map;
    const loadLeafletAssets = async () => {
      // Load Leaflet CSS if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
      }

      // Load Leaflet JS if not already loaded
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
    };

    const initializeMap = async () => {
      try {
        await loadLeafletAssets();

        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize the map to show all operating states
        map = window.L.map(mapRef.current, {
          center: [35.5, -96], // Adjusted center to better show all operating states
          zoom: 4.2, // Zoom level to show all operating states
          zoomControl: true, // Enable zoom buttons
          attributionControl: false,
          scrollWheelZoom: false, // Disable scroll zoom
          maxBounds: [[15, -140], [60, -55]], // Wider bounds for full width view
          minZoom: 3,
          maxZoom: 7,
          // Disable touch zoom for mobile
          touchZoom: false,
          dragging: true
        });

        mapInstanceRef.current = map;

        // Override Leaflet's default pane z-indexes
        setTimeout(() => {
          if (map) {
            const panes = ['tilePane', 'overlayPane', 'shadowPane', 'markerPane', 'tooltipPane', 'popupPane'];
            panes.forEach(paneName => {
              try {
                const pane = map.getPane(paneName);
                if (pane) {
                  pane.style.zIndex = '1';
                }
              } catch (e) {
                console.log(`Pane ${paneName} not found`);
              }
            });
            
            const container = map.getContainer();
            if (container) {
              container.style.zIndex = '1';
              container.style.position = 'relative';
            }
          }
        }, 100);

        // Add dark tile layer
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);

        // Load US states GeoJSON and highlight operating states
        fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
          .then(response => response.json())
          .then(data => {
            // Add GeoJSON layer with custom styling
            const geoJsonLayer = window.L.geoJSON(data, {
              style: (feature) => {
                const isOperatingState = operatingStates.some(
                  state => state.name === feature.properties.name
                );
                
                return {
                  fillColor: isOperatingState ? '#CB6015' : 'transparent',
                  weight: isOperatingState ? 3 : 1,
                  opacity: 1,
                  color: isOperatingState ? '#CB6015' : '#404040',
                  fillOpacity: isOperatingState ? 0.3 : 0,
                  className: isOperatingState ? 'animated-state-border' : '',
                  // Make non-operating states non-interactive
                  interactive: isOperatingState
                };
              },
              onEachFeature: (feature, layer) => {
                const operatingState = operatingStates.find(
                  state => state.name === feature.properties.name
                );
                
                if (operatingState) {
                  // Set cursor style for clickable states
                  layer.options.className = 'animated-state-border cursor-pointer';
                  
                  // Add hover effects
                  layer.on({
                    mouseover: (e) => {
                      const layer = e.target;
                      layer.setStyle({
                        fillOpacity: 0.5,
                        weight: 4
                      });
                      layer.bringToFront();
                    },
                    mouseout: (e) => {
                      geoJsonLayer.resetStyle(e.target);
                    },
                    click: () => {
                      // Navigate to state-specific page
                      window.location.href = operatingState.link;
                    }
                  });

                  // Add tooltip
                  layer.bindTooltip(operatingState.name, {
                    permanent: false,
                    direction: 'center',
                    className: 'state-tooltip'
                  });
                } else {
                  // Non-operating states - disable interaction
                  layer.options.interactive = false;
                  layer.options.className = 'non-interactive-state';
                }
              }
            });

            geoJsonLayer.addTo(map);
            stateLayersRef.current.push(geoJsonLayer);
            
            // Fit map bounds to show all operating states
            const operatingStateBounds = [];
            geoJsonLayer.eachLayer((layer) => {
              if (operatingStates.some(state => state.name === layer.feature.properties.name)) {
                operatingStateBounds.push(layer.getBounds());
              }
            });
            
            if (operatingStateBounds.length > 0) {
              const bounds = operatingStateBounds.reduce((acc, curr) => acc.extend(curr));
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          })
          .catch(error => {
            console.error('Error loading states GeoJSON:', error);
          });

        setMapReady(true);

        // Handle resize
        const handleResize = () => {
          map.invalidateSize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.error('Error removing map:', e);
        }
      }
    };
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Critical z-index override for Leaflet */}
      <style>{`
        /* Override Leaflet's default z-index values (200-700) */
        .leaflet-pane { z-index: 1 !important; }
        .leaflet-tile-pane { z-index: 1 !important; }
        .leaflet-overlay-pane { z-index: 2 !important; }
        .leaflet-shadow-pane { z-index: 3 !important; }
        .leaflet-marker-pane { z-index: 4 !important; }
        .leaflet-tooltip-pane { z-index: 5 !important; }
        .leaflet-popup-pane { z-index: 6 !important; }
        .leaflet-control { z-index: 7 !important; }
        
        /* Override any inline z-index styles */
        [style*="z-index: 200"],
        [style*="z-index: 400"],
        [style*="z-index: 500"],
        [style*="z-index: 600"],
        [style*="z-index: 650"],
        [style*="z-index: 700"] {
          z-index: 1 !important;
        }
        
        /* Force map section to create new stacking context */
        .wholesale-map-section {
          position: relative !important;
          z-index: 1 !important;
          isolation: isolate !important;
        }
        
        /* Ensure map container stays contained */
        .wholesale-map-container {
          position: relative !important;
          z-index: 1 !important;
          isolation: isolate !important;
          contain: strict !important;
        }
      `}</style>
      
      {/* Stats Section */}
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 px-6 lg:px-8">
        {[
          { label: 'Active Partners', value: '500+' },
          { label: 'States Served', value: '6' },
          { label: 'Products Available', value: '1,000+' },
          { label: 'Years Experience', value: '10+' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dt className="text-base leading-7 text-gray-400">{stat.label}</dt>
            <dd className="text-3xl font-bold leading-9 tracking-tight text-white">{stat.value}</dd>
          </div>
        ))}
      </div>

      {/* Map Section */}
      <div style={{ position: 'relative', zIndex: 1, isolation: 'isolate' }}>
        <section className="wholesale-map-section relative bg-black py-16">
          <div className="mx-auto max-w-2xl text-center mb-12 px-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Available Nationwide</h2>
            <p className="mt-4 text-lg leading-8 text-gray-400">
              We operate in 6 states with plans to expand. Click on a state to view local opportunities.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Use zoom buttons • Drag to pan • Click highlighted states for details
            </p>
          </div>
          <div className="relative overflow-hidden shadow-2xl rounded-2xl">
            <div 
              className="wholesale-map-container"
              ref={mapRef} 
              style={{ 
                height: '600px', 
                width: '100%', 
                background: '#121212', 
                borderRadius: '1rem',
                position: 'relative',
                zIndex: 1,
                isolation: 'isolate',
                contain: 'strict'
              }}
            ></div>
          </div>
        </section>
      </div>

      {/* Render other dynamic sections */}
      {sections.filter(s => s.type !== 'hero').map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      {/* Local Inventory Section */}
      <section className="py-20 bg-black border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Local Inventory
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-400">
              Browse our complete local inventory available for wholesale orders
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-dark text-gray-400 hover:text-white'
              }`}
            >
              All Products
            </button>
            {[...new Set(firebaseProducts.map(p => p.category).filter(Boolean))].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-dark text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {firebaseProducts
                .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
                .map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-card rounded-lg p-4 transition-all duration-300 hover:bg-card-hover"
                >
                  {/* Product Image */}
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-gray-dark">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setShowProductModal(true);
                        }}
                        className="p-3 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
                        title="Quick View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="p-3 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-primary font-bold">${product.price}</p>
                    {product.category && (
                      <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }}
        onCartClick={onCartClick}
        isWholesale={true}
      />
    </div>
  );
};

export default WholesaleDynamic;