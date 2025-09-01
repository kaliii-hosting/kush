import { useState } from 'react';
import { FileText, Download, ExternalLink, Search, Filter, CheckCircle } from 'lucide-react';

const LabResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Lab results data parsed from URLs
  const labResults = [
    { id: 1, name: 'Tangie', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20TANGIE%20.pdf' },
    { id: 2, name: 'Ice Cream Cake', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20ICE%20CREAM%20CAKE%20.pdf' },
    { id: 3, name: 'Super Lemon Haze', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20SUPER%20LEMON%20HAZE%20.pdf' },
    { id: 4, name: 'Watermelon Zlushie', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20WATERMELON%20ZLUSHIE.pdf' },
    { id: 5, name: 'Strawberry Diesel', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20STRAWBERRY%20DIESEL.pdf' },
    { id: 6, name: 'Lychee Dream', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20LYCHEE%20DREAM.pdf' },
    { id: 7, name: 'Orange Jack', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20ORANGE%20JACK.pdf' },
    { id: 8, name: 'Guava Gelato', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20GUAVA%20GELATO.pdf' },
    { id: 9, name: 'Super Blue Dream', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20SUPER%20BLUE%20DREAM.pdf' },
    { id: 10, name: 'Do Si Dos', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20DO%20SI%20DOS.pdf' },
    { id: 11, name: 'Skywalker OG', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20SKYWALKER%20OG.pdf' },
    { id: 12, name: 'Blueberry Kush', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20BLUEBERRY%20KUSH.pdf' },
    { id: 13, name: 'King Louis', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20KING%20LOUIS.pdf' },
    { id: 14, name: 'Godzilla Glue', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20GOZILLA%20GLUE.pdf' },
    { id: 15, name: 'Pineapple Express', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20PINEAPPLE%20EXPRESS.pdf' },
    { id: 16, name: 'Mango Kush', type: 'Kushie Gold Distillate Pod 1G', category: 'pod', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20POD%201G%20-%20MANGO%20KUSH.pdf' },
    { id: 17, name: 'Dragon Kush', type: 'Kushie Gold Distillate Cartridge 1G', category: 'cartridge', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20CARTRIDGE%201G%20-%20DRAGON%20KUSH.pdf' },
    { id: 18, name: 'Watermelon Zlushie', type: 'Kushie Gold Distillate Pod 1G', category: 'pod', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/KUSHIE+GOLD%20DISTILLATE%20POD%201G%20-%20WATERMELON%20ZLUSHIE%20.pdf' },
    { id: 19, name: 'Super Blue Dream', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20SUPER%20BLUE%20DREAM%20.pdf' },
    { id: 20, name: 'Grape Limeade', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20GRAPE%20LIMEADE.pdf' },
    { id: 21, name: 'Tropical Runtz', type: 'Live Resin Diamonds 1G', category: 'diamonds', url: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Lab%20Results/LIVE%20RESIN%20DIAMONDS%201G%20-%20TROPICAL%20RUNTZ.pdf' },
  ];

  // Filter products based on search and category
  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || result.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent h-96"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Lab Results
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Verified third-party lab testing results for all Kushie products. 
              Your safety and transparency are our priority.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 antialiased" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 pl-14 pr-4 py-3 rounded-full outline-none focus:bg-white/20 transition-all duration-200"
                />
              </div>

              {/* Category Filter - Centered on mobile */}
              <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                {['all', 'cartridge', 'diamonds', 'pod'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full capitalize transition-all duration-200 text-sm md:text-base ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {category === 'all' ? 'All' : category === 'diamonds' ? 'Diamonds' : category === 'pod' ? 'Pods' : 'Cartridges'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-6 text-gray-400 font-medium">#</th>
                  <th className="text-left p-6 text-gray-400 font-medium">Product Name</th>
                  <th className="text-left p-6 text-gray-400 font-medium">Type</th>
                  <th className="text-center p-6 text-gray-400 font-medium">Status</th>
                  <th className="text-center p-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr 
                    key={result.id}
                    className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 text-gray-500">{index + 1}</td>
                    <td className="p-6">
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        {result.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="p-6 text-gray-400">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        result.category === 'diamonds' ? 'bg-purple-500/20 text-purple-400' :
                        result.category === 'pod' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {result.type}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-200 text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          View PDF
                        </a>
                        <a
                          href={result.url}
                          download
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredResults.map((result, index) => (
              <div 
                key={result.id}
                className="p-6 border-b border-gray-800/50 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500 text-sm">#{index + 1}</span>
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <a 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {result.name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      result.category === 'diamonds' ? 'bg-purple-500/20 text-purple-400' :
                      result.category === 'pod' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {result.type}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-200 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    View PDF
                  </a>
                  <a
                    href={result.url}
                    download
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredResults.length === 0 && (
            <div className="p-20 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No lab results found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Quality You Can Trust
            </h2>
            <p className="text-gray-300 mb-6">
              All Kushie products undergo rigorous third-party laboratory testing to ensure purity, potency, and safety. 
              Our commitment to transparency means you can access detailed lab results for every product we offer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-400">Tested Products</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">3rd Party</div>
                <div className="text-sm text-gray-400">Independent Labs</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">Full Panel</div>
                <div className="text-sm text-gray-400">Comprehensive Testing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResults;