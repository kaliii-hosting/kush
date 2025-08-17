import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/AboutCards.css';

const AboutCards = ({ aboutContent }) => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="about-accordion-container">
      <div className="about-accordion-wrapper">
        <div className="accordion-items">
          {aboutContent.map((item, index) => (
            <div 
              key={index} 
              className={`accordion-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                <div className="accordion-header-content">
                  <h3 className="accordion-title">{item.title}</h3>
                  <p className="accordion-subtitle">{item.subtitle}</p>
                </div>
                <ChevronDown 
                  className={`accordion-icon ${openIndex === index ? 'rotate' : ''}`}
                  size={24}
                />
              </button>
              
              <div className={`accordion-body ${openIndex === index ? 'open' : ''}`}>
                <div className="accordion-content">
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutCards;