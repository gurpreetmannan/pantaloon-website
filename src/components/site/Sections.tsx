import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  ExternalLink,
  Shirt,
  Sun,
  Sparkles,
  Store,
  Star,
  X,
  Compass,
  Clock,
  Navigation,
  Calendar,
  ThumbsUp,
  CheckCircle2,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  categories,
  gallery,
  images,
  reviews,
  shopCategories,
  stories,
  trendingLooks,
  STORE,
  type Category,
  type ShopCategory,
} from "@/lib/store";
import {
  WomenCategoryIcon,
  MenCategoryIcon,
  KidsCategoryIcon,
  OuterwearCategoryIcon,
  DenimCategoryIcon,
  FestiveCategoryIcon,
  AccessoriesCategoryIcon,
  FootwearCategoryIcon,
} from "./CategoryIcons";
import { ReviewModal } from "./ReviewModal";
import {
  getStoredReviews,
  markReviewHelpful,
  getReviewStats,
  type CustomerReview,
} from "@/lib/reviews";

export function SectionHeading({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.28em] font-medium text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-tight tracking-wide uppercase text-foreground">
        {title}
      </h2>
      {children && <p className="mt-4 text-muted-foreground leading-relaxed">{children}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  img,
}: {
  eyebrow: string;
  title: string;
  text: string;
  img: string;
}) {
  return (
    <section className="relative h-[50vh] min-h-[380px] overflow-hidden bg-stone-900">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/50 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 text-white animate-fade-up">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/80">{eyebrow}</p>
        <h1 className="max-w-2xl font-display text-4xl sm:text-5xl md:text-6xl font-normal uppercase leading-tight tracking-wide">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-white/80 leading-relaxed text-sm sm:text-base">{text}</p>
      </div>
    </section>
  );
}

/**
 * Seamless Panoramic Luxury Hero:
 * Uses the continuous photographic canvas of the couple on the left and natural
 * limewash plaster wall on the right with no seams or hard divisions.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-12">
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-hidden rounded-3xl shadow-2xl border border-stone-300/40">
        {/* Continuous Panoramic Background with the Indian couple on the left */}
        <img
          src={images.heroBanner}
          alt="Pantaloons Contemporary Indian Fashion at VR Ambarsar Mall"
          className="absolute inset-0 h-full w-full object-cover object-[24%_center] sm:object-[20%_center] lg:object-left-center transition-transform duration-1000"
        />

        {/* Ambient subtle warm vignette & gradient overlay to make typography pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-900/10 to-stone-950/45 sm:to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent lg:hidden" />

        {/* Floating Festive Badge on bottom-left near the couple */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-white/70 shadow-lg text-stone-900 animate-fade-up">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse" />
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-stone-800">
            Festive '26 Collection · VR Ambarsar
          </p>
        </div>

        {/* Typography Content Container (positioned cleanly on the right) */}
        <div className="relative z-10 flex h-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] items-center justify-end px-6 sm:px-12 lg:px-16 py-12">
          <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl text-white">
            {/* Store Location Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-white shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>VR Ambarsar Mall · Amritsar</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-normal leading-[1.12] tracking-wide uppercase text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              Explore Your Style.
              <br />
              Discover Our New
              <br />
              Season Collection
              <br />
              At VR Ambarsar Mall.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base font-light text-white/95 leading-relaxed max-w-md drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
              Discover our contemporary Indian festive and outfit collections designed for life's celebrated moments.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                className="group btn-white"
              >
                <span>Explore Collections</span>
                <span className="flex items-center justify-center w-7 h-7 -mr-2 rounded-full bg-stone-900 text-amber-200 shadow-md transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:rotate-[-45deg] group-hover:scale-110">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <a
                href="#trending-looks"
                className="group btn-white-outline"
              >
                <Sparkles className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <span>Shop Fave Looks</span>
              </a>
            </div>

            {/* Quick Ratings & Address Footer Ribbon inside Hero */}
            <div className="mt-8 pt-6 border-t border-white/25 flex flex-wrap items-center gap-5 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">4.8 Rating</span>
                <span className="text-white/70 font-light">({STORE.reviewCount}+ Google reviews)</span>
              </div>
              <div className="hidden sm:block h-3 w-[1px] bg-white/30" />
              <div className="flex items-center gap-1.5 text-white/80 font-light">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Lower Ground Floor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Featured Outfit Highlights row shown directly below Hero in the mockup
 */
export function FeaturedHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Link
          to="/collections"
          className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200/50 block"
        >
          <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
            <img
              src={images.dailyEssentials}
              alt="Daily Essentials flat-lay outfit"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 text-white flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/80 font-medium">Casual Edit</p>
              <h3 className="font-display text-xl sm:text-2xl font-normal uppercase tracking-wide">
                Daily Essentials Look
              </h3>
            </div>
            <span className="rounded-full bg-white/20 p-2 backdrop-blur-md transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </Link>

        <Link
          to="/collections"
          className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200/50 block"
        >
          <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
            <img
              src={images.festiveReady}
              alt="Festive Ready flat-lay outfit"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 text-white flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/80 font-medium">Ethnic Celebration</p>
              <h3 className="font-display text-xl sm:text-2xl font-normal uppercase tracking-wide">
                Festive Ready Ensemble
              </h3>
            </div>
            <span className="rounded-full bg-white/20 p-2 backdrop-blur-md transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function renderCategoryIcon(type: ShopCategory["type"]) {
  switch (type) {
    case "women":
      return <WomenCategoryIcon />;
    case "men":
      return <MenCategoryIcon />;
    case "kids":
      return <KidsCategoryIcon />;
    case "outerwear":
      return <OuterwearCategoryIcon />;
    case "denim":
      return <DenimCategoryIcon />;
    case "festive":
      return <FestiveCategoryIcon />;
    case "accessories":
      return <AccessoriesCategoryIcon />;
    case "footwear":
      return <FootwearCategoryIcon />;
  }
}

/**
 * SHOP BY CATEGORY section with circular editorial model portraits
 */
export function ShopByCategory() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.28em] font-medium text-accent mb-2">Curated Collections</p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.22em] uppercase font-normal text-foreground">
          SHOP BY CATEGORY
        </h2>
        <div className="mx-auto mt-4 h-[1px] w-14 bg-stone-300" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-12 gap-x-6 sm:gap-x-10 max-w-5xl mx-auto">
        {shopCategories.map((c) => {
          const searchParam = c.to === "/collections" ? { category: c.type } : undefined;
          return (
            <Link
              key={c.id}
              to={c.to}
              search={searchParam}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full p-[3px] bg-gradient-to-tr from-stone-300/80 via-amber-200/90 to-stone-400 shadow-md transition-all duration-500 group-hover:scale-108 group-hover:shadow-2xl group-hover:from-accent group-hover:via-amber-300 group-hover:to-accent">
                <div className="h-full w-full overflow-hidden rounded-full bg-stone-100">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-115"
                  />
                </div>
              </div>
              <span className="mt-4 font-display text-xs sm:text-sm font-normal tracking-[0.22em] uppercase text-foreground group-hover:text-accent transition-colors">
                {c.title}
              </span>
              <span className="text-[11px] text-stone-500 font-light hidden sm:block mt-0.5">
                {c.tagline}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <Link
          to="/collections"
          className="inline-block text-xs uppercase tracking-[0.24em] font-semibold text-foreground underline underline-offset-8 transition-colors hover:text-accent"
        >
          VIEW ALL CATEGORIES
        </Link>
      </div>
    </section>
  );
}

/**
 * TRENDING LOOKS section matching the 3 cards in the mockup
 */
export function TrendingLooks() {
  const [selectedLook, setSelectedLook] = useState<(typeof trendingLooks)[0] | null>(null);

  return (
    <section id="trending-looks" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.22em] uppercase font-normal text-foreground">
          TRENDING LOOKS
        </h2>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-stone-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {trendingLooks.map((look) => (
          <div
            key={look.id}
            onClick={() => setSelectedLook(look)}
            className="group cursor-pointer text-center"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200/60 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">
              <img
                src={look.img}
                alt={look.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                <span className="px-5 py-2.5 rounded-full bg-white text-stone-900 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] shadow-xl backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  View Look Details
                </span>
              </div>
            </div>
            <h3 className="mt-4 font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-foreground group-hover:text-accent transition-colors">
              {look.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Interactive Modal Details when a Look is clicked */}
      {selectedLook && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setSelectedLook(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLook(null)}
              aria-label="Close"
              className="absolute right-4 top-4 p-2 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={selectedLook.img}
                  alt={selectedLook.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-semibold">
                  {selectedLook.tag}
                </p>
                <h3 className="font-display text-2xl font-normal uppercase tracking-wide mt-1">
                  {selectedLook.title}
                </h3>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {selectedLook.desc}
                </p>
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.18em] font-semibold text-stone-900 mb-2">
                    Included Outfit Pieces:
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {selectedLook.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{item.name}</span>
                        <span className="text-stone-400">({item.category})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    to="/collections"
                    onClick={() => setSelectedLook(null)}
                    className="btn-primary text-xs"
                  >
                    View Collections
                  </Link>
                  <Link
                    to="/visit-store"
                    onClick={() => setSelectedLook(null)}
                    className="btn-outline text-xs"
                  >
                    Try In Store
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * STORE EXPERIENCE section matching the mockup (Store photo, Visit Amritsar Store with map, Customer Love)
 */
export function StoreExperience() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.22em] uppercase font-normal text-foreground">
          STORE EXPERIENCE
        </h2>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-stone-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {/* Card 1: Store photography */}
        <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-200/60 p-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            <img
              src={images.store}
              alt="Pantaloons VR Ambarsar Mall showroom interior"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <img
              src={images.women}
              alt="Women section"
              className="aspect-square w-full rounded-lg object-cover object-top"
            />
            <img
              src={images.festive}
              alt="Festive section"
              className="aspect-square w-full rounded-lg object-cover object-top"
            />
            <img
              src={images.men}
              alt="Menswear section"
              className="aspect-square w-full rounded-lg object-cover object-top"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            VR Ambarsar Mall Showroom Interior
          </p>
        </div>

        {/* Card 2: Visit Amritsar Store with interactive map info */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#F6F0E7] p-6 sm:p-7 shadow-sm border border-stone-200/60">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Store className="h-5 w-5" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Amritsar Branch</span>
            </div>
            <h3 className="mt-3 font-display text-xl sm:text-2xl font-normal uppercase tracking-wider text-foreground">
              VISIT AMRITSAR STORE
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              VR Ambarsar Mall, Lower Ground Floor,
              <br />
              Circular Rd, Joshi Colony, Amritsar, Punjab 143001
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-700 bg-white/70 rounded-lg px-3 py-2 w-fit border border-stone-200/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-800">Open Daily:</span>
              <span>10:00 AM – 10:00 PM</span>
            </div>
          </div>

          {/* Map Preview Card */}
          <div className="my-5 overflow-hidden rounded-xl border border-stone-300/80 bg-white p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600 fill-red-600" />
                <span className="text-xs font-semibold text-stone-900">Pantaloons · VR Ambarsar</span>
              </div>
              <span className="text-[10px] text-stone-500">Amritsar</span>
            </div>
            <iframe
              title="Pantaloons Store Map Location"
              src={STORE.mapEmbed}
              loading="lazy"
              className="h-28 w-full rounded border-0"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={STORE.directions}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 text-center text-xs py-2.5"
            >
              <Navigation className="h-3.5 w-3.5 inline mr-1" /> Get Directions
            </a>
            <a
              href={STORE.tel}
              className="btn-outline flex-1 text-center text-xs py-2.5"
            >
              <Phone className="h-3.5 w-3.5 inline mr-1" /> Call Store
            </a>
          </div>
        </div>

        {/* Card 3: Customer Love */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#F6F0E7] p-6 sm:p-7 shadow-sm border border-stone-200/60">
          <div>
            <div className="flex items-center gap-2 text-amber-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Verified Reviews</span>
            </div>
            <h3 className="mt-3 font-display text-xl sm:text-2xl font-normal uppercase tracking-wider text-foreground">
              CUSTOMER LOVE
            </h3>

            {/* Stars */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-amber-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900">4.8</span>
              <span className="text-xs text-stone-500">({STORE.reviewCount}+ reviews)</span>
            </div>

            {/* Excerpt quotes */}
            <div className="mt-6 space-y-4">
              <div className="border-l-2 border-stone-300 pl-3">
                <p className="text-xs italic text-stone-700 leading-relaxed">
                  "Loved my shopping experience, wide variety of Indian and western festive wear... store staff is polite and helpful."
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                  — Dipanshu K. · Local Guide
                </p>
              </div>
              <div className="border-l-2 border-stone-300 pl-3">
                <p className="text-xs italic text-stone-700 leading-relaxed">
                  "Comfortable fabrics, trendy collections, affordable options, and very pleasant atmosphere."
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                  — Vineet K. · Verified Customer
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/reviews"
              className="btn-outline w-full text-center text-xs py-2.5 block"
            >
              Read Customer Reviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Supporting exports for Category page and other subpages
export function CategoryCard({ c }: { c: Category }) {
  return (
    <Link to={c.to} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-stone-200">
        <img
          src={c.img}
          alt={c.title}
          loading="lazy"
          width={768}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 font-display text-2xl uppercase tracking-wide">{c.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-medium group-hover:text-accent">
        Explore Styles <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <SectionHeading eyebrow="Shop by Category" title="Fashion for every member of the family">
        Inspiration across our categories — visit the store to see what's currently in stock.
      </SectionHeading>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}

export function StoryList({ limit }: { limit?: number }) {
  const list = limit ? stories.slice(0, limit) : stories;
  return (
    <div className="grid gap-12 md:grid-cols-2">
      {list.map((s, i) => (
        <article key={s.title} id={`story-${i}`} className="group">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={s.img}
              alt={s.title}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-accent">Style Note 0{i + 1}</p>
          <h3 className="mt-2 font-display text-2xl uppercase tracking-wide">{s.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{s.tip}</p>
          <Link
            to="/style-inspiration"
            hash={`story-${i}`}
            className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-medium hover:text-accent"
          >
            Explore the Look <ArrowRight className="h-3 w-3" />
          </Link>
        </article>
      ))}
    </div>
  );
}

export function WhyVisit() {
  const items = [
    { icon: Shirt, t: "Fashion Variety", d: "Explore contemporary styles, festive attire and casual daily outfits." },
    { icon: Sun, t: "Everyday Wear", d: "Discover effortless looks for work, weekends, and social gatherings." },
    { icon: Sparkles, t: "Occasion Inspiration", d: "Celebrate weddings, Diwali and festivals in curated royal elegance." },
    { icon: Store, t: "In-Store Shopping", d: "Visit the VR Ambarsar Mall branch to explore the collection in person." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <SectionHeading eyebrow="Why Visit" title="A Store Worth The Stop" center />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: I, t, d }) => (
          <div key={t} className="rounded-xl bg-[#F6F0E7] p-8 text-center border border-stone-200/60 shadow-sm">
            <I className="mx-auto h-8 w-8 text-accent" strokeWidth={1.5} />
            <h3 className="mt-5 font-display text-xl uppercase tracking-wide">{t}</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Stars() {
  return (
    <div className="flex gap-1 text-amber-500" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

export function Reviews() {
  const [reviewList, setReviewList] = useState<CustomerReview[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const refreshReviews = useCallback(() => {
    setReviewList(getStoredReviews());
  }, []);

  useEffect(() => {
    setIsMounted(true);
    refreshReviews();

    const handleUpdate = () => {
      refreshReviews();
    };

    window.addEventListener("pantaloons_reviews_updated", handleUpdate);
    return () => {
      window.removeEventListener("pantaloons_reviews_updated", handleUpdate);
    };
  }, [refreshReviews]);

  const stats = getReviewStats(reviewList);

  const filteredReviews = reviewList.filter((r) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "5") return r.rating === 5;
    if (selectedFilter === "4") return r.rating === 4;
    return r.categoryVisited === selectedFilter;
  });

  const handleHelpful = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markReviewHelpful(id);
  };

  return (
    <section className="bg-stone-900 py-20 sm:py-28 text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.45fr] items-start">
          {/* Left Column: Aggregated Stats & Write Review CTA */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-[11px] font-bold tracking-widest uppercase mb-4 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" /> Verified Store Ratings
            </div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wide leading-tight">
              Loved by Local Shoppers
            </h2>

            {/* Main Score & Stars */}
            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-display text-6xl sm:text-8xl leading-none tracking-tight text-white">
                {isMounted ? stats.averageRating : STORE.rating}
              </span>
              <div>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i <= Math.round(isMounted ? stats.averageRating : 5)
                          ? "fill-current"
                          : "text-stone-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-white/70">
                  Based on{" "}
                  <span className="font-semibold text-white">
                    {isMounted ? stats.totalCount + 473 : STORE.reviewCount} verified reviews
                  </span>
                </p>
              </div>
            </div>

            {/* Recommendation badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{isMounted ? stats.recommendPercentage : 96}% of customers recommend VR Ambarsar</span>
            </div>

            {/* Star Rating Breakdown Bars */}
            <div className="mt-7 space-y-2 max-w-sm">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.breakdown[star] || 0;
                const percentage =
                  stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs text-white/75">
                    <span className="w-6 font-mono font-semibold">{star}★</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] text-white/50">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-white/70 text-xs sm:text-sm leading-relaxed max-w-md">
              From Amritsar's favorite festive kurtas and designer sarees to everyday denim and casual shirts, see real feedback from in-store shoppers.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Write a Review
              </button>
              <a
                href={STORE.reviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-white text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                Google Reviews <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Filter Pills & Testimonials Cards */}
          <div>
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs">
              {[
                { id: "all", label: "All Reviews" },
                { id: "5", label: "5 Stars ★" },
                { id: "4", label: "4 Stars ★" },
                { id: "Festive & Ethnic", label: "Festive & Ethnic" },
                { id: "Menswear", label: "Menswear" },
                { id: "Casual & Western", label: "Casual & Western" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap text-xs ${
                    selectedFilter === f.id
                      ? "bg-white text-stone-900 font-semibold"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Testimonials List */}
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-white/60 text-xs">
                  No reviews match this filter yet. Be the first to share your experience!
                </div>
              ) : (
                filteredReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.06]"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i <= r.rating ? "fill-current" : "text-stone-600"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                            {r.categoryVisited}
                          </span>
                          {r.verifiedPurchase && (
                            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified Shopper
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">{r.date}</span>
                    </div>

                    {/* Review Message */}
                    <p className="font-display text-base sm:text-lg leading-snug text-white/95">
                      "{r.text}"
                    </p>

                    {/* Review Footer */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{r.name}</span>
                        {r.city && <span className="text-white/50 text-[11px]"> · {r.city}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleHelpful(r.id, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-[11px]"
                        title="Mark as helpful"
                      >
                        <ThumbsUp className="w-3 h-3 text-amber-400" />
                        <span>Helpful ({r.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onReviewSubmitted={() => {
          refreshReviews();
        }}
      />
    </section>
  );
}

export function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const move = useCallback(
    (d: number) => setIdx((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)),
    []
  );

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx, close, move]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="Gallery" title="Inside the look">
        Representative imagery for illustration — not actual photographs of this branch.
      </SectionHeading>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {gallery.map((g, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="group relative block w-full overflow-hidden rounded-xl"
            aria-label={`Open image: ${g.alt}`}
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="w-full transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-stone-900 rounded">
              {g.label}
            </span>
          </button>
        ))}
      </div>
      {idx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <img
            src={gallery[idx]!.src}
            alt={gallery[idx]!.alt}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            autoFocus
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 p-2 text-white"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-2 p-3 text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-2 p-3 text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </section>
  );
}

export function VisitStore({ map }: { map?: boolean }) {
  return (
    <section className="bg-[#F5EFE6] py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Visit Us" title="Your Next Shopping Stop: VR Ambarsar Mall" />
          <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
            <h3 className="font-display text-2xl uppercase tracking-wide">{STORE.name}</h3>
            <p className="mt-4 flex gap-3 text-sm text-stone-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {STORE.address}
            </p>
            <p className="mt-3 flex gap-3 text-sm text-stone-600">
              <Phone className="h-4 w-4 text-accent" />
              {STORE.phoneDisplay}
            </p>
            <p className="mt-3 text-sm text-stone-600">
              Closes at {STORE.closing}{" "}
              <span className="text-muted-foreground text-xs">(verify timings on holidays)</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-amber-300" /> Book VIP Visit
              </button>
              <a href={STORE.tel} className="btn-outline text-xs">
                <Phone className="h-3.5 w-3.5" /> Call Store
              </a>
              <a
                href={STORE.directions}
                target="_blank"
                rel="noreferrer"
                className="btn-outline text-xs"
              >
                <MapPin className="h-3.5 w-3.5" /> Get Directions
              </a>
              <a
                href={STORE.official}
                target="_blank"
                rel="noreferrer"
                className="btn-outline text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Official Info
              </a>
            </div>
          </div>
        </div>
        {map ? (
          <iframe
            title="Map to Pantaloons, VR Ambarsar Mall"
            src={STORE.mapEmbed}
            loading="lazy"
            className="h-[440px] w-full rounded-2xl border-0 shadow-sm"
          />
        ) : (
          <img
            src={images.store}
            alt="Pantaloons showroom interior"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
          />
        )}
      </div>
    </section>
  );
}
