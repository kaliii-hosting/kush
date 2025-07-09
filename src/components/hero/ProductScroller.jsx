import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Html } from '@react-three/drei'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from '@react-spring/three'
import * as THREE from 'three'
import SafeImage from './SafeImage'

const ProductItem = ({ product, position, onClick, isSelected }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Only show products with images
  if (!product.imageUrl) return null

  // Realistic package sizes (in meters)
  const packageWidth = 0.08  // 8cm width
  const packageHeight = 0.12 // 12cm height
  const packageDepth = 0.03  // 3cm depth

  return (
    <group position={position}>
      {/* Invisible hitbox for interaction */}
      <Box
        ref={meshRef}
        args={[packageWidth, packageHeight, packageDepth]}
        position={[0, packageHeight / 2, 0]}
        visible={false}
        onClick={() => onClick(product)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />

      {/* Product Image - Transparent PNG */}
      <SafeImage
        url={product.imageUrl}
        scale={[packageWidth, packageHeight, 1]}
        position={[0, packageHeight / 2, 0.001]}
      />

      {/* Subtle shadow under product */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[packageWidth * 1.2, packageDepth * 2]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.2}
        />
      </mesh>

      {/* Hover Glow */}
      {hovered && (
        <mesh position={[0, packageHeight / 2, -0.005]}>
          <planeGeometry args={[packageWidth * 1.3, packageHeight * 1.3]} />
          <meshBasicMaterial 
            color="#4ade80" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Minimal Price Tag */}
      {hovered && (
        <Html position={[0, -0.02, 0]} center>
          <div className="bg-black/90 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap border border-green-500/50">
            ${product.price}
          </div>
        </Html>
      )}
    </group>
  )
}

const ProductScroller = ({ products, onProductSelect }) => {
  const groupRef = useRef()
  const { viewport } = useThree()
  const [scrollX, setScrollX] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Debug logging
  console.log('ProductScroller: Received products:', products)

  // Filter products with images
  const productsWithImages = products.filter(p => p.imageUrl)
  console.log('ProductScroller: Products with images:', productsWithImages)

  // Calculate product positions - centered on counter with realistic spacing
  const productPositions = useMemo(() => {
    const spacing = 0.25 // 25cm between products
    const totalWidth = (productsWithImages.length - 1) * spacing
    const startX = -totalWidth / 2
    
    return productsWithImages.map((_, index) => [
      startX + index * spacing + scrollX,
      1.3, // On top of counter (counter top is at y=1.25)
      -2   // Counter is at z=-2
    ])
  }, [productsWithImages.length, scrollX])

  // Scroll constraints with realistic spacing
  const maxScroll = Math.max(0, (productsWithImages.length - 8) * 0.15 / 2)
  const minScroll = -maxScroll

  // Gesture handling for scroll
  const bind = useGesture({
    onWheel: ({ delta: [, dy], event }) => {
      event.preventDefault()
      const newScrollX = THREE.MathUtils.clamp(
        scrollX - dy * 0.01,
        minScroll,
        maxScroll
      )
      setScrollX(newScrollX)
    },
    onDrag: ({ delta: [dx] }) => {
      const newScrollX = THREE.MathUtils.clamp(
        scrollX + dx * 0.01,
        minScroll,
        maxScroll
      )
      setScrollX(newScrollX)
    }
  })

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    onProductSelect(product)
  }

  // Show message if no products
  if (productsWithImages.length === 0) {
    return (
      <Html center position={[0, 0.5, 0]}>
        <div className="bg-black/80 text-white px-4 py-2 rounded">
          No products available. Add products in admin panel.
        </div>
      </Html>
    )
  }

  return (
    <animated.group ref={groupRef} {...bind()}>
      {productsWithImages.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          position={productPositions[index]}
          onClick={handleProductClick}
          isSelected={selectedProduct?.id === product.id}
        />
      ))}
      
      {/* Scroll Indicators */}
      {productsWithImages.length > 8 && (
        <>
          {scrollX < maxScroll && (
            <Html position={[-1.2, 0.2, 0.3]} center>
              <div className="text-green-400 bg-black/70 rounded-full p-1 text-sm">
                ←
              </div>
            </Html>
          )}
          {scrollX > -maxScroll && (
            <Html position={[1.2, 0.2, 0.3]} center>
              <div className="text-green-400 bg-black/70 rounded-full p-1 text-sm">
                →
              </div>
            </Html>
          )}
        </>
      )}
    </animated.group>
  )
}

export default ProductScroller