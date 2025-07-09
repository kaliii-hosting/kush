import { Box } from '@react-three/drei'

const ShopInterior = () => {
  const wallColor = "#2a2a2a"
  const floorColor = "#1a1a1a"
  const ceilingColor = "#333333"
  
  return (
    <group>
      {/* Floor */}
      <Box 
        args={[15, 0.2, 12]} 
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={floorColor}
          roughness={0.9}
          metalness={0}
        />
      </Box>

      {/* Back Wall */}
      <Box 
        args={[15, 5, 0.3]} 
        position={[0, 2.5, -6]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor}
          roughness={0.95}
          metalness={0}
        />
      </Box>

      {/* Left Wall */}
      <Box 
        args={[0.3, 5, 12]} 
        position={[-7.5, 2.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor}
          roughness={0.95}
          metalness={0}
        />
      </Box>

      {/* Right Wall */}
      <Box 
        args={[0.3, 5, 12]} 
        position={[7.5, 2.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor}
          roughness={0.95}
          metalness={0}
        />
      </Box>

      {/* Ceiling */}
      <Box 
        args={[15, 0.2, 12]} 
        position={[0, 5, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={ceilingColor}
          roughness={1}
          metalness={0}
        />
      </Box>

      {/* Simple ceiling tiles/panels for realism */}
      {[-6, -3, 0, 3, 6].map((x) => 
        [-4, -2, 0, 2, 4].map((z) => (
          <Box 
            key={`ceiling-${x}-${z}`}
            args={[2.8, 0.05, 1.8]} 
            position={[x, 4.9, z]}
          >
            <meshStandardMaterial 
              color="#f5f5f5"
              roughness={0.9}
              metalness={0}
            />
          </Box>
        ))
      )}
    </group>
  )
}

export default ShopInterior