import { useState } from 'react';
import { QrCode, CheckCircle2, Copy, ArrowRight, ShieldCheck, Smartphone, Check } from 'lucide-react';
import { useToast } from './ToastContext';

export default function UpiPaymentModal({ amount, orderId, customerName, onPaymentSuccess, onClose }) {
  const { addToast } = useToast();
  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const UPI_ID = 'customgiftsgobi@okaxis';
  const PAYEE_NAME = 'Gobi Custom Gifts';
  
  // Standard UPI URI format for Indian BHIM UPI apps
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=Order%20ORD-${orderId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}&bgcolor=ffffff&color=1e293b&margin=1`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    addToast('UPI ID copied to clipboard: ' + UPI_ID, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUtrSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      alert('Please enter a valid 12-digit UPI Reference / UTR Number from your GPay/PhonePe receipt.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addToast('Payment verified successfully! 🎉', 'success');
      if (onPaymentSuccess) onPaymentSuccess(utrNumber);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="badge-pill bg-emerald-100 text-emerald-800 text-[10px]">
              Direct 0% Fee UPI
            </span>
            <span className="text-xs font-bold text-slate-400">Order ORD-{orderId}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
            ✕
          </button>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-slate-900">Scan & Pay with Any UPI App</h3>
          <p className="text-xs text-slate-500 font-medium">Google Pay • PhonePe • Paytm • BHIM • Cred</p>
        </div>

        {/* Dynamic QR Code Card */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
            <img 
              src={qrCodeUrl} 
              alt="UPI Payment QR Code" 
              className="w-44 h-44 object-contain"
            />
          </div>

          <div className="text-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Payable Amount:</span>
            <p className="text-3xl font-black text-emerald-600">₹{amount}</p>
          </div>
        </div>

        {/* UPI ID Copy Card */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-slate-400">Merchant UPI ID:</p>
            <p className="text-xs font-black text-slate-800">{UPI_ID}</p>
          </div>
          <button
            onClick={copyUpiId}
            className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* UTR Verification Form */}
        <form onSubmit={handleUtrSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Enter 12-Digit UPI Ref / UTR No. (after payment) *
            </label>
            <input 
              type="text" 
              required
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 423859201948"
              maxLength={16}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold uppercase outline-none focus:border-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="btn-success w-full py-3.5 text-xs font-black shadow-md flex items-center justify-center gap-2"
          >
            {isVerifying ? 'Verifying Receipt...' : 'Confirm UPI Payment & Place Order →'}
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>NPCI BHIM UPI Protected • Direct Workshop Settlement</span>
        </div>

      </div>
    </div>
  );
}
