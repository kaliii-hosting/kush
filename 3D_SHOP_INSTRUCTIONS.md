# 3D Weed Shop Instructions

## Current Status
Your website now has a cannabis shop integrated! The site is currently running without the 3D dependencies due to npm permission issues.

## What's Working Now
- ✅ Cannabis shop page with product grid
- ✅ Product categories (Flowers, Edibles, Concentrates)
- ✅ Green cannabis-themed styling
- ✅ "3D Shop" navigation link in navbar
- ✅ Banner on homepage promoting the shop
- ✅ Responsive design

## To Enable Full 3D Experience

### Step 1: Fix NPM Permissions
Run these commands in your terminal (Windows/Admin or WSL with proper permissions):

```bash
# Option 1: Try with different npm directory
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Option 2: Or reinstall npm with proper permissions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
```

### Step 2: Install 3D Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 3: Update App.jsx
Once dependencies are installed, uncomment the React Router code in App.jsx to enable the full 3D experience.

## File Structure Created

```
src/
├── components/
│   ├── 3d/
│   │   ├── WeedShop3D.jsx         # Main 3D shop component
│   │   ├── Scene.jsx              # 3D scene setup
│   │   ├── LoadingScreen.jsx      # Loading screen
│   │   ├── UI.jsx                 # UI overlay
│   │   ├── Shop/
│   │   │   ├── ShopEnvironment.jsx # 3D shop interior
│   │   │   ├── Lighting.jsx        # Scene lighting
│   │   │   └── VideoWalls.jsx      # Video displays
│   │   ├── Products/
│   │   │   ├── Products.jsx        # Product placement
│   │   │   ├── ProductDisplay.jsx  # Individual products
│   │   │   └── productsData.js     # Product database
│   │   └── UI/
│   │       ├── Cart.jsx            # Shopping cart
│   │       ├── ProductDetail.jsx   # Product details modal
│   │       └── Controls.jsx        # Control helpers
│   └── Shop3DMessage.jsx          # Current 2D fallback
├── store/
│   └── useStore.js                 # Zustand state management
└── hooks/
    └── useGSAPAnimations.js        # Animation hooks
```

## Features Implemented

### 3D Environment (Ready when dependencies installed)
- Modern dispensary interior with glass cases
- First-person and orbit camera controls
- WASD movement in first-person mode
- Interactive product displays with hover effects
- Video walls for educational content
- Ambient lighting with cannabis theme

### E-commerce
- Shopping cart functionality
- Product detail views
- Category filtering
- Add to cart functionality

### Products Database
- 24 cannabis products
- 3 categories: Flowers, Edibles, Concentrates
- THC levels, prices, descriptions, effects

## Customization

### To Add More Products
Edit `src/components/3d/Products/productsData.js`

### To Change Shop Layout
Edit `src/components/3d/Shop/ShopEnvironment.jsx`

### To Modify Lighting
Edit `src/components/3d/Shop/Lighting.jsx`

### To Update Product Appearance
Edit `src/components/3d/Products/ProductDisplay.jsx`

## Development Commands

```bash
# Install dependencies (with admin/proper permissions)
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

If you continue to have npm permission issues:
1. Try running VSCode/terminal as Administrator
2. Or use a different terminal with proper permissions
3. Or manually install dependencies one by one
4. Or use yarn instead of npm: `yarn add react-router-dom three @react-three/fiber @react-three/drei gsap zustand`

The 2D version is fully functional and provides a good preview of what the 3D experience will offer!