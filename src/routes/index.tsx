import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  FeaturedHighlights,
  ShopByCategory,
  TrendingLooks,
  StoreExperience,
  SectionHeading,
  StoryList,
  WhyVisit,
  Gallery,
} from "@/components/site/Sections";
import { ProductExplorer } from "@/components/site/ProductExplorer";
import { EnquiryForm } from "@/components/site/EnquiryForm";

const title = "Pantaloons Amritsar – Fashion & Collections at VR Ambarsar Mall";
const description =
  "Explore contemporary fashion, festive kurtas, lehengas, denim and store details for Pantaloons at VR Ambarsar Mall, Amritsar. Rated 4.8 by local shoppers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground transition-colors">
      {/* 1. Split Hero banner (couple on left, typography & CTAs on right) */}
      <Hero />

      {/* 2. Featured look previews (Daily essentials & festive outfits) */}
      <FeaturedHighlights />

      {/* 3. Shop by Category (8 circular icons + "VIEW ALL CATEGORIES") */}
      <ShopByCategory />

      {/* 4. Real Products Explorer Catalog */}
      <ProductExplorer
        initialCategory="all"
        title="Explore In-Store Products"
        subtitle="Browse current fashion pieces available at Pantaloons VR Ambarsar Mall with live stock status, prices, and fitting trial bookings."
      />

      {/* 5. Trending Looks (Daily Essentials, Smart-Casual, Festive Ready) */}
      <TrendingLooks />

      {/* 6. Store Experience (Showroom photos, visit Amritsar store with map, customer love) */}
      <StoreExperience />

      {/* 7. Fashion Journal / Style Inspiration */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          eyebrow="Style Inspiration"
          title="Notes from the fashion journal"
          center
        >
          Curated styling notes to elevate your daily and occasion wardrobe.
        </SectionHeading>
        <StoryList limit={2} />
      </section>

      {/* 8. Why Visit Pantaloons Amritsar */}
      <WhyVisit />

      {/* 9. Showroom Gallery Preview */}
      <Gallery />

      {/* 10. Enquiries & Store Assistance */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Enquiries"
          title="Have a question for the store?"
        >
          Send an enquiry regarding new collections, styling sessions, or visiting the VR Ambarsar Mall branch.
        </SectionHeading>
        <EnquiryForm />
      </section>
    </div>
  );
}
