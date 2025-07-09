import { Box } from '@react-three/drei'

const SimpleShop = () => {
  return (
    <group>
      {/* Floor */}
      <Box args={[20, 0.1, 20]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#222222" />
      </Box>
      
      {/* Back Wall */}
      <Box args={[20, 8, 0.5]} position={[0, 4, -10]} receiveShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Left Wall */}
      <Box args={[0.5, 8, 20]} position={[-10, 4, 0]} receiveShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Right Wall */}
      <Box args={[0.5, 8, 20]} position={[10, 4, 0]} receiveShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Counter */}
      <Box args={[6, 1.2, 2.5]} position={[0, 0.6, -2]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      
      {/* Counter Top */}
      <Box args={[6.2, 0.1, 2.7]} position={[0, 1.25, -2]} castShadow receiveShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.3} />
      </Box>
      
      {/* Test Product */}
      <Box args={[0.5, 0.7, 0.1]} position={[0, 1.6, -2]} castShadow>
        <meshStandardMaterial color="#4ade80" />
      </Box>
    </group>
  )
}

export default SimpleShop