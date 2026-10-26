import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Store,
  Phone,
  Sparkles,
  CreditCard,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  placeNewOrder,
  type CartItem,
  type Order,
} from "@/lib/orders";
import { STORE, images } from "@/lib/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");

  // Delivery & Customer Form
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Amritsar");
  const [pincode, setPincode] = useState("143001");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "store_pay">("cod");

  // Placed Order state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const loadCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCart();
      document.body.style.overflow = "hidden";
      if (step === "success") {
        setStep("cart");
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = subtotal >= 2999 ? 300 : 0;
  const deliveryFee = deliveryType === "pickup" || subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleQtyChange = (itemId: string, newQty: number) => {
    updateCartQuantity(itemId, newQty);
  };

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName || !phone) return;

    const newOrder = placeNewOrder({
      customerName,
      phone,
      email: email || undefined,
      deliveryType,
      address:
        deliveryType === "delivery"
          ? address
          : "VR Ambarsar Mall - Store Pickup (Lower Ground Floor)",
      city,
      pincode,
      landmark: landmark || undefined,
      items: items.map((i) => ({
        productId: i.product?.id || "prod-item",
        productName: i.product?.name || "Pantaloons Apparel",
        categoryLabel: i.product?.categoryLabel || "Fashion",
        image: i.product?.image || "",
        price: i.product?.price || 0,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod,
      notes: notes || undefined,
    });

    setPlacedOrder(newOrder);
    setStep("success");
    setItems([]);
  };

  const handleWhatsAppShare = () => {
    if (!placedOrder) return;
    const itemsList = placedOrder.items
      .map(
        (i) =>
          `• ${i.productName} (${i.size}) x${i.quantity} - ₹${i.price * i.quantity}`
      )
      .join("%0A");

    const message = `*Pantaloons Amritsar Order Confirmation*%0A%0A*Order ID:* ${placedOrder.id}%0A*Customer:* ${placedOrder.customerName}%0A*Phone:* ${placedOrder.phone}%0A*Delivery Type:* ${
      placedOrder.deliveryType === "delivery"
        ? "Home Delivery (" + placedOrder.address + ")"
        : "Store Pickup at VR Ambarsar Mall"
    }%0A%0A*Items:*%0A${itemsList}%0A%0A*Total Amount:* ₹${placedOrder.total}%0A*Payment:* ${placedOrder.paymentMethod.toUpperCase()}%0A%0APlease confirm my order. Thank you!`;

    window.open(`https://wa.me/918047138076?text=${message}`, "_blank");
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      className="fixed inset-0 z-[100] flex justify-end bg-black/65 backdrop-blur-sm"
      style={{ animation: "fade-in 0.22s ease-out forwards" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md lg:max-w-lg bg-white h-screen h-[100dvh] max-h-screen shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200 z-[101]"
        style={{ animation: "slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= DRAWER TOP HEADER ================= */}
        <div className="shrink-0 p-5 border-b border-stone-200 bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-normal uppercase tracking-wider text-stone-900">
                  {step === "cart" && "Shopping Bag"}
                  {step === "checkout" && "Checkout & Delivery"}
                  {step === "success" && "Order Confirmed!"}
                </h3>
                {step === "cart" && items.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Pantaloons · VR Ambarsar Mall Branch
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === "cart" && items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to empty your shopping bag?")) {
                    clearCart();
                  }
                }}
                className="text-[11px] text-stone-400 hover:text-red-600 transition-colors px-2 py-1"
                title="Clear entire bag"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close Shopping Bag"
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="shrink-0 px-6 py-2.5 bg-white border-b border-stone-100 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-stone-400">
          <div className={`flex items-center gap-1.5 ${step === "cart" ? "text-stone-900 font-bold" : "text-emerald-700"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === "cart" ? "bg-stone-900 text-white" : "bg-emerald-100 text-emerald-800"}`}>
              {step !== "cart" ? "✓" : "1"}
            </span>
            <span>1. Review Bag</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <div className={`flex items-center gap-1.5 ${step === "checkout" ? "text-stone-900 font-bold" : step === "success" ? "text-emerald-700" : "text-stone-400"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === "checkout" ? "bg-stone-900 text-white" : step === "success" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
              {step === "success" ? "✓" : "2"}
            </span>
            <span>2. Delivery & Pay</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <div className={`flex items-center gap-1.5 ${step === "success" ? "text-emerald-700 font-bold" : "text-stone-400"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === "success" ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"}`}>
              3
            </span>
            <span>3. Placed</span>
          </div>
        </div>

        {/* ================= STEP 1: CART ITEMS ================= */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
              {items.length === 0 ? (
                <div className="py-16 sm:py-20 text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 mx-auto flex items-center justify-center text-accent mb-4 border border-amber-500/20">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <h4 className="font-display text-2xl uppercase tracking-wider text-stone-900">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-stone-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    Explore our latest seasonal styles, festive ensembles, daily wear, and denim to add items to your bag.
                  </p>

                  <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                      onClick={() => {
                        onClose();
                        if (typeof window !== "undefined") {
                          window.location.href = "/collections";
                        }
                      }}
                      className="w-full max-w-xs py-3 rounded-full btn-primary text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Explore In-Store Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-4 border-t border-stone-200 w-full max-w-xs">
                      <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
                        Quick Category Shortcuts
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            onClose();
                            if (typeof window !== "undefined") window.location.href = "/women";
                          }}
                          className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                        >
                          👗 Women's
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            if (typeof window !== "undefined") window.location.href = "/men";
                          }}
                          className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                        >
                          👔 Men's
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            if (typeof window !== "undefined") window.location.href = "/kids";
                          }}
                          className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                        >
                          🧒 Kids'
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            if (typeof window !== "undefined") window.location.href = "/collections?category=festive";
                          }}
                          className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium transition-colors"
                        >
                          ✨ Festive '26
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Delivery Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("delivery")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        deliveryType === "delivery"
                          ? "bg-white text-stone-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Home Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        deliveryType === "pickup"
                          ? "bg-white text-stone-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Store Pickup</span>
                    </button>
                  </div>

                  {/* Free delivery progress banner */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-accent text-xs">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        {subtotal >= 999
                          ? "🎉 FREE Home Delivery unlocked for Amritsar!"
                          : `Add ₹${999 - subtotal} more for Free Home Delivery!`}
                      </span>
                    </div>
                    {subtotal >= 2999 && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✨ ₹300 Festive discount applied automatically!
                      </p>
                    )}
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {items.map((item) => {
                      const prod = item.product || {};
                      const itemImg = prod.image || images.festive;
                      const itemPrice = prod.price || 0;
                      const itemName = prod.name || "Pantaloons Apparel";
                      const itemCat = prod.categoryLabel || "Fashion";

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 shadow-sm flex items-start gap-3.5 transition-all"
                        >
                          <img
                            src={itemImg}
                            alt={itemName}
                            className="w-16 h-20 object-cover object-top rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = images.festive;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">
                                {itemName}
                              </h4>
                              <button
                                onClick={() => handleRemove(item.id)}
                                title="Remove item"
                                className="text-stone-400 hover:text-red-600 p-0.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-accent font-medium mt-0.5">
                              {itemCat}
                            </p>

                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 font-mono font-medium text-stone-800">
                                Size: {item.size}
                              </span>
                              {item.color && (
                                <span className="truncate">Shade: {item.color}</span>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                              <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                  className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1 text-xs font-semibold font-mono text-stone-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                  className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="font-bold text-stone-900 text-sm">
                                ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer Bar */}
            {items.length > 0 && (
              <div className="shrink-0 p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-3 shadow-lg">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Festive Promotion Discount</span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee ({deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"})</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="text-base text-accent">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="w-full py-4 rounded-full btn-primary font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ================= STEP 2: CHECKOUT DETAILS ================= */}
        {step === "checkout" && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
              <div className="flex items-center justify-between pb-2">
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline"
                >
                  ← Back to Bag Items
                </button>
                <span className="text-xs text-stone-500 font-medium">
                  {items.length} Items · Total ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Customer Contact */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  1. Contact Information
                </h4>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    required
                    autoFocus
                    type="text"
                    placeholder="e.g. Jasleen Kaur"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                      Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98721 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  2. {deliveryType === "delivery" ? "Delivery Address" : "Pickup Destination"}
                </h4>

                {deliveryType === "pickup" ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-700 space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5 text-stone-900">
                      <Store className="w-4 h-4 text-accent" />
                      <span>Pantaloons VR Ambarsar Mall</span>
                    </p>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      Lower Ground Floor, VR Ambarsar Mall, Circular Road, Amritsar, Punjab 143001.
                    </p>
                    <p className="text-emerald-700 font-semibold text-[11px] pt-1">
                      Ready for pickup within 2 hours of placing order. Pay at counter or via UPI.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                        House No. / Street / Locality *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="House No, Street, Ranjit Avenue / Mall Road / Green Avenue / Lawrence Road..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-semibold">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-stone-50/50"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  3. Payment Method
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-stone-900"
                      />
                      <span className="text-xs font-semibold text-stone-800">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono">Pay cash at doorstep</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="accent-stone-900"
                      />
                      <span className="text-xs font-semibold text-stone-800">
                        UPI / QR (GPay, PhonePe, Paytm)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Instant Scan & Pay</span>
                  </label>

                  {deliveryType === "pickup" && (
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "store_pay"}
                          onChange={() => setPaymentMethod("store_pay")}
                          className="accent-stone-900"
                        />
                        <span className="text-xs font-semibold text-stone-800">
                          Pay at Store Counter
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">Card / Cash / UPI</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Order Button */}
            <div className="shrink-0 p-5 border-t border-stone-200 bg-[#FAF7F2] shadow-lg">
              <button
                type="submit"
                className="w-full py-4 rounded-full btn-primary font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm & Place Order (₹{total.toLocaleString("en-IN")})</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: ORDER SUCCESS ================= */}
        {step === "success" && placedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between text-center animate-fade-up min-h-0">
            <div className="space-y-4 pt-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs uppercase tracking-wider">
                  Order ID: {placedOrder.id}
                </span>
                <h3 className="font-display text-2xl font-normal uppercase tracking-wider text-stone-900 mt-3">
                  Thank You, {placedOrder.customerName}!
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Your order has been recorded at Pantaloons VR Ambarsar Mall branch.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-3 text-xs">
                <div className="flex justify-between font-semibold pb-2 border-b border-stone-200">
                  <span>Summary ({placedOrder.items.length} items)</span>
                  <span className="text-accent font-bold">₹{placedOrder.total.toLocaleString("en-IN")}</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {placedOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-stone-600">
                      <span className="truncate max-w-[180px]">
                        {i.productName} ({i.size}) x{i.quantity}
                      </span>
                      <span>₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                  <p>
                    <strong>Destination:</strong> {placedOrder.deliveryType === "delivery" ? placedOrder.address : "Store Pickup (VR Ambarsar Mall)"}
                  </p>
                  <p>
                    <strong>Payment:</strong> {placedOrder.paymentMethod.toUpperCase()}
                  </p>
                  <p>
                    <strong>Phone:</strong> {placedOrder.phone}
                  </p>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>💬 Send Order Receipt to Store WhatsApp</span>
              </button>
            </div>

            <div className="pt-6 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
