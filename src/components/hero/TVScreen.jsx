import { useRef, useEffect, useState, Suspense } from 'react'
import { Box, Html } from '@react-three/drei'
import * as THREE from 'three'

const VideoScreen = ({ videoUrl, scale, position }) => {
  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.src = videoUrl
    vid.crossOrigin = 'anonymous'
    vid.loop = true
    vid.muted = true
    vid.playsInline = true
    vid.autoplay = true
    return vid
  })

  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.encoding = THREE.sRGBEncoding
    setTexture(videoTexture)

    video.play().catch(e => {
      console.log('Video play failed, trying muted play:', e)
      video.muted = true
      video.play()
    })

    return () => {
      video.pause()
      videoTexture.dispose()
    }
  }, [video])

  if (!texture) return null

  return (
    <Box args={scale} position={[0, 0, 0.08]}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </Box>
  )
}

const TVScreen = ({ position, videoUrl, scale = [2, 1.2, 0.1] }) => {
  const [fallbackTexture, setFallbackTexture] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  
  // Create a fallback texture with a gradient
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1a1a1a')
    gradient.addColorStop(0.5, '#0f7938')
    gradient.addColorStop(1, '#1a1a1a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('KUSHIE', canvas.width / 2, canvas.height / 2 - 100)
    
    ctx.font = '60px Arial'
    ctx.fillText('Premium Cannabis', canvas.width / 2, canvas.height / 2 + 50)
    
    const texture = new THREE.CanvasTexture(canvas)
    setFallbackTexture(texture)

    // Only show video if URL is provided
    if (videoUrl) {
      setShowVideo(true)
    }
  }, [videoUrl])

  return (
    <group position={position}>
      {/* TV Frame */}
      <Box args={[scale[0] + 0.1, scale[1] + 0.1, 0.15]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </Box>
      
      {/* TV Screen - Show video or fallback */}
      {showVideo && videoUrl ? (
        <Suspense fallback={
          <Box args={scale} position={[0, 0, 0.08]}>
            <meshBasicMaterial map={fallbackTexture} toneMapped={false} />
          </Box>
        }>
          <VideoScreen videoUrl={videoUrl} scale={scale} position={position} />
        </Suspense>
      ) : (
        <Box args={scale} position={[0, 0, 0.08]}>
          <meshBasicMaterial map={fallbackTexture} toneMapped={false} />
        </Box>
      )}
      
      {/* Screen Glass Effect */}
      <Box args={[scale[0], scale[1], 0.01]} position={[0, 0, 0.09]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          roughness={0}
          metalness={0}
          thickness={0.01}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.1}
        />
      </Box>
    </group>
  )
}

export default TVScreen