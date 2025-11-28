import React, { useEffect, useState } from 'react';
import { DeviceConfigService } from 'pepefoto-bridge-lib/platform/auth';
import { DeviceConfigResponse, UIStyleCategory, StyleItem } from './types';
import { StyleDetailsModal } from './components/StyleDetailsModal';
import { LayoutGrid, Sparkles, Image as ImageIcon, Zap, Search, Settings, Monitor, Wifi } from 'lucide-react';

// Note: DeviceConfigService is mocked via importmap in index.html for this preview environment.
// In a real build, it resolves to the actual 'pepefoto-bridge-lib' package.
// We need to access the static helper from the mock class implementation if we are in mock mode,
// but TS treats it as the real library type.
// For the purpose of this preview UI, we assume the service has the helper or we access env directly.
// To keep TS happy with the real lib import which might not have 'getEnv' exposed statically:
const getEnvSafe = (key: string) => {
  // @ts-ignore - The mock implementation has this helper, but the real lib might not.
  if (typeof DeviceConfigService.getEnv === 'function') {
     // @ts-ignore
    return DeviceConfigService.getEnv(key);
  }
  
  // Fallback if using real lib which doesn't have getEnv helper
  try {
    // @ts-ignore
    return import.meta.env[key] || '';
  } catch(e) { return ''; }
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<DeviceConfigResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Environment status for debug UI
  const envStatus = {
    baseUrl: getEnvSafe('VITE_GEMINI_BRIDGE_BASE_URL'),
    token: getEnvSafe('VITE_GEMINI_BRIDGE_AUTH_TOKEN') ? '******' : 'Missing',
    deviceCode: getEnvSafe('VITE_GEMINI_BRIDGE_DEVICE_CODE')
  };

  useEffect(() => {
    // ---------------------------------------------------------
    // Integration Logic for pepefoto-bridge-lib
    // ---------------------------------------------------------
    
    // 1. Initialize Service from Env
    const service = DeviceConfigService.fromEnv();
    
    // 2. Fetch Configuration
    service.getDeviceConfig()
      .then((result) => {
        setConfig(result);
        if (result.uistyle.length > 0) {
          setSelectedCategory(result.uistyle[0].id);
        }
      })
      .catch(err => console.error("Failed to load device config", err))
      .finally(() => setLoading(false));
  }, []);

  const activeCategory = config?.uistyle.find(c => c.id === selectedCategory);
  
  const filteredStyles = activeCategory?.lst_style.filter(style => {
    if (!searchTerm) return true;
    const name = style.style_name?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400">Connecting to Pepe Device Bridge...</p>
        <div className="text-xs text-gray-600 font-mono">Device: {envStatus.deviceCode || 'Unknown'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-gray-800 border-r border-gray-700 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-indigo-400" />
            Gemini Config
          </h1>
          <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700/50">
             <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Monitor size={12} />
                <span>Device Code</span>
             </div>
             <div className="text-sm font-mono text-green-400 font-bold">{envStatus.deviceCode}</div>
             <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-gray-500">Connected</span>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {config?.uistyle.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                selectedCategory === cat.id 
                  ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/50' 
                  : 'hover:bg-gray-700/50 text-gray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700 ${selectedCategory === cat.id ? 'ring-2 ring-indigo-500' : ''}`}>
                {cat.btnimg ? (
                    <img src={cat.btnimg} alt={cat.cat_name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <LayoutGrid size={18} />
                    </div>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium">{cat.cat_name}</div>
                <div className="text-xs opacity-60">{cat.lst_style.length} styles</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
           <span>v1.0.0</span>
           <span>Bridge Lib Mode</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-900/95">
        {/* Header */}
        <header className="h-20 border-b border-gray-700/50 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
           <div>
              <h2 className="text-lg font-semibold text-white">
                {activeCategory?.cat_name || 'All Styles'}
              </h2>
              <p className="text-sm text-gray-400">Manage and preview your device assets</p>
           </div>
           
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search styles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-100 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
           </div>
        </header>

        {/* Style Grid */}
        <div className="flex-1 overflow-y-auto p-8">
           {filteredStyles && filteredStyles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
              {filteredStyles.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className="group bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50 hover:border-indigo-500/50"
                >
                  <div className="aspect-[2/3] relative bg-gray-700 overflow-hidden">
                    <img 
                      src={style.img_preview} 
                      alt={style.style_name || 'Preview'} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {style.isGif === 1 && (
                            <span className="bg-pink-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">GIF</span>
                        )}
                         {style.ar8 === 1 && (
                            <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">AR</span>
                        )}
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 text-gray-900 p-2 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                            <Settings size={20} />
                        </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-200 truncate">{style.style_name || 'Untitled'}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-bold ${style.price === 0 ? 'text-green-400' : 'text-indigo-400'}`}>
                            {style.price === 0 ? 'FREE' : `$${(style.price / 100).toFixed(2)}`}
                        </span>
                        <span className="text-[10px] text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">
                            {style.resolution ? style.resolution.split('x')[0] + 'p' : 'Auto'}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ImageIcon size={48} className="mb-4 opacity-20" />
                <p>No styles found matching your criteria</p>
             </div>
           )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedStyle && (
        <StyleDetailsModal 
            style={selectedStyle} 
            onClose={() => setSelectedStyle(null)} 
        />
      )}
    </div>
  );
};

export default App;