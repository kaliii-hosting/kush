import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Zap, Leaf, Shirt, Cigarette } from 'lucide-react';

const DisclosureCards = () => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll('li');
    
    const setIndex = (event) => {
      const closest = event.target.closest('li');
      if (closest) {
        const index = [...items].indexOf(closest);
        const cols = new Array(list.children.length)
          .fill()
          .map((_, i) => {
            items[i].dataset.active = (index === i).toString();
            return index === i ? '10fr' : '1fr';
          })
          .join(' ');
        list.style.setProperty('grid-template-columns', cols);
      }
    };

    // Set initial active state
    if (items.length > 0) {
      items[0].dataset.active = 'true';
    }

    // Add event listeners
    list.addEventListener('focus', setIndex, true);
    list.addEventListener('click', setIndex);
    list.addEventListener('pointermove', setIndex);

    // Remove article width calculation since we're using full width
    // The grid system will handle the responsive layout

    // Cleanup
    return () => {
      list.removeEventListener('focus', setIndex, true);
      list.removeEventListener('click', setIndex);
      list.removeEventListener('pointermove', setIndex);
    };
  }, []);

  const cards = [
    {
      title: "2025 Events",
      description: "Showcasing at major 2025 cannabis exhibitions focusing on cultivating content and clothing focused on the creative and relaxing lifestyle.",
      icon: <Calendar className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/Photo_Jun_14_2025__7_07_36_PM_1752733389899_6uuxmwc.jpg",
      link: "/shop"
    },
    {
      title: "lifestyle",
      description: "Kushie Brand isn't just a marijuana brand; it's a way of life. Believing in the need for self-care and ability to unwind.",
      icon: <Users className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/Screenshot_5_1752608083133_6u2c3km.jpg",
      link: "/shop"
    },
    {
      title: "Dspsbls",
      description: "Made for those on the go! Offering an All In One Rechargeable Distillate Vape Pens.",
      icon: <Zap className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/x10__80__1753095376381_zpdjwce.jpg",
      link: "/shop"
    },
    {
      title: "Joy On-the-Go",
      description: "Experience the ultimate in portable luxury with DSPSBLS+ by Kushie.",
      icon: <Leaf className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/x7__18__1753095413377_f2cnz9w.jpg",
      link: "/shop"
    },
    {
      title: "GEAR",
      description: "Merging premium quality with authentic street style. From bold graphic tees to statement accessories.",
      icon: <Shirt className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/SHOP_BANNER_2f58ad04-18a3-4e1b-8d2a-acd93acef73d.webp",
      link: "/shop"
    },
    {
      title: "Lab Tested",
      description: "Offering a clean and pure cannabis oil using only top-shelf quality flower and cannabis-derived terpenes.",
      icon: <Cigarette className="w-[18px] h-[18px] text-primary" />,
      image: "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/x2__9__1753095286656_fp8ywvr.jpg",
      link: "/shop"
    }
  ];

  return (
    <section className="disclosure-section bg-black py-16 w-full overflow-hidden">
      <div className="w-full flex flex-col items-center">
        <ul ref={listRef} className="disclosure-grid w-full">
          {cards.map((card, index) => (
            <li 
              key={index} 
              className="disclosure-item"
              data-active={index === 0 ? "true" : "false"}
            >
              <article className="disclosure-article">
                <h3 className="font-sans">{card.title}</h3>
                <p className="font-sans">{card.description}</p>
                {card.icon}
                <Link to={card.link} onClick={(e) => e.stopPropagation()}>
                  <span className="font-sans">Shop All</span>
                </Link>
                <img src={card.image} alt={card.title} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DisclosureCards;