import React from 'react';
import { StyleItem } from '../types';
import { X, Check, Film, Camera, Layers, DollarSign } from 'lucide-react';

interface StyleDetailsModalProps {
  style: StyleItem | null;
  onClose: () => void;
}

export const StyleDetailsModal: React.FC<StyleDetailsModalProps> = ({ style, onClose }) => {
  if (!style) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-gray-700">
        
        {/* Left Side: Preview */}
        <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center p-6 relative">
          <img 
            src={style.img_preview} 
            alt={style.style_name || 'Style Preview'} 
            className="max-h-[60vh] object-contain rounded-lg shadow-lg"
          />
           <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative overflow-y-auto">
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">{style.style_name || 'Untitled Style'}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wide">ID: {style.id}</span>
            {style.isGif === 1 && (
              <span className="px-3 py-1 bg-pink-600 text-xs font-semibold rounded-full flex items-center gap-1">
                <Film size={12} /> GIF
              </span>
            )}
            {style.ar8 === 1 && (
               <span className="px-3 py-1 bg-purple-600 text-xs font-semibold rounded-full flex items-center gap-1">
               <Camera size={12} /> AR Enabled
             </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-gray-700/50 p-4 rounded-xl">
                <div className="text-gray-400 text-xs mb-1">Pricing</div>
                <div className="text-xl font-bold text-green-400 flex items-center">
                  <DollarSign size={18} />
                  {style.price > 0 ? (style.price / 100).toFixed(2) : 'FREE'}
                </div>
             </div>
             <div className="bg-gray-700/50 p-4 rounded-xl">
                <div className="text-gray-400 text-xs mb-1">Resolution</div>
                <div className="text-xl font-bold text-white">
                  {style.resolution || 'Auto'}
                </div>
             </div>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers size={18} /> Configuration
            </h3>
            
            <div className="grid grid-cols-1 gap-2 bg-gray-700/30 p-4 rounded-lg">
              <DetailRow label="Client Render" value={style.isClient} />
              <DetailRow label="Keep BG Image" value={style.keepBgImg} />
              <DetailRow label="Ratio Cut" value={style.ratioCutStatus === 1} />
              <DetailRow label="Video Merge" value={style.videoMerge === 1} />
              <DetailRow label="Print Limit" value={`${style.freePrintCount} prints`} />
              <DetailRow label="Retry Limit" value={`${style.regenerationNum} times`} />
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
              Select Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string, value: boolean | string | number }) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
    <span>{label}</span>
    <span className={typeof value === 'boolean' ? (value ? 'text-green-400' : 'text-red-400') : 'text-white'}>
      {typeof value === 'boolean' ? (value ? <Check size={16} /> : <X size={16} />) : value}
    </span>
  </div>
);
