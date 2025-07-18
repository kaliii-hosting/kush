import { useState, useEffect, useRef } from 'react';
import { Lock, AlertCircle, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { signInAdmin } = useAdminAuth();
  
  const ADMIN_PIN = '1973';

  useEffect(() => {
    // Focus on invisible input for keyboard support
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Maintain focus on input
  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Set up interval to maintain focus
    const focusInterval = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    // Focus on window focus
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(focusInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      
      // Auto-submit when 4 digits are entered
      if (newPin.length === 4) {
        submitPin(newPin);
      }
    }
  };
  
  const submitPin = (pinValue) => {
    if (pinValue === ADMIN_PIN) {
      // Sign in admin Firebase account
      signInAdmin().then(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin');
        }
      }).catch((err) => {
        console.error('Admin Firebase sign in failed:', err);
        // Still proceed even if Firebase fails
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin');
        }
      });
    } else {
      setError('Incorrect PIN');
      setTimeout(() => {
        setPin('');
        setError('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1500);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleKeyPress = (e) => {
    // Handle number keys
    if (e.key >= '0' && e.key <= '9' && pin.length < 4) {
      e.preventDefault();
      handleNumberClick(e.key);
    }
    // Handle backspace/delete
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleDelete();
    }
    // Handle escape to clear
    else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
    // Handle enter to submit
    else if (e.key === 'Enter' && pin.length === 4) {
      e.preventDefault();
      submitPin(pin);
    }
  };

  return (
    <div 
      className="min-h-screen bg-black flex items-center justify-center px-4"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input for keyboard support */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}} // Controlled by handleKeyPress
        onKeyDown={handleKeyPress}
        onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
        className="absolute opacity-0 -z-10 w-1 h-1"
        maxLength={4}
        autoFocus
        tabIndex={0}
      />
      
      <div className="max-w-sm w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Admin Access</h2>
            <p className="text-gray-400 mt-2">Enter PIN to continue</p>
            <p className="text-gray-500 text-xs mt-1">Use keyboard or click numbers • Enter to submit</p>
          </div>

          {/* PIN Display */}
          <div className="mb-8">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center ${
                    pin.length > index
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-gray-600 bg-gray-700'
                  }`}
                >
                  {pin.length > index && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                <AlertCircle size={16} />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xl font-semibold py-4 rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {num}
              </button>
            ))}
            
            <button
              onClick={handleClear}
              className="bg-gray-700 hover:bg-gray-600 text-gray-400 py-4 rounded-lg transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Clear
            </button>
            
            <button
              onClick={() => handleNumberClick('0')}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xl font-semibold py-4 rounded-lg transition-all transform active:scale-95"
            >
              0
            </button>
            
            <button
              onClick={handleDelete}
              className="bg-gray-700 hover:bg-gray-600 text-gray-400 py-4 rounded-lg transition-all transform active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Delete size={20} />
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Cannabis Shop Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;