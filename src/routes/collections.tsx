import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageHero, CategoryGrid, TrendingLooks } from "@/components/site/Sections";
import { ProductExplorer } from "@/components/site/ProductExplorer";
import { images, STORE } from "@/lib/store";
import type { ProductCategory } from "@/lib/products";

const searchSchema = z.object({
  category: z
    .enum([
      "all",
      "women",
      "men",
      "kids",
      "festive",
      "denim",
      "outerwear",
      "accessories",
      "footwear",
    ])
    .optional(),
});

const t = "Collections & Products – Pantaloons VR Ambarsar Mall, Amritsar";
const d =
  "Explore and browse women's, men's, kids', festive wear, denim and accessories available at Pantaloons VR Ambarsar Mall, Amritsar.";

export const Route = createFileRoute("/collections")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: t },
      { name: "description", content: d },
      { property: "og:title", content: t },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const search = Route.useSearch();
  const initialCategory: ProductCategory = search.category || "all";

  return (
    <div className="bg-background text-foreground transition-colors">
      <PageHero
        eyebrow="Exclusive Collections"
        title="Every style, one destination."
        text="Browse our in-store catalog across categories, check sizes and styles, then book a fitting session or explore in person at VR Ambarsar Mall."
        img={images.festive}
      />

      {/* Interactive Products Catalog */}
      <ProductExplorer
        initialCategory={initialCategory}
        title="Explore The New Season Catalog"
        subtitle="Browse current styles available at Pantaloons Amritsar with sizes, fabric details, and VIP store trial bookings."
      />

      {/* Category Grid */}
      <div className="border-t border-stone-200/60 bg-stone-50/50 py-12">
        <CategoryGrid />
      </div>

      {/* Trending Looks Showcase */}
      <TrendingLooks />

      {/* Official Online link banner */}
      <div className="py-16 text-center border-t border-stone-200/60 bg-white">
        <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-2">
          Looking for online delivery?
        </p>
        <h3 className="font-display text-2xl uppercase tracking-wider text-stone-900 mb-6">
          Explore Nationwide Catalog
        </h3>
        <a
          href={STORE.shopping}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
        >
          Discover Pantaloons Online Shopping
        </a>
      </div>
    </div>
  );
}
