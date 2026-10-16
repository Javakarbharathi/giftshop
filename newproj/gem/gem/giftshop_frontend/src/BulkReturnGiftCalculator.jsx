import { useState } from 'react';
import { Gift, Calculator, Sparkles, MessageCircle, Check, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OCCASIONS = [
  { id: 'wedding', nameEn: 'Wedding & Muhurtham', nameTa: 'திருமணம் (Wedding / Muhurtham)', basePerkEn: 'Free Custom Name & Date Tags', basePerkTa: 'இலவச மணமக்கள் பெயர் அட்டை' },
  { id: 'ear-piercing', nameEn: 'Ear Piercing Ceremony', nameTa: 'காதுகுத்து (Ear Piercing)', basePerkEn: 'Free Yellow Silk Pouches', basePerkTa: 'இலவச மஞ்சள் தாம்பூலப் பை' },
  { id: 'housewarming', nameEn: 'Housewarming Ceremony', nameTa: 'கிரகப்பிரவேசம் (Housewarming)', basePerkEn: 'Auspicious Kalasam Tag', basePerkTa: 'மங்கல கலச அட்டை' },
  { id: 'birthday', nameEn: 'Baby Birthday & Naming', nameTa: 'பிறந்தநாள் (Baby Birthday / Naming)', basePerkEn: 'Custom Photo Border', basePerkTa: 'குழந்தை புகைப்பட அட்டை' },
  { id: 'temple-trust', nameEn: 'Temple Fest & Trust', nameTa: 'கோயில் திருவிழா (Temple Fest)', basePerkEn: 'Deity Laser Engraving', basePerkTa: 'சாமி படம் லேசர் பொறிப்பு' }
];

export default function BulkReturnGiftCalculator() {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(50);
  const [occasion, setOccasion] = useState('wedding');
  const [shape, setShape] = useState('heart');

  const isTamil = i18n.language === 'ta';

  const getBulkUnitPrice = (qty) => {
    if (qty >= 500) return 99;
    if (qty >= 250) return 109;
    if (qty >= 100) return 119;
    if (qty >= 50) return 129;
    return 149;
  };

  const unitPrice = getBulkUnitPrice(quantity);
  const totalAmount = unitPrice * quantity;
  const standardPrice = 199 * quantity;
  const totalSavings = standardPrice - totalAmount;

  const activeOccasionObj = OCCASIONS.find(o => o.id === occasion) || OCCASIONS[0];
  const occName = isTamil ? activeOccasionObj.nameTa : activeOccasionObj.nameEn;

  const whatsappMessage = encodeURIComponent(
    `Hello TN36 Custom Gifts! I would like to place a Bulk Return Gift order:\n\n` +
    `• Occasion: ${occName}\n` +
    `• Quantity: ${quantity} pieces\n` +
    `• Shape: ${shape.toUpperCase()}\n` +
    `• Estimated Total: ₹${totalAmount} (@ ₹${unitPrice}/pc)\n\n` +
    `Please share the fabrication timeline and sample proof!`
  );

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="badge-pill bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200 mb-1">
            <Sparkles size={12} className="text-orange-600" /> {t('bulk_calc_badge')}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('bulk_calc_title')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t('bulk_calc_subtitle')}
          </p>
        </div>

        <span className="badge-pill bg-emerald-50 text-emerald-800 text-xs py-1.5 px-3 border border-emerald-200">
          Wholesale Factory Price
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Occasion Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              {t('bulk_calc_occasion')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OCCASIONS.map(occ => {
                const isSelected = occasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="truncate">{isTamil ? occ.nameTa : occ.nameEn}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isTamil ? occ.basePerkTa : occ.basePerkEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Quantity Preset */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                {t('bulk_calc_qty')}
              </label>
              <span className="text-lg font-black text-orange-600">{quantity} Pieces</span>
            </div>

            <div className="flex gap-2">
              {[25, 50, 100, 250, 500].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantity(qty)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-black border transition-all ${
                    quantity === qty
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>

            <input 
              type="range"
              min="15"
              max="1000"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* 3. Shape */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              {t('bulk_calc_shape')}
            </label>
            <div className="flex gap-2">
              {['heart', 'circle', 'square', 'shield'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                    shape === s
                      ? 'bg-orange-50 border-orange-500 text-orange-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Output Price Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-5 shadow-lg border border-slate-800">
          <div>
            <span className="badge-pill bg-amber-400/20 text-amber-300 text-[10px] mb-2 font-bold">
              {t('bulk_calc_estimate')}
            </span>
            <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Total</p>
            <p className="text-3xl font-black text-amber-400 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-300 mt-1">
              Price: <strong className="text-white">₹{unitPrice} / piece</strong> (Retail: ₹199)
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-emerald-400 font-bold flex justify-between items-center">
            <span>{t('bulk_calc_savings')}</span>
            <span className="text-sm font-black">₹{totalSavings.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-3">
            <p className="flex items-center gap-2"><Check size={13} className="text-emerald-400" /> Free Custom Name & Date Engraving</p>
            <p className="flex items-center gap-2"><Check size={13} className="text-emerald-400" /> Free Individual Yellow Thamboolam Pouches</p>
            <p className="flex items-center gap-2"><Truck size={13} className="text-blue-400" /> Free Courier across Tamil Nadu</p>
          </div>

          <div className="pt-2">
            <a 
              href={`https://wa.me/916379979364?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              <span>{t('bulk_calc_whatsapp_btn')}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
