import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { 
  ZoomIn, 
  ZoomOut, 
  ShoppingCart, 
  ArrowLeft, 
  Upload, 
  Check, 
  Circle, 
  Heart, 
  Square, 
  Shield, 
  Type,
  Sparkles,
  Maximize2,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { getProduct } from './api';
import getCroppedImg from './cropUtils';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import TamilEngravingHelper from './TamilEngravingHelper';

// All 7 Supported Acrylic Shapes
const ALL_SHAPE_OPTIONS = [
  { id: 'heart', nameEn: 'Heart', nameTa: 'இதயம்', icon: Heart, cropShape: 'rect', aspect: 1, maskClass: 'shape-mask-heart' },
  { id: 'circle', nameEn: 'Circle', nameTa: 'வட்டம்', icon: Circle, cropShape: 'round', aspect: 1, maskClass: 'shape-mask-circle' },
  { id: 'square', nameEn: 'Square', nameTa: 'சதுரம்', icon: Square, cropShape: 'rect', aspect: 1, maskClass: 'shape-mask-square' },
  { id: 'shield', nameEn: 'TN Tag', nameTa: 'TN பலகை', icon: Shield, cropShape: 'rect', aspect: 0.88, maskClass: 'shape-mask-shield' },
  { id: 'oval', nameEn: 'Oval', nameTa: 'நீள்வட்டம்', icon: Circle, cropShape: 'round', aspect: 1.25, maskClass: 'shape-mask-oval' },
  { id: 'hexagon', nameEn: 'Hexagon', nameTa: 'அறுகோணம்', icon: Layers, cropShape: 'rect', aspect: 1, maskClass: 'shape-mask-hexagon' },
  { id: 'star', nameEn: 'Star', nameTa: 'நட்சத்திரம்', icon: Sparkles, cropShape: 'rect', aspect: 1, maskClass: 'shape-mask-star' },
];

// Frame Customization Options
const FRAME_SIZES = [
  { id: '4x6', name: '4 × 6 Inch', descEn: 'Desk / Tabletop', descTa: 'மேஜை அளவு', priceMod: 0 },
  { id: '5x7', name: '5 × 7 Inch', descEn: 'Living Room', descTa: 'வரவேற்பறை', priceMod: 60 },
  { id: '8x10', name: '8 × 10 Inch', descEn: 'Studio Portrait', descTa: 'பெரிய அளவு', priceMod: 150 },
  { id: 'a4', name: 'A4 Wall Frame', descEn: 'Wall Mount', descTa: 'சுவர் சட்டகம்', priceMod: 220 },
];

const FRAME_MATERIALS = [
  { id: 'walnut', nameEn: 'Royal Walnut Wood', nameTa: 'தேக்கு மர சட்டகம்', color: '#5c3a21', borderClass: 'border-amber-900' },
  { id: 'black', nameEn: 'Obsidian Matte Black', nameTa: 'கருப்பு சட்டகம்', color: '#1e293b', borderClass: 'border-slate-900' },
  { id: 'gold', nameEn: 'Champagne Gold Trim', nameTa: 'தங்க நிற விளிம்பு', color: '#d97706', borderClass: 'border-amber-600' },
  { id: 'white', nameEn: 'Porcelain Minimal White', nameTa: 'வெள்ளை சட்டகம்', color: '#f8fafc', borderClass: 'border-slate-300' },
];

export default function Customizer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const isTamil = i18n.language === 'ta';
  
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  // Keychain Shape & Engraving State
  const [selectedShape, setSelectedShape] = useState('heart');
  const [customText, setCustomText] = useState('Karthik & Priya ❤️');

  // Photo Frame Specific State
  const [frameOrientation, setFrameOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [frameSize, setFrameSize] = useState('5x7');
  const [frameMaterial, setFrameMaterial] = useState('walnut');
  const [frameMount, setFrameMount] = useState('stand'); // 'stand' | 'wall'
  
  // Photo & Cropper State
  const [side, setSide] = useState('front');
  const [images, setImages] = useState({ 
    front: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', 
    back: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' 
  });
  const [crops, setCrops] = useState({ front: { x: 0, y: 0 }, back: { x: 0, y: 0 } });
  const [zooms, setZooms] = useState({ front: 1, back: 1 });
  const [cropPixels, setCropPixels] = useState({ front: null, back: null });
  
  // Preview Modal & Flow
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [recentImages, setRecentImages] = useState([
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'
  ]);
  
  const [showPreview, setShowPreview] = useState(false);
  const [isCroppingPreview, setIsCroppingPreview] = useState(false);
  const [finalImages, setFinalImages] = useState({ front: null, back: null });
  const [quantity, setQuantity] = useState(1);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoadingProduct(true);
    getProduct(id)
      .then(response => {
        setProduct(response.data);
        setLoadingProduct(false);
      })
      .catch(() => {
        setProduct({
          id,
          name: 'South Indian Wedding Couple Keepsake',
          name_ta: 'பாரம்பரிய திருமண ஜோடி நினைவு பரிசு',
          product_type: id === '4' ? 'frame' : 'keychain',
          base_price: '249.00',
          offer_price: '149.00',
          description: 'Double-sided personalized acrylic keepsake with precision laser engraving.'
        });
        setLoadingProduct(false);
      });
  }, [id]);

  const isFrameProduct = product?.product_type === 'frame' || product?.name?.toLowerCase().includes('frame');

  const activeShapeConfig = ALL_SHAPE_OPTIONS.find(s => s.id === selectedShape) || ALL_SHAPE_OPTIONS[0];
  const activeFrameSize = FRAME_SIZES.find(s => s.id === frameSize) || FRAME_SIZES[0];
  const activeFrameMaterial = FRAME_MATERIALS.find(m => m.id === frameMaterial) || FRAME_MATERIALS[0];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const newImageUrl = reader.result;
        setRecentImages(prev => [newImageUrl, ...prev.filter(img => img !== newImageUrl)].slice(0, 6));
        setImages(prev => ({ ...prev, [side]: newImageUrl }));
        setIsPhotoModalOpen(false);
        addToast(`Uploaded photo! 📸`);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSelectRecent = (imgUrl) => {
    setImages(prev => ({ ...prev, [side]: imgUrl }));
    setIsPhotoModalOpen(false);
    addToast(`Selected photo!`);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropPixels(prev => ({ ...prev, [side]: croppedAreaPixels }));
  }, [side]);

  const handlePreviewClick = async () => {
    if (!images.front && !images.back) {
      alert('Please select or upload at least one photo for your custom gift.');
      setIsPhotoModalOpen(true);
      return;
    }

    setIsCroppingPreview(true);
    try {
      let frontFinal = null;
      let backFinal = null;

      const shapeToExport = isFrameProduct ? 'square' : selectedShape;

      if (images.front && cropPixels.front) {
        frontFinal = await getCroppedImg(images.front, cropPixels.front, shapeToExport);
      } else if (images.front) {
        frontFinal = images.front;
      }

      if (!isFrameProduct) {
        if (images.back && cropPixels.back) {
          backFinal = await getCroppedImg(images.back, cropPixels.back, shapeToExport);
        } else if (images.back) {
          backFinal = images.back;
        }
      }

      setFinalImages({ front: frontFinal, back: backFinal });
      setShowPreview(true);
    } catch (e) {
      console.error('Error generating preview', e);
      alert('Error rendering preview. Please try again.');
    } finally {
      setIsCroppingPreview(false);
    }
  };

  // Skeleton Loading Shimmer
  if (loadingProduct) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-6">
        <div className="h-8 w-48 rounded-xl skeleton-shimmer"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-40 rounded-2xl skeleton-shimmer"></div>
            <div className="h-32 rounded-2xl skeleton-shimmer"></div>
          </div>
          <div className="lg:col-span-7 h-96 rounded-2xl skeleton-shimmer"></div>
        </div>
      </div>
    );
  }

  const currentImage = images[side];
  const currentCrop = crops[side];
  const currentZoom = zooms[side];

  const baseOfferPrice = parseFloat(product?.offer_price || 149);
  const unitPrice = isFrameProduct ? baseOfferPrice + activeFrameSize.priceMod : baseOfferPrice;
  const totalPrice = (unitPrice * Math.max(1, parseInt(quantity) || 1)).toFixed(2);
  const prodTitle = isTamil ? (product.name_ta || product.name) : product.name;

  // Frame aspect ratio for Cropper
  const frameAspect = frameOrientation === 'portrait' ? 0.75 : 1.33;

  // ======================================================================
  // VIEW 1: PREVIEW BEFORE ADDING TO CART
  // ======================================================================
  if (showPreview) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowPreview(false)}
            className="btn-secondary py-2 px-3.5 text-xs font-bold"
          >
            <ArrowLeft size={15} /> {t('studio_back_btn')}
          </button>
          <span className="badge-pill bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Check size={13} /> {t('studio_render_ready')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Preview Render */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">{t('hero_preview_badge')}</h3>
                <p className="text-xs text-slate-500">
                  {isFrameProduct 
                    ? `${activeFrameSize.name} • ${activeFrameMaterial.nameEn} • ${frameMount.toUpperCase()}` 
                    : (isTamil ? activeShapeConfig.nameTa : activeShapeConfig.nameEn)}
                </p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-xs font-bold text-orange-600 hover:text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg"
              >
                {t('studio_edit_btn')}
              </button>
            </div>

            {/* Frame Render Preview */}
            {isFrameProduct ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                <div 
                  className={`p-3 bg-white shadow-xl rounded-xl border-8 ${activeFrameMaterial.borderClass} transition-all max-w-[280px] sm:max-w-[340px]`}
                  style={{ borderColor: activeFrameMaterial.color }}
                >
                  <div className={`overflow-hidden rounded-md bg-slate-100 flex items-center justify-center ${frameOrientation === 'portrait' ? 'aspect-[3/4] w-56' : 'aspect-[4/3] w-64'}`}>
                    {finalImages.front ? (
                      <img src={finalImages.front} alt="Frame Portrait" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Photo</span>
                    )}
                  </div>
                  {customText && (
                    <div className="mt-2 py-1 px-2 text-center bg-amber-50 rounded border border-amber-200">
                      <p className="text-[10px] font-black text-amber-950 truncate font-serif">"{customText}"</p>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-500 mt-3">
                  {frameMount === 'stand' ? '🪑 Tabletop Easel Stand Included' : '🔨 Wall Mounting Hook Included'}
                </p>
              </div>
            ) : (
              /* Keychain 2-Sided Render */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <img src="/keychain-hardware.png" alt="Ring" className="w-14 h-auto object-contain -mb-3 z-10" />
                  <div className={`w-32 h-32 bg-white shadow-sm border-2 border-white overflow-hidden flex items-center justify-center ${activeShapeConfig.maskClass}`}>
                    {finalImages.front ? (
                      <img src={finalImages.front} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">No Front Photo</span>
                    )}
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-slate-700">{t('studio_side_front')}</span>
                </div>

                <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <img src="/keychain-hardware.png" alt="Ring" className="w-14 h-auto object-contain -mb-3 z-10" />
                  <div className={`w-32 h-32 bg-white shadow-sm border-2 border-white overflow-hidden flex items-center justify-center ${activeShapeConfig.maskClass}`}>
                    {finalImages.back ? (
                      <img src={finalImages.back} alt="Back" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">No Back Photo</span>
                    )}
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-slate-700">{t('studio_side_back')}</span>
                </div>
              </div>
            )}

            {customText && !isFrameProduct && (
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs font-bold text-orange-950 flex items-center gap-2">
                <Type size={14} className="text-orange-600 shrink-0" />
                <span>Laser Engraving: <strong>"{customText}"</strong></span>
              </div>
            )}
          </div>

          {/* Right Pricing Card */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">{prodTitle}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {isFrameProduct ? 'Premium Handcrafted Frame • Clear Glass Front' : '2-Sided Acrylic • High-Gloss UV Coated'}
              </p>
            </div>

            <div className="border-t border-b border-slate-100 py-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('cart_items_subtotal')}</span>
                <span className="font-bold text-slate-900">₹{unitPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping across TN:</span>
                <span className="font-bold text-emerald-600">{t('cart_shipping_free')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t">
                <span>{t('cart_total_payable')}</span>
                <span className="text-xl text-orange-600">₹{totalPrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-600">{t('studio_quantity')}</label>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, parseInt(prev) - 1))}
                    className="px-3 py-1 font-bold text-slate-600 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center font-bold text-slate-900 outline-none text-xs"
                  />
                  <button 
                    onClick={() => setQuantity(prev => (parseInt(prev) || 1) + 1)}
                    className="px-3 py-1 font-bold text-slate-600 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart({
                    product: { ...product, name: prodTitle, offer_price: unitPrice },
                    shape: isFrameProduct ? 'frame' : selectedShape,
                    frameSize: isFrameProduct ? activeFrameSize.name : null,
                    frameMaterial: isFrameProduct ? activeFrameMaterial.nameEn : null,
                    customText: customText,
                    finalImages,
                    quantity: parseInt(quantity) || 1
                  });
                  addToast(`Added ${quantity}x to Cart! 🛒`);
                  navigate('/cart');
                }}
                className="btn-accent w-full py-3.5 text-sm font-black shadow-md"
              >
                <ShoppingCart size={16} />
                <span>{t('studio_add_cart')} (₹{totalPrice})</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ======================================================================
  // VIEW 2: LIVE DESIGN STUDIO (Mobile Visual-First Ordering)
  // ======================================================================
  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Studio Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('studio_step_badge')}</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {prodTitle}
          </h1>
        </div>

        <button 
          onClick={handlePreviewClick}
          disabled={isCroppingPreview}
          className="btn-accent px-5 py-2 text-xs sm:text-sm font-black shadow-md w-full sm:w-auto"
        >
          {isCroppingPreview ? 'Rendering...' : t('studio_preview_btn')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* RIGHT CANVAS: Visual First on Mobile (order-1 on mobile, order-2 on lg) */}
        <div className="order-1 lg:order-2 lg:col-span-7 glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-600">
              {isFrameProduct ? 'Live Photo Frame Studio' : (
                <>{t('studio_editing_badge')} <strong className="text-orange-600">{side === 'front' ? t('studio_side_front') : t('studio_side_back')}</strong></>
              )}
            </span>
            <button 
              onClick={() => setIsPhotoModalOpen(true)}
              className="btn-secondary py-1 px-3 text-xs font-bold"
            >
              <Upload size={13} /> {t('studio_change_photo')}
            </button>
          </div>

          {/* Fluid Responsive Canvas Box */}
          <div className="w-full bg-slate-50 rounded-2xl min-h-[320px] sm:min-h-[380px] flex flex-col items-center justify-center relative p-4 border border-slate-200/80 overflow-hidden">
            
            {!isFrameProduct && (
              <img src="/keychain-hardware.png" alt="Hardware" className="w-14 sm:w-16 h-auto object-contain -mb-4 sm:-mb-5 z-20" />
            )}

            {/* Canvas Mask Area */}
            <div 
              className={`relative bg-white shadow-md flex items-center justify-center z-10 transition-all duration-200 ${
                isFrameProduct ? 'rounded-xl border-4' : activeShapeConfig.maskClass
              }`}
              style={{ 
                width: isFrameProduct ? (frameOrientation === 'portrait' ? '200px' : '260px') : '220px', 
                height: isFrameProduct ? (frameOrientation === 'portrait' ? '260px' : '195px') : '220px',
                borderColor: isFrameProduct ? activeFrameMaterial.color : undefined
              }}
            >
              {currentImage ? (
                <Cropper
                  image={currentImage}
                  crop={currentCrop}
                  zoom={currentZoom}
                  aspect={isFrameProduct ? frameAspect : activeShapeConfig.aspect}
                  cropShape={isFrameProduct ? 'rect' : activeShapeConfig.cropShape}
                  showGrid={false}
                  onCropChange={(newCrop) => setCrops(prev => ({ ...prev, [side]: newCrop }))}
                  onCropComplete={onCropComplete}
                  onZoomChange={(newZoom) => setZooms(prev => ({ ...prev, [side]: newZoom }))}
                  objectFit="vertical-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <button 
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="btn-accent py-2 px-4 text-xs font-bold"
                  >
                    {t('studio_upload_btn')}
                  </button>
                </div>
              )}
            </div>

            {/* Zoom Slider */}
            {currentImage && (
              <div className="mt-4 z-20 flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-xs border border-slate-200 text-xs">
                <button onClick={() => setZooms(prev => ({ ...prev, [side]: Math.max(1, prev[side] - 0.2) }))}>
                  <ZoomOut size={14} className="text-slate-500" />
                </button>
                <input
                  type="range"
                  value={currentZoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZooms(prev => ({ ...prev, [side]: Number(e.target.value) }))}
                  className="w-24 sm:w-28 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <button onClick={() => setZooms(prev => ({ ...prev, [side]: Math.min(3, prev[side] + 0.2) }))}>
                  <ZoomIn size={14} className="text-slate-500" />
                </button>
              </div>
            )}

          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{t('studio_starting_from')}</p>
              <p className="text-xl font-black text-slate-900">₹{unitPrice}</p>
            </div>
            <button 
              onClick={handlePreviewClick}
              disabled={isCroppingPreview}
              className="btn-accent px-5 py-2.5 text-xs font-black shadow-xs"
            >
              {t('studio_preview_btn')}
            </button>
          </div>

        </div>

        {/* LEFT CONTROLS: Options below canvas on mobile (order-2 on mobile, order-1 on lg) */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-4">
          
          {/* A. If Photo Frame Product */}
          {isFrameProduct ? (
            <>
              {/* Frame Size */}
              <div className="glass-card rounded-2xl p-4 space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  1. Frame Size & Orientation
                </label>
                
                {/* Orientation Toggle */}
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <button
                    onClick={() => setFrameOrientation('portrait')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      frameOrientation === 'portrait' ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Portrait (செங்குத்து)
                  </button>
                  <button
                    onClick={() => setFrameOrientation('landscape')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      frameOrientation === 'landscape' ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Landscape (கிடைமட்டம்)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {FRAME_SIZES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setFrameSize(s.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                        frameSize === s.id ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <p className="font-bold">{s.name}</p>
                      <span className="text-[10px] text-slate-400 block">{isTamil ? s.descTa : s.descEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Material */}
              <div className="glass-card rounded-2xl p-4 space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  2. Frame Border Material
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FRAME_MATERIALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFrameMaterial(m.id)}
                      className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition-all text-xs ${
                        frameMaterial === m.id ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border" style={{ backgroundColor: m.color }}></span>
                      <span className="truncate">{isTamil ? m.nameTa : m.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stand Style */}
              <div className="glass-card rounded-2xl p-4 space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  3. Display Stand / Mount
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFrameMount('stand')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      frameMount === 'stand' ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Tabletop Easel Stand
                  </button>
                  <button
                    onClick={() => setFrameMount('wall')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      frameMount === 'wall' ? 'bg-orange-50 border-orange-600 text-orange-950 font-black' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Wall Hanging Hook
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* B. If Keychain: All 7 Shapes Supported */
            <>
              {/* Step 1: Shape Selector (7 Shapes) */}
              <div className="glass-card rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    {t('studio_shape_label')}
                  </label>
                  <span className="text-[10px] font-bold text-orange-600">7 Shapes Available</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_SHAPE_OPTIONS.map(shape => {
                    const Icon = shape.icon;
                    const isSelected = selectedShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`p-2 rounded-xl flex items-center gap-1.5 border transition-all text-xs font-bold ${
                          isSelected 
                            ? 'bg-orange-50 border-orange-500 text-orange-900 shadow-xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={14} className={isSelected ? 'text-orange-600' : 'text-slate-400'} />
                        <span className="truncate">{isTamil ? shape.nameTa : shape.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Surface Side */}
              <div className="glass-card rounded-2xl p-4 space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  {t('studio_side_label')}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSide('front')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      side === 'front' 
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t('studio_side_front')}</span>
                    {images.front && <Check size={13} className="text-white" />}
                  </button>

                  <button 
                    onClick={() => setSide('back')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      side === 'back' 
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t('studio_side_back')}</span>
                    {images.back && <Check size={13} className="text-white" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Laser Engraving / Dedication Plaque */}
          <div className="glass-card rounded-2xl p-4 space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Type size={14} className="text-orange-600" />
              {isFrameProduct ? 'Engraved Plaque Text (Optional)' : t('studio_engraving_label')}
            </label>

            <input 
              type="text" 
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={isFrameProduct ? "e.g. 25th Wedding Anniversary (24.08.2024)" : t('studio_engraving_placeholder')}
              maxLength={50}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-orange-500 font-bold bg-white"
            />

            <TamilEngravingHelper 
              customText={customText}
              setCustomText={setCustomText}
            />
          </div>

        </div>

      </div>

      {/* Photo Upload Modal (With Max-Height for Landscape Mobile Screens) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 sm:p-6 space-y-4 border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                {t('studio_upload_btn')} {!isFrameProduct && `(${side === 'front' ? t('studio_side_front') : t('studio_side_back')})`}
              </h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-slate-400 font-bold text-xs p-1">✕</button>
            </div>

            <button 
              onClick={() => fileInputRef.current.click()}
              className="btn-accent w-full py-3 text-xs font-bold shadow-xs"
            >
              <Upload size={14} /> {t('studio_upload_btn')}
            </button>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">Sample Portrait Photos</p>
              <div className="grid grid-cols-4 gap-2">
                {recentImages.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleSelectRecent(imgUrl)}
                    className="cursor-pointer aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-orange-600 transition-all"
                  >
                    <img src={imgUrl} alt="Sample" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      )}

    </div>
  );
}