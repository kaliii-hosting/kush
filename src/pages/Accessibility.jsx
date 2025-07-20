import { useNavigate } from 'react-router-dom';
import './Accessibility.css';

const Accessibility = () => {
  const navigate = useNavigate();

  const handleKeyClick = (route) => {
    navigate(route);
  };

  return (
    <div className="accessibility-page">
      <main>
        <div className="keypad">
          <div className="keypad__base">
            <img src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" alt="" />
          </div>
          <button 
            id="one" 
            className="key keypad__single keypad__single--left"
            onClick={() => handleKeyClick('/admin')}
          >
            <span className="key__mask">
              <span className="key__content">
                <span className="key__text">A</span>
                <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
          <button 
            id="two" 
            className="key keypad__single"
            onClick={() => handleKeyClick('/wholesale')}
          >
            <span className="key__mask">
              <span className="key__content">
                <span className="key__text">W</span>
                <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
          <button 
            id="three" 
            className="key keypad__double"
            onClick={() => handleKeyClick('/sales')}
          >
            <span className="key__mask">
              <span className="key__content">
                <span className="key__text">Sales Reps</span>
                <img src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Accessibility;