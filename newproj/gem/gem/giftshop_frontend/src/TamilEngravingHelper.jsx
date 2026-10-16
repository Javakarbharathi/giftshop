import { useState } from 'react';
import { Type, Sparkles, Heart, Check } from 'lucide-react';

const TAMIL_WORD_PRESETS = [
  { label: 'அன்புடன் (With Love)', text: 'அன்புடன்' },
  { label: 'குடும்பம் (Family)', text: 'என் இனிய குடும்பம்' },
  { label: 'அம்மா அப்பா (Mom Dad)', text: 'அம்மா ❤️ அப்பா' },
  { label: 'இனிய திருமண நாள் (Happy Anniversary)', text: 'இனிய திருமண நாள் வாழ்த்துகள்' },
  { label: 'என் உயிர் (My Soul)', text: 'என் உயிர் நீதானே' },
  { label: 'நட்பு (Friendship)', text: 'என்றும் உன் நட்புடன்' },
  { label: 'ஓம் முருகா (Lord Murugan)', text: 'வெற்றிவேல் முருகனுக்கு அரோகரா 🕉️' },
  { label: 'TN 36 (Erode/Gobi)', text: 'TN 36 - GOBI' },
  { label: 'TN 38 (Coimbatore)', text: 'TN 38 - CBE' },
  { label: 'TN 01 (Chennai)', text: 'TN 01 - CHENNAI' }
];

const AUSPICIOUS_SYMBOLS = ['🕉️', '🪔', '🦚', '❤️', '🧿', '✨', '👑', '⭐', '🔱'];

export default function TamilEngravingHelper({ customText, setCustomText, onSelectPreset }) {
  const [activeTab, setActiveTab] = useState('tamil');

  const appendSymbol = (sym) => {
    setCustomText(prev => `${prev} ${sym}`.trim());
  };

  const selectWord = (word) => {
    setCustomText(word);
    if (onSelectPreset) onSelectPreset(word);
  };

  return (
    <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 rounded-2xl p-4 border border-orange-200/90 space-y-3">
      
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
          <Type size={14} className="text-orange-600" />
          தமிழ் & English Engraving Helper
        </label>
        <span className="badge-pill bg-orange-200/80 text-orange-900 text-[10px]">
          Tamil Nadu Special
        </span>
      </div>

      {/* Tamil Word Quick Select Chips */}
      <div>
        <p className="text-[11px] font-bold text-slate-600 mb-1.5">
          பிரபலமான தமிழ் வாசகங்கள் (Popular Tamil Phrases):
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {TAMIL_WORD_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectWord(preset.text)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                customText === preset.text
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-slate-700 border-orange-200 hover:bg-orange-100/70 hover:border-orange-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auspicious Symbols */}
      <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600">மங்களகரமான குறியீடுகள் (Symbols):</span>
        <div className="flex items-center gap-1">
          {AUSPICIOUS_SYMBOLS.map((sym, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => appendSymbol(sym)}
              className="w-7 h-7 bg-white hover:bg-orange-100 rounded-lg border border-orange-200 flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-110 active:scale-95"
              title={`Add ${sym}`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
