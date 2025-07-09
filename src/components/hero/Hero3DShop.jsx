import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useRef, useMemo, useEffect } from 'react'
import { useProducts } from '../../context/ProductsContext'
import CategoryTabs from './CategoryTabs'
import FloatingProductInfo from './FloatingProductInfo'
import * as THREE from 'three'
import { Text, Box, RoundedBox, Html, MeshReflectorMaterial, PerspectiveCamera, useTexture, Shadow, useVideoTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette, SSAO } from '@react-three/postprocessing'

// Apple Store style shop scene with dark theme
const ShopScene = ({ products, onProductSelect, scrollOffset }) => {
  return (
    <>
      {/* Base ambient light - brighter for visibility */}
      <ambientLight intensity={0.3} />
      
      {/* Slightly lighter background */}
      <color attach="background" args={['#1a1a1a']} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#1a1a1a', 8, 25]} />
      
      {/* Additional lighting for visibility */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 8, 5]} intensity={0.3} />
      
      {/* Apple Store Ceiling Lights Grid */}
      <CeilingLights />
      
      {/* Walls and Room Structure */}
      <RoomStructure />
      
      {/* OLED TVs on walls */}
      <OLEDTVScreen 
        position={[-9.85, 3, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        videoUrl="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01//background%20video%201.mp4"
      />
      <OLEDTVScreen 
        position={[9.85, 3, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        videoUrl="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01//background%20video%202.mp4"
      />
      
      {/* Realistic Floor */}
      <RealisticFloor />
      
      {/* Premium Display Counter - moved to back */}
      <group position={[0, 0, -3]}>
        {/* Glass Counter Top - Increased width */}
        <RoundedBox 
          args={[12, 0.08, 2.5]} 
          radius={0.02} 
          position={[0, 0.95, 0]} 
          receiveShadow
          castShadow
        >
          <meshPhysicalMaterial 
            color="#2a2a2a"
            transmission={0.5}
            thickness={0.5}
            roughness={0.1}
            metalness={0}
            envMapIntensity={1}
          />
        </RoundedBox>
        
        {/* Counter Edge Trim - Increased width */}
        <RoundedBox 
          args={[12.1, 0.02, 2.6]} 
          radius={0.02} 
          position={[0, 0.94, 0]} 
        >
          <meshStandardMaterial 
            color="#0a0a0a"
            roughness={0.2}
            metalness={0.8}
          />
        </RoundedBox>
        
        {/* Counter Base - Modern Design - Increased width */}
        <Box args={[11.8, 0.85, 2.2]} position={[0, 0.425, 0]} castShadow>
          <meshStandardMaterial 
            color="#252525"
            roughness={0.7}
            metalness={0}
          />
        </Box>
        
        {/* Counter Base Detail - Increased width */}
        <Box args={[11.9, 0.02, 2.3]} position={[0, 0.86, 0]}>
          <meshStandardMaterial 
            color="#0a0a0a"
            roughness={0.9}
            metalness={0}
          />
        </Box>
        
        {/* Products Display Area - Horizontal scroll */}
        <ProductScrollContainer 
          products={products} 
          onProductSelect={onProductSelect}
          scrollOffset={scrollOffset}
        />
      </group>
    </>
  )
}

// Scrollable product container
const ProductScrollContainer = ({ products, onProductSelect, scrollOffset }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = scrollOffset
    }
  })
  
  // Calculate centered positions for products
  const totalWidth = (products.length - 1) * 2.5
  const startX = -totalWidth / 2
  
  return (
    <group ref={groupRef} position={[0, 1.0, 0]}>
      {products.map((product, index) => (
        <ProductDisplay
          key={product.id}
          product={product}
          position={[startX + index * 2.5, 0, 0]} // Centered spacing
          onClick={() => onProductSelect(product)}
        />
      ))}
    </group>
  )
}

// Apple Store Ceiling Lights Component
const CeilingLights = () => {
  const lightRows = 3
  const lightsPerRow = 4
  const spacing = 3
  const lightSize = [1.8, 0.1, 0.8]
  const ceilingHeight = 5.5
  
  const lights = []
  for (let row = 0; row < lightRows; row++) {
    for (let col = 0; col < lightsPerRow; col++) {
      const x = (col - (lightsPerRow - 1) / 2) * spacing
      const z = (row - (lightRows - 1) / 2) * spacing
      lights.push({ x, z, key: `${row}-${col}` })
    }
  }
  
  return (
    <>
      {lights.map(({ x, z, key }) => (
        <group key={key} position={[x, ceilingHeight, z]}>
          {/* Recessed housing */}
          <Box args={[lightSize[0] + 0.1, 0.15, lightSize[2] + 0.1]} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </Box>
          {/* Light panel */}
          <Box args={lightSize} position={[0, -0.01, 0]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </Box>
          {/* Actual light source */}
          <pointLight
            intensity={1.5}
            color="#ffffff"
            position={[0, -0.5, 0]}
            distance={10}
            decay={2}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-camera-near={0.5}
            shadow-camera-far={10}
          />
        </group>
      ))}
    </>
  )
}

// Marble Floor Component with Gold Striations
const RealisticFloor = () => {
  // Create marble material with gold veins
  const marbleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e8e8e8',
      roughness: 0.1,
      metalness: 0.2,
      envMapIntensity: 1
    })
  }, [])
  
  return (
    <>
      {/* Main floor with reflections - enhanced marble look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20, 32, 32]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={50}
          roughness={0.05}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#faf8f6"
          metalness={0.1}
          mirror={0.7}
        />
      </mesh>
      
      {/* Marble pattern overlay with subtle veins */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[20, 20, 64, 64]} />
        <meshStandardMaterial 
          color="#c8c2bc"
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Marble veins for realistic effect */}
      {[...Array(12)].map((_, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, (i * Math.PI / 6) + Math.random() * 0.3]} 
          position={[Math.random() * 20 - 10, 0.002, Math.random() * 20 - 10]}
        >
          <planeGeometry args={[0.02 + Math.random() * 0.03, 20]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#d4c4b0" : "#a09080"}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0.15 + Math.random() * 0.1}
          />
        </mesh>
      ))}
      
      {/* Floor tiles pattern */}
      <group>
        {[...Array(5)].map((_, i) => (
          [...Array(5)].map((_, j) => (
            <mesh 
              key={`tile-${i}-${j}`}
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[(i - 2) * 4, 0.003, (j - 2) * 4]}
            >
              <planeGeometry args={[3.98, 3.98]} />
              <meshStandardMaterial 
                color="#e0d8d0"
                roughness={0.9}
                metalness={0}
                transparent
                opacity={0.05}
              />
            </mesh>
          ))
        ))}
      </group>
    </>
  )
}

// Room Structure Component
const RoomStructure = () => {
  // Create wall material with subtle texture
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2d2d2d',
      roughness: 0.85,
      metalness: 0,
      envMapIntensity: 0.4
    })
  }, [])
  
  return (
    <>
      {/* Ceiling with recessed light cutouts */}
      <mesh position={[0, 5.85, 0]} receiveShadow>
        <boxGeometry args={[20, 0.3, 20]} />
        <meshStandardMaterial 
          color="#1f1f1f" 
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      
      {/* Back wall with subtle texture */}
      <mesh position={[0, 3, -8]} castShadow receiveShadow>
        <boxGeometry args={[20, 6, 0.3]} />
        <primitive object={wallMaterial} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 20]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 20]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      {/* Wall-floor junction trim */}
      <group>
        <Box args={[20, 0.1, 0.1]} position={[0, 0.05, -7.85]}>
          <meshStandardMaterial color="#3a3a3a" roughness={1} />
        </Box>
        <Box args={[0.1, 0.1, 20]} position={[-9.85, 0.05, 0]}>
          <meshStandardMaterial color="#3a3a3a" roughness={1} />
        </Box>
        <Box args={[0.1, 0.1, 20]} position={[9.85, 0.05, 0]}>
          <meshStandardMaterial color="#3a3a3a" roughness={1} />
        </Box>
      </group>
    </>
  )
}

// Product display as pure PNG
const ProductDisplay = ({ product, position, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  
  return (
    <group position={position}>
      {/* Clickable area with visual feedback - moved forward for better interaction */}
      <mesh
        ref={meshRef}
        position={[0, 0.8, 0.1]}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[1.8, 2.2, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Product Image as pure PNG */}
      {product.imageUrl && (
        <Html 
          transform 
          position={[0, 0.8, 0.01]} 
          scale={0.5}
          style={{ pointerEvents: 'none' }}
          center
        >
          <div 
            style={{ 
              width: '200px', 
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: hovered ? 'drop-shadow(0 0 20px rgba(76, 217, 100, 0.8))' : 'none'
            }}
          >
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </Html>
      )}
      
      {/* Hover effect background */}
      {hovered && (
        <mesh position={[0, 0.8, -0.1]}>
          <planeGeometry args={[1.8, 2.3]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.1} />
        </mesh>
      )}
      
      {/* Product shadow on counter */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.8, 0]}
        receiveShadow
      >
        <planeGeometry args={[1.5, 2]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  )
}

const Hero3DShop = () => {
  const [activeCategory, setActiveCategory] = useState('flower')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const { products, loading } = useProducts()

  // Filter products by category
  const filteredProducts = products.filter(p => 
    p.type === activeCategory && p.inStock !== false
  )
  
  // Use all products if no filtered results
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products

  // Handle horizontal scrolling with smooth momentum
  const handleScroll = (e) => {
    if (displayProducts.length <= 4) return // No need to scroll if few products
    
    e.preventDefault()
    const delta = e.deltaY * 0.5 || e.deltaX // Support both vertical and horizontal scroll
    const scrollSpeed = 0.01 // Adjusted for smoother scrolling
    const totalWidth = (displayProducts.length - 1) * 2.5
    const viewWidth = 12 // Increased to match wider counter
    const maxScroll = Math.max(0, (totalWidth - viewWidth) / 2)
    
    setScrollOffset(prev => {
      const newOffset = prev - (delta * scrollSpeed)
      // Clamp the offset with centered bounds
      return Math.max(-maxScroll, Math.min(maxScroll, newOffset))
    })
  }
  
  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

  // Add keyboard navigation and mouse controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (displayProducts.length <= 4) return
      
      const scrollAmount = 2.5 // One product width
      const totalWidth = (displayProducts.length - 1) * 2.5
      const viewWidth = 12
      const maxScroll = Math.max(0, (totalWidth - viewWidth) / 2)
      
      if (e.key === 'ArrowLeft') {
        setScrollOffset(prev => Math.min(maxScroll, prev + scrollAmount))
      } else if (e.key === 'ArrowRight') {
        setScrollOffset(prev => Math.max(-maxScroll, prev - scrollAmount))
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [displayProducts.length])

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-black pt-20"
      onWheel={handleScroll}
    >
      {/* 3D Scene */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding 
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 2.5, 4]}
          fov={60}
        />
        <Suspense fallback={null}>
          <ShopScene 
            products={displayProducts}
            onProductSelect={handleProductSelect}
            scrollOffset={scrollOffset}
          />
        </Suspense>
        
        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.5} 
            luminanceThreshold={0.8} 
            luminanceSmoothing={0.9} 
            height={300}
          />
          <DepthOfField 
            focusDistance={0.02} 
            focalLength={0.08} 
            bokehScale={2} 
            height={480} 
          />
          <SSAO 
            samples={25} 
            radius={0.05} 
            intensity={10} 
            luminanceInfluence={0.1} 
            color="black" 
          />
          <Noise opacity={0.015} />
          <Vignette eskil={false} offset={0.1} darkness={0.4} />
        </EffectComposer>
      </Canvas>

      {/* Category Tabs - Dark theme */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/90 backdrop-blur-xl rounded-full shadow-2xl border border-gray-700 px-2 py-1">
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={(category) => {
              setActiveCategory(category)
              setScrollOffset(0) // Reset scroll when changing category
            }}
          />
        </div>
      </div>

      {/* Product Info Modal */}
      {selectedProduct && (
        <FloatingProductInfo 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
          <div className="text-white text-xl">Loading products...</div>
        </div>
      )}

      {/* Scroll Indicator - positioned above tabs */}
      {displayProducts.length > 4 && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-400 border border-gray-800 animate-pulse">
            Scroll or use ← → arrows to browse products
          </div>
        </div>
      )}
    </section>
  )
}

// OLED TV Component
const OLEDTVScreen = ({ position, rotation, videoUrl }) => {
  const video = document.createElement('video')
  video.src = videoUrl
  video.crossOrigin = 'anonymous'
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.autoplay = true
  
  useEffect(() => {
    video.play()
    return () => {
      video.pause()
      video.src = ''
    }
  }, [])
  
  const videoTexture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: 'anonymous'
  })
  
  return (
    <group position={position} rotation={rotation}>
      {/* TV Frame - Ultra thin OLED style */}
      <Box args={[0.05, 3.5, 6]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.2} 
          metalness={0.8}
        />
      </Box>
      
      {/* TV Bezel */}
      <Box args={[0.02, 3.4, 5.9]} position={[0.04, 0, 0]}>
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.1} 
          metalness={0.9}
        />
      </Box>
      
      {/* Screen */}
      <mesh position={[0.05, 0, 0]}>
        <planeGeometry args={[3.3, 5.8]} />
        <meshBasicMaterial 
          map={videoTexture}
          toneMapped={false}
        />
      </mesh>
      
      {/* Screen glass reflection */}
      <mesh position={[0.06, 0, 0]}>
        <planeGeometry args={[3.3, 5.8]} />
        <meshPhysicalMaterial 
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Ambient glow from screen */}
      <pointLight 
        position={[0.5, 0, 0]} 
        intensity={0.5} 
        color="#4a9eff"
        distance={3}
        decay={2}
      />
      
      {/* TV Stand/Mount */}
      <Box args={[0.1, 0.1, 0.8]} position={[-0.05, -1.8, 0]}>
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.7} 
          metalness={0.3}
        />
      </Box>
      
      {/* Brand logo area */}
      <Text
        position={[0.055, -1.6, 0]}
        fontSize={0.08}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        OLED 8K
      </Text>
    </group>
  )
}

export default Hero3DShop