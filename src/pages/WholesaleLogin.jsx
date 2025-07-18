import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X, Delete } from 'lucide-react';

const WholesaleLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  const correctPin = '1956';

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9' && pin.length < 4) {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      } else if (e.key === 'Enter' && pin.length === 4) {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pin]);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/wholesale');
      }
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 600);
    }
  };

  // Auto-submit when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Wholesale Access</h1>
          <p className="text-gray-400">Enter PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className={`bg-gray-900 rounded-lg p-6 mb-6 ${shake ? 'animate-shake' : ''}`}>
          <input
            ref={inputRef}
            type="password"
            value={pin}
            readOnly
            className="sr-only"
            aria-label="PIN input"
          />
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin[index]
                    ? error
                      ? 'border-red-500 bg-red-500/10 text-red-500'
                      : 'border-orange-600 bg-orange-600/10 text-orange-600'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                {pin[index] ? '•' : ''}
              </div>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-center mt-4 text-sm font-medium">
              Incorrect PIN. Please try again.
            </p>
          )}
        </div>

        {/* Keypad */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white text-xl font-semibold rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600"
                disabled={pin.length >= 4}
              >
                {num}
              </button>
            ))}
            
            {/* Clear button */}
            <button
              onClick={handleClear}
              className="h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600 flex items-center justify-center"
              title="Clear (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Zero */}
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white text-xl font-semibold rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600"
              disabled={pin.length >= 4}
            >
              0
            </button>
            
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600 flex items-center justify-center"
              title="Delete (Backspace)"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Use keypad or keyboard to enter PIN</p>
          <p className="mt-1">Press Enter to submit • Esc to clear</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default WholesaleLogin;