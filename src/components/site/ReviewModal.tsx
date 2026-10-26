import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, X, CheckCircle2, Sparkles, MapPin, ThumbsUp } from "lucide-react";
import { saveNewReview, CustomerReview } from "@/lib/reviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (review: CustomerReview) => void;
}

export function ReviewModal({ isOpen, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("Amritsar");
  const [categoryVisited, setCategoryVisited] = useState<CustomerReview["categoryVisited"]>(
    "Festive & Ethnic"
  );
  const [reviewText, setReviewText] = useState<string>("");
  const [recommendStore, setRecommendStore] = useState<boolean>(true);
  const [verifiedPurchase, setVerifiedPurchase] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSubmitted(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = saveNewReview({
        name: name.trim(),
        city: city.trim() || "Amritsar",
        rating,
        text: reviewText.trim(),
        categoryVisited,
        recommendStore,
        verifiedPurchase,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(created);
      }

      setTimeout(() => {
        onClose();
        // Reset form
        setName("");
        setReviewText("");
        setRating(5);
      }, 1600);
    }, 400);
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return "Loved it! Excellent experience (5.0)";
      case 4:
        return "Very good shopping trip (4.0)";
      case 3:
        return "Average experience (3.0)";
      case 2:
        return "Could be improved (2.0)";
      case 1:
        return "Disappointing (1.0)";
      default:
        return "Select your rating";
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3.5 sm:p-6 backdrop-blur-sm animate-fade-up overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full my-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-stone-900">
              Dhanwaad Ji!
            </h3>
            <p className="text-stone-600 text-sm mt-2 max-w-xs mx-auto">
              Your verified review for Pantaloons VR Ambarsar has been recorded and posted in real time.
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-amber-500">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold tracking-wider uppercase mb-2 border border-amber-200/80">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Share Store Experience
              </div>
              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-stone-900">
                Write a Review
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Help other shoppers in Amritsar discover the best fabrics, fitting, and service at VR Ambarsar Mall.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Interactive Selector */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-2">
                  Your Overall Rating *
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "text-amber-500 fill-amber-500"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-stone-700 mt-2">
                  {getRatingLabel(hoverRating || rating)}
                </p>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navjot Kaur"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Locality / City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Ranjit Avenue, Amritsar"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 pl-8 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                    />
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Section Visited */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Department or Collection Visited
                </label>
                <select
                  value={categoryVisited}
                  onChange={(e) =>
                    setCategoryVisited(e.target.value as CustomerReview["categoryVisited"])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-white"
                >
                  <option value="Festive & Ethnic">Festive & Ethnic Wear (Kurtas, Sarees, Lehengas)</option>
                  <option value="Casual & Western">Casual & Western Fashion (Denim, Tops, Shirts)</option>
                  <option value="Menswear">Menswear (Suits, Formals, Nehru Jackets)</option>
                  <option value="Kids Fashion">Kids & Toddler Wear</option>
                  <option value="Overall Store & Service">Overall Store Ambience & Customer Care</option>
                </select>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Your Detailed Review *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention fabric quality, trial room experience, staff friendliness, billing speed, or store parking..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 resize-none"
                />
              </div>

              {/* Recommendations & Verified Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={recommendStore}
                    onChange={(e) => setRecommendStore(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900 accent-stone-900"
                  />
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>I recommend this store to friends</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                  <input
                    type="checkbox"
                    checked={verifiedPurchase}
                    onChange={(e) => setVerifiedPurchase(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900 accent-stone-900"
                  />
                  <span>Verified In-Store Shopper</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Publishing Review..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" /> Publish Verified Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
