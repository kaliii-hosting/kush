import { X, ShoppingCart, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingProductInfo = ({ product, onClose }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'flower': return 'bg-green-500'
      case 'edible': return 'bg-amber-500' 
      case 'concentrate': return 'bg-purple-500'
      default: return 'bg-cyan-500'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'flower': return 'Premium Flower'
      case 'edible': return 'Edible'
      case 'concentrate': return 'Concentrate'
      default: return 'Product'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors z-10"
          >
            <X size={24} className="text-gray-400" />
          </button>

          {/* Horizontal layout container */}
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left side - Product Image */}
            <div className="w-full lg:w-1/2 bg-black/50 p-8 flex items-center justify-center">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="max-w-full max-h-[500px] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Right side - Product Info */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {product.name}
                </h2>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white ${getTypeColor(product.type)}`}>
                  {getTypeLabel(product.type)}
                </span>
              </div>

              {/* Price and THC */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="text-3xl lg:text-4xl font-bold text-white">
                    ${product.price}
                  </div>
                  <div className="text-sm text-gray-500">USD</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-semibold text-white">
                    {product.thc}
                  </div>
                  <div className="text-sm text-gray-500">THC</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={18} className="text-gray-400" />
                  <h3 className="text-lg font-semibold text-white">Description</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Effects */}
              {product.effects && product.effects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Effects</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.effects.map((effect, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-lg">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={onClose}
                  className="px-8 bg-gray-800 hover:bg-gray-700 text-gray-300 py-4 rounded-xl font-medium transition-colors text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingProductInfo