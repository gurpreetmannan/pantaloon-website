import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  Eye,
  Calendar,
  X,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  Check,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  getStoredProducts,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { addToCart } from "@/lib/orders";
import { STORE } from "@/lib/store";

interface ProductExplorerProps {
  initialCategory?: ProductCategory;
  title?: string;
  subtitle?: string;
  hideCategoryTabs?: boolean;
}

const CATEGORY_TABS: { id: ProductCategory; label: string }[] = [
  { id: "all", label: "All Items" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "kids", label: "Kids" },
  { id: "festive", label: "Festive & Ethnic" },
  { id: "denim", label: "Denim" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
];

export function ProductExplorer({
  initialCategory = "all",
  title = "Explore The Store Collection",
  subtitle = "Discover contemporary styles, festive ensembles, and daily essentials available at Pantaloons VR Ambarsar Mall.",
  hideCategoryTabs = false,
}: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || "Standard");
      setSelectedColor(selectedProduct.colors[0]?.name || "Standard");
    }
  }, [selectedProduct]);

  // Open booking modal and dispatch event
  const handleBookFitting = (product: Product) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("open-booking-modal", {
        detail: {
          service: `${product.categoryLabel} Trial: ${product.name}`,
          notes: `Interested in ${product.name} (Size: ${selectedSize || product.sizes[0]}, Price: ₹${product.price})`,
        },
      });
      window.dispatchEvent(event);
    }
  };

  // Add to Bag action
  const handleAddToCart = (product: Product, size?: string, color?: string, openBag = false) => {
    const s = size || product.sizes[0] || "Standard";
    const c = color || product.colors[0]?.name || "Standard";
    addToCart(product, s, c, 1);

    if (openBag) {
      window.dispatchEvent(new CustomEvent("open-cart"));
    } else {
      setAddedToast(`Added ${product.name} to bag!`);
      setTimeout(() => setAddedToast(null), 3000);
      window.dispatchEvent(new CustomEvent("open-cart"));
    }
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product, selectedSize, selectedColor, true);
    setSelectedProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.subCategory.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      // Tag filter
      let matchesTag = true;
      if (selectedTag === "Festive '26") {
        matchesTag = p.badge === "Festive '26";
      } else if (selectedTag === "Bestseller") {
        matchesTag = p.badge === "Bestseller";
      } else if (selectedTag === "Under ₹2,000") {
        matchesTag = p.price <= 2000;
      } else if (selectedTag === "In Stock") {
        matchesTag = p.inStock;
      }

      return matchesCategory && matchesSearch && matchesTag;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, selectedTag, sortBy]);

  return (
    <section id="product-catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-up border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-accent text-[11px] uppercase tracking-[0.22em] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>In-Store Catalog & Online Order · VR Ambarsar Mall</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide font-normal text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Category Tabs (if not hidden) */}
      {!hideCategoryTabs && (
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max px-2">
            {CATEGORY_TABS.map((tab) => {
              const count =
                tab.id === "all"
                  ? products.length
                  : products.filter((p) => p.category === tab.id).length;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setSelectedTag("All");
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-foreground text-background shadow-md scale-105"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-10 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search items, fabrics, dresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-full border border-stone-200 bg-stone-50/50 text-xs text-foreground placeholder:text-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["All", "Festive '26", "Bestseller", "Under ₹2,000", "In Stock"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-colors ${
                selectedTag === tag
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none font-medium text-stone-700"
          >
            <option value="featured">Sort: Featured Picks</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="mb-6 flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-800">{filteredProducts.length}</strong> styles
          {selectedCategory !== "all" && (
            <span> in <strong className="text-stone-800 uppercase">{selectedCategory}</strong></span>
          )}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Home Delivery & VR Ambarsar Store Pickup Available</span>
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-stone-50 rounded-3xl border border-stone-200/80">
          <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <h3 className="font-display text-xl uppercase tracking-wider text-stone-700">
            No styles found
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to explore more of our collection.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedTag("All");
            }}
            className="mt-5 px-5 py-2.5 rounded-full btn-primary text-xs uppercase tracking-wider"
          >
            View All Styles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Product Image Box */}
              <div
                className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(p)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                />

                {/* Badge Overlay */}
                {p.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
                      p.badge === "Festive '26"
                        ? "bg-amber-600/90 text-white"
                        : p.badge === "Bestseller"
                        ? "bg-stone-900/90 text-amber-200"
                        : "bg-white/95 text-stone-900 border border-stone-200"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}

                {/* Stock Tag */}
                {!p.inStock && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}

                {/* Quick Action Button on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-white/95 hover:bg-white text-stone-900 text-[11px] font-semibold tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    title="Add to Shopping Bag"
                    className="p-2 rounded-full bg-stone-900 hover:bg-accent text-white shadow-md transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span className="uppercase tracking-wider font-medium text-accent">
                      {p.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{p.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(p)}
                    className="font-display text-base font-normal tracking-wide text-stone-900 group-hover:text-accent transition-colors line-clamp-1 cursor-pointer"
                  >
                    {p.name}
                  </h3>

                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                    {p.fabric}
                  </p>

                  {/* Size chips preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.sizes.slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="px-1.5 py-0.5 rounded border border-stone-200 text-[10px] font-mono text-stone-600 bg-stone-50"
                      >
                        {size}
                      </span>
                    ))}
                    {p.sizes.length > 4 && (
                      <span className="text-[10px] text-stone-400 self-center">
                        +{p.sizes.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-stone-900 font-sans">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{p.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {p.discount && (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {p.discount}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-accent text-white text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3 h-3 text-amber-300" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white/90 text-stone-600 hover:text-stone-950 shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Left: Image Showcase */}
            <div className="md:w-1/2 aspect-[4/5] md:aspect-auto bg-stone-100 relative overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-900/90 text-amber-200 shadow-md">
                  {selectedProduct.badge}
                </span>
              )}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-[11px]">{selectedProduct.storeLocation}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-bold uppercase">
                  {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Modal Right: Details & Ordering Actions */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-accent">
                  {selectedProduct.categoryLabel} · {selectedProduct.subCategory}
                </p>

                <h2 className="font-display text-2xl sm:text-3xl text-stone-900 font-normal mt-1 leading-snug">
                  {selectedProduct.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-stone-500">
                    ({selectedProduct.reviewsCount} verified Amritsar shopper reviews)
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold font-sans text-stone-900">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-sm text-stone-400 line-through">
                        MRP ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                    {selectedProduct.discount && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {selectedProduct.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Free home delivery across Amritsar or pick up at VR Ambarsar Mall.
                  </p>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Fabric & Fit Details */}
                <div className="mt-4 space-y-2 border-t border-b border-stone-100 py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Fabric Composition</span>
                    <span className="font-semibold text-stone-800">{selectedProduct.fabric}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Fit Profile</span>
                    <span className="font-semibold text-stone-800">{selectedProduct.fit}</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    <span>Select Size *</span>
                    <span className="text-[11px] font-normal text-accent font-mono">Selected: {selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                          selectedSize === s
                            ? "bg-stone-900 text-white shadow-md scale-105"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Variations */}
                {selectedProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Available Shades: <span className="font-normal text-stone-500">{selectedColor}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.name
                              ? "border-stone-900 scale-110 shadow"
                              : "border-stone-200"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check className="w-3 h-3 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Ordering & Trial */}
              <div className="mt-6 pt-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(selectedProduct, selectedSize, selectedColor)}
                    className="w-full py-3.5 rounded-full border border-stone-900 text-stone-900 hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-accent" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="w-full py-3.5 rounded-full btn-primary text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>⚡ Order Now</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleBookFitting(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Book In-Store VIP Fitting</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={STORE.tel}
                    className="py-2 px-3 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>Call Store</span>
                  </a>
                  <a
                    href={STORE.directions}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>Store Map</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
