import { useState, useEffect, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Plane } from '@react-three/drei'

// Fallback image - using a data URL for a simple placeholder
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgUHJvZHVjdCBJbWFnZQogIDwvdGV4dD4KPC9zdmc+'

// Component to handle texture loading
const TexturedPlane = ({ url, scale, position, ...props }) => {
  const texture = useLoader(TextureLoader, url)
  
  // Enable transparency for PNG images
  texture.transparent = true
  
  return (
    <Plane args={scale} position={position} {...props}>
      <meshBasicMaterial 
        map={texture} 
        transparent 
        alphaTest={0.5}
        side={2} // DoubleSide
      />
    </Plane>
  )
}

// Error fallback component
const FallbackPlane = ({ scale, position, ...props }) => {
  return (
    <Plane args={scale} position={position} {...props}>
      <meshBasicMaterial color="#333333" />
    </Plane>
  )
}

const SafeImage = ({ url, scale = [1, 1, 1], position = [0, 0, 0], ...props }) => {
  const [imageUrl, setImageUrl] = useState(url || FALLBACK_IMAGE)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!url) {
      setImageUrl(FALLBACK_IMAGE)
      setHasError(true)
      return
    }

    // Pre-validate image URL
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const handleLoad = () => {
      setImageUrl(url)
      setHasError(false)
    }
    
    const handleError = () => {
      console.warn(`Failed to load image: ${url}`)
      setImageUrl(FALLBACK_IMAGE)
      setHasError(true)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    img.src = url

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [url])

  if (hasError) {
    return <FallbackPlane scale={scale} position={position} {...props} />
  }

  return (
    <Suspense fallback={<FallbackPlane scale={scale} position={position} {...props} />}>
      <TexturedPlane url={imageUrl} scale={scale} position={position} {...props} />
    </Suspense>
  )
}

export default SafeImage