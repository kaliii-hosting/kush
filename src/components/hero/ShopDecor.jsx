import { Box, Text } from '@react-three/drei'

const ShopDecor = () => {
  return (
    <group>
      {/* Neon "OPEN" Sign */}
      <group position={[2.5, 3.2, -4.85]}>
        <Box args={[0.8, 0.3, 0.05]}>
          <meshStandardMaterial color="#000000" />
        </Box>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.15}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          OPEN
        </Text>
        {/* Neon glow effect */}
        <pointLight
          position={[0, 0, 0.1]}
          color="#00ff00"
          intensity={0.5}
          distance={1}
        />
      </group>

      {/* Store Hours Sign */}
      <group position={[-2.5, 2.8, -4.85]}>
        <Box args={[1, 0.6, 0.05]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Text
          position={[0, 0.15, 0.03]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          HOURS
        </Text>
        <Text
          position={[0, -0.05, 0.03]}
          fontSize={0.06}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          MON-SAT: 9AM-10PM
        </Text>
        <Text
          position={[0, -0.15, 0.03]}
          fontSize={0.06}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          SUN: 10AM-8PM
        </Text>
      </group>

      {/* Security Cameras */}
      <group position={[-5.5, 3.5, -4.5]}>
        <Box args={[0.1, 0.1, 0.2]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.05, 0.05, 0.1]} position={[0, 0, 0.15]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>
      
      <group position={[5.5, 3.5, -4.5]}>
        <Box args={[0.1, 0.1, 0.2]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.05, 0.05, 0.1]} position={[0, 0, 0.15]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>

      {/* Exit Sign */}
      <group position={[5.5, 3.5, 2]}>
        <Box args={[0.6, 0.25, 0.05]}>
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} />
        </Box>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          EXIT
        </Text>
      </group>

      {/* Floor Mat */}
      <Box 
        args={[2, 0.01, 1.5]} 
        position={[0, 0.01, 4]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.9}
          metalness={0}
        />
      </Box>

      {/* Door Frame (entrance) */}
      <group position={[0, 2, 5]}>
        <Box args={[0.1, 4, 0.2]} position={[-1.5, 0, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        <Box args={[0.1, 4, 0.2]} position={[1.5, 0, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        <Box args={[3.1, 0.2, 0.2]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>
    </group>
  )
}

export default ShopDecor