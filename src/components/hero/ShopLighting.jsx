import { useRef } from 'react'
import * as THREE from 'three'

const ShopLighting = () => {
  return (
    <group>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} color="#ffffff" />
      
      {/* Main ceiling light - single strong directional light */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Front fill light to illuminate counter area */}
      <pointLight
        position={[0, 3, 4]}
        intensity={0.6}
        color="#ffffff"
        distance={8}
        decay={2}
      />
      
      {/* Subtle side lights for depth */}
      <pointLight
        position={[-4, 2, 0]}
        intensity={0.3}
        color="#fff5e6"
        distance={6}
        decay={2}
      />
      <pointLight
        position={[4, 2, 0]}
        intensity={0.3}
        color="#fff5e6"
        distance={6}
        decay={2}
      />
      
      {/* Counter accent light - highlights products */}
      <spotLight
        position={[0, 3, 1]}
        target-position={[0, 0, -0.5]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Back wall wash light */}
      <pointLight
        position={[0, 2, -4]}
        intensity={0.4}
        color="#e0f2fe"
        distance={4}
      />
    </group>
  )
}

export default ShopLighting