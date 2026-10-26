import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { Calendar, User, Phone, Mail, Sparkles, CheckCircle2, X, Store, Lock, AlertCircle } from "lucide-react";
import { saveNewBooking } from "@/lib/analytics";
import { STORE } from "@/lib/store";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function BookingModal({ isOpen, onClose, defaultService }: BookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("Jaspreet Singh");
  const [phone, setPhone] = useState("+91 98765-43210");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(defaultService || "Festive & Bridal Wardrobe VIP Consultation");
  const [date, setDate] = useState("2026-10-26");
  const [timeSlot, setTimeSlot] = useState("03:00 PM - 04:30 PM");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{ id: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ (Please enter your name)");
      return;
    }
    if (!phone.trim()) {
      setFormError("ਕਿਰਪਾ ਕਰਕੇ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ (Please enter your phone number)");
      return;
    }

    const newBooking = saveNewBooking({
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      service,
      date,
      timeSlot,
      guests,
      notes: notes.trim() || undefined,
    });

    setSubmittedBooking({ id: newBooking.id });
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setFormError(null);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in"
      onClick={handleReset}
    >
      <div 
        className="relative w-full max-w-lg my-auto rounded-2xl sm:rounded-3xl bg-[#FAF8F4] border border-[#C5A880]/40 shadow-2xl p-5 sm:p-7 text-stone-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A67C52] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              Pantaloons VR Mall Amritsar
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedBooking ? (
          <div className="py-4 text-center space-y-4 animate-scale-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] text-[#A67C52] uppercase">
              ਬੁਕਿੰਗ ਸਫਲਤਾਪੂਰਵਕ ਹੋ ਗਈ (Booking Confirmed)
            </span>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              ਧੰਨਵਾਦ, {name}!
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              ਤੁਹਾਡੀ ਬੁਕਿੰਗ <strong className="text-stone-900">#{submittedBooking.id}</strong> ਸਿਸਟਮ ਵਿੱਚ ਦਰਜ ਹੋ ਗਈ ਹੈ ਅਤੇ ਐਡਮਿਨ ਪੈਨਲ ਵਿੱਚ ਲਾਈਵ ਦਿਖਾਈ ਦੇ ਰਹੀ ਹੈ।
            </p>

            <div className="rounded-xl border border-stone-200 bg-white p-4 text-left text-xs space-y-2 max-w-sm mx-auto shadow-sm">
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Service:</span>
                <span className="font-semibold text-stone-800 text-right">{service}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-semibold text-stone-800">{date} · {timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-semibold text-stone-800">{guests} Guest{guests > 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/admin"
                onClick={handleReset}
                className="w-full py-3 rounded-full btn-primary font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Admin Panel to View This Booking</span>
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-full border border-stone-300 text-xs font-medium uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="font-display text-xl sm:text-2xl tracking-tight text-stone-900 font-normal">
                Book a VIP Styling & Store Visit
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Enter your details to reserve your priority fitting room & stylist consultation.
              </p>
            </div>

            {formError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name (ਕਸਟਮਰ ਦਾ ਨਾਮ) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. Jaspreet Singh"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765-43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Select Experience or Service *
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition cursor-pointer"
                >
                  <option value="Festive & Bridal Wardrobe VIP Consultation">Festive & Bridal Wardrobe VIP Consultation</option>
                  <option value="Men's Kurta & Formal Suit Personal Fitting">Men's Kurta & Formal Suit Personal Fitting</option>
                  <option value="Family Weekend Shopping & Stylist Assist">Family Weekend Shopping & Stylist Assist</option>
                  <option value="Western & Casual Wear Season Fitting">Western & Casual Wear Season Fitting</option>
                  <option value="Pantaloons Gift Voucher & Corporate Purchase">Pantaloons Gift Voucher & Corporate Purchase</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    min="2026-10-24"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-stone-300 bg-white text-[11px] focus:border-stone-900 outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-stone-300 bg-white text-[11px] focus:border-stone-900 outline-none cursor-pointer"
                  >
                    <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM</option>
                    <option value="01:30 PM - 03:00 PM">01:30 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM</option>
                    <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
                    <option value="07:00 PM - 08:30 PM">07:00 PM - 08:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl border border-stone-300 bg-white text-[11px] focus:border-stone-900 outline-none cursor-pointer"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People</option>
                    <option value={5}>5+ Group</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Special Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Looking for Punjabi bridal suits or sherwani size 40"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:border-stone-900 outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full btn-primary font-semibold text-xs tracking-[0.18em] uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Confirm Store Appointment
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200">
                <span>VR Ambarsar Mall · Amritsar</span>
                <Link
                  to="/admin"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[#A67C52] hover:underline font-medium"
                >
                  <Lock className="w-3 h-3" />
                  Admin Panel (Pass: 123456)
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
