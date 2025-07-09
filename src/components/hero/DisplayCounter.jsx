import { RoundedBox, Box } from '@react-three/drei'

const DisplayCounter = () => {
  return (
    <group position={[0, 0, -1]}>
      {/* Main Counter Body */}
      <Box 
        args={[5, 1, 2]} 
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.1}
        />
      </Box>

      {/* Counter Top Surface - Where products sit */}
      <RoundedBox
        args={[5.2, 0.1, 2.2]}
        radius={0.02}
        smoothness={4}
        position={[0, 1.05, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>

      {/* Glass Display Case */}
      <group position={[0, 1.6, 0]}>
        {/* Glass Front */}
        <Box args={[4.8, 1, 0.05]} position={[0, 0, 1]}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent
            opacity={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </Box>
        
        {/* Glass Back */}
        <Box args={[4.8, 1, 0.05]} position={[0, 0, -1]}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent
            opacity={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </Box>
        
        {/* Glass Sides */}
        <Box args={[0.05, 1, 2]} position={[-2.4, 0, 0]}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent
            opacity={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </Box>
        <Box args={[0.05, 1, 2]} position={[2.4, 0, 0]}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent
            opacity={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </Box>
        
        {/* Glass Top */}
        <Box args={[4.8, 0.05, 2]} position={[0, 0.5, 0]}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            transparent
            opacity={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </Box>
      </group>

      {/* Counter Front Panel */}
      <Box 
        args={[5, 0.8, 0.05]} 
        position={[0, 0.4, 1.1]}
        castShadow
      >
        <meshStandardMaterial 
          color="#0f0f0f"
          roughness={0.8}
          metalness={0}
        />
      </Box>

      {/* POS System/Register Area */}
      <Box 
        args={[0.8, 0.2, 0.6]} 
        position={[1.8, 1.15, 0.5]}
        castShadow
      >
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.3}
          metalness={0.7}
        />
      </Box>

      {/* Counter Edge Trim */}
      <Box args={[5.2, 0.02, 0.05]} position={[0, 1.1, 1.1]}>
        <meshStandardMaterial 
          color="#444444"
          roughness={0.3}
          metalness={0.8}
        />
      </Box>
    </group>
  )
}

export default DisplayCounter