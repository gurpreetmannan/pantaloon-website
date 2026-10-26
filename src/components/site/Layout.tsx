import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X, Lock, Calendar, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { STORE } from "@/lib/store";
import { BookingModal } from "@/components/site/BookingModal";
import { CartDrawer } from "@/components/site/CartDrawer";
import { getStoredProducts, type Product } from "@/lib/products";
import { getCart, type CartItem } from "@/lib/orders";

const nav = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections & Products" },
  { to: "/women", label: "Women" },
  { to: "/men", label: "Men" },
  { to: "/kids", label: "Kids" },
  { to: "/style-inspiration", label: "Style Inspiration" },
  { to: "/reviews", label: "Customer Reviews" },
  { to: "/visit-store", label: "Visit Store" },
  { to: "/contact", label: "Contact & Enquiries" },
] as const;

export const mainNav = [
  { to: "/", label: "HOME" },
  { to: "/collections", label: "COLLECTIONS" },
  { to: "/women", label: "WOMEN" },
  { to: "/men", label: "MEN" },
  { to: "/kids", label: "KIDS" },
  { to: "/visit-store", label: "VISIT STORE" },
] as const;

export const allPagesNav = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections & Products" },
  { to: "/women", label: "Women's Fashion" },
  { to: "/men", label: "Men's Fashion" },
  { to: "/kids", label: "Kids' Fashion" },
  { to: "/style-inspiration", label: "Style Inspiration" },
  { to: "/reviews", label: "Customer Reviews" },
  { to: "/visit-store", label: "Visit Amritsar Store" },
  { to: "/contact", label: "Contact & Enquiries" },
] as const;

export function AnnouncementBar() {
  return null;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const updateCount = () => {
    const items = getCart();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    setCartCount(count);
    setCartTotal(total);
  };

  useEffect(() => {
    updateCount();

    const handleOpenBooking = () => setIsBookingOpen(true);
    const handleOpenCart = () => setIsCartOpen(true);
    const handleCartUpdated = () => updateCount();

    window.addEventListener("open-booking-modal", handleOpenBooking);
    window.addEventListener("open-cart", handleOpenCart);
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("open-booking-modal", handleOpenBooking);
      window.removeEventListener("open-cart", handleOpenCart);
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl sm:text-3xl tracking-[0.22em] uppercase font-normal text-foreground transition-opacity hover:opacity-85"
        >
          PANTALOONS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Main">
          {mainNav.map((n) => (
            <Link
              key={n.to + n.label}
              to={n.to}
              className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-accent font-semibold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Shopping Bag Button with Live Count */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-stone-900 bg-stone-900 text-white hover:bg-accent text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span className="inline font-bold">Bag</span>
            {cartCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Desk Button */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-accent text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm"
            title="Store Staff & Admin Portal"
          >
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Admin Desk</span>
            <span className="sm:hidden text-[10px]">Admin</span>
          </Link>

          {/* Book In-Store Visit */}
          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-800 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-stone-900 hover:text-white transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>

          {/* Search Trigger */}
          <button
            aria-label="Search collection and store"
            onClick={() => setSearch(true)}
            className="rounded-full p-2.5 text-foreground/80 hover:bg-black/5 hover:text-foreground transition-colors"
          >
            <Search className="h-5 w-5 stroke-[1.5]" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="rounded-full p-2.5 text-foreground/80 hover:bg-black/5 hover:text-foreground md:hidden transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav
          className="border-t border-border bg-background px-6 py-6 md:hidden shadow-xl animate-fade-up"
          aria-label="Mobile"
        >
          <div className="mb-4 pb-4 border-b border-stone-200 space-y-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full py-3 rounded-full bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Open Bag ({cartCount} Items)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full py-3 rounded-full btn-primary text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book In-Store VIP Visit</span>
            </button>

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-full border border-amber-500/40 bg-amber-50 text-accent text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-accent" />
              <span>Store Admin Portal (Passcode: 123456)</span>
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            {allPagesNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 font-display text-lg tracking-wide text-foreground/90 hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>{n.label}</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Instant Search Dialog */}
      {search && <SearchDialog onClose={() => setSearch(false)} />}

      {/* In-Store VIP Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Interactive Cart and Checkout Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating Quick Bag Trigger */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label={`Open shopping bag with ${cartCount} items`}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-stone-900 text-white shadow-2xl hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-500/40 group ${
          cartCount > 0 ? "scale-100 opacity-100" : "scale-95 opacity-90"
        }`}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-accent flex items-center justify-center transition-colors">
            <ShoppingBag className="w-4 h-4 text-amber-300" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </div>
        <div className="text-left pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 leading-none text-white">
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <div className="text-[10px] text-amber-200/90 font-mono mt-0.5">
            {cartCount > 0 ? (
              <span>{cartCount} {cartCount === 1 ? "item" : "items"} · ₹{cartTotal.toLocaleString("en-IN")}</span>
            ) : (
              <span className="text-stone-300">View Bag</span>
            )}
          </div>
        </div>
      </button>
    </header>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    setProducts(getStoredProducts());
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!mounted) return null;

  const query = q.toLowerCase().trim();

  // Matched Pages
  const matchedPages = nav.filter((n) =>
    !query || n.label.toLowerCase().includes(query)
  );

  // Matched In-Store Products
  const matchedProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query) ||
          p.subCategory.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the store catalog"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="mx-auto mt-16 max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-6 h-6 text-stone-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products: Anarkali, Linen Shirt, Chinos, Denim, Mojaris..."
              className="w-full bg-transparent font-display text-xl sm:text-2xl text-stone-900 outline-none placeholder:text-stone-300"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Results */}
        {matchedProducts.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-accent mb-3">
              In-Store Catalog Matches ({matchedProducts.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate({ to: "/collections", search: { category: p.category } });
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/70 cursor-pointer transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-14 object-cover object-top rounded-lg bg-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-accent uppercase tracking-wider">
                      {p.categoryLabel}
                    </p>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Pages */}
        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-stone-400 mb-2">
            Store Navigation
          </p>
          <ul className="divide-y divide-stone-100">
            {matchedPages.map((r) => (
              <li key={r.to}>
                <button
                  className="w-full py-2.5 text-left text-sm font-medium text-stone-700 hover:text-accent flex items-center justify-between transition-colors"
                  onClick={() => {
                    navigate({ to: r.to });
                    onClose();
                  }}
                >
                  <span>{r.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-[0.2em] uppercase">Pantaloons</p>
          <p className="mt-2 text-sm text-background/70">VR Ambarsar Mall, Amritsar</p>
          <p className="mt-6 max-w-md text-xs leading-relaxed text-background/60">
            An independent local store discovery website. Not the official Pantaloons website. Imagery is representative and illustrative. Store details are based on the supplied listing — please verify before visiting.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-background/60">Explore</p>
          {nav.slice(1, 7).map((n) => (
            <Link key={n.to} to={n.to} className="block text-background/80 hover:text-background">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="space-y-2 text-sm text-background/80">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-background/60">Visit</p>
          <p>{STORE.address}</p>
          <a href={STORE.tel} className="block hover:text-background">{STORE.phoneDisplay}</a>
          <a href={STORE.official} target="_blank" rel="noreferrer" className="block underline">Official store information</a>
          <a href={STORE.shopping} target="_blank" rel="noreferrer" className="block underline">Discover Pantaloons online</a>
        </div>
      </div>
      <div className="border-t border-background/10 py-5 text-center text-xs text-background/60 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-5 gap-3">
        <span>© {new Date().getFullYear()} Pantaloons Amritsar store guide · VR Ambarsar Mall</span>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-background/80 hover:text-amber-300 transition-colors py-1.5 px-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Store Admin Portal (Passcode: 123456)</span>
        </Link>
      </div>
    </footer>
  );
}
