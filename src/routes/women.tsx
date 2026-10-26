import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { images } from "@/lib/store";

const t = "Women's Fashion & Catalog – Pantaloons Amritsar";
const d = "Browse dresses, kurtas, suits, everyday wear, and festive looks to discover at Pantaloons, VR Ambarsar Mall.";

export const Route = createFileRoute("/women")({
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
  component: () => (
    <CategoryPage
      eyebrow="Women"
      category="women"
      title="Effortless, modern, yours."
      intro="Explore our in-store collection of festive anarkalis, floral maxi dresses, chikankari kurtis and tailored linen trousers."
      img={images.women}
      ideas={[
        {
          t: "Soft Neutrals",
          d: "Cream and beige layers for an easy, polished daily look. Try styling a chikankari tunic with wide-leg trousers.",
        },
        {
          t: "Festive Jewel Tones",
          d: "Rich maroon, crimson, and gold zari embroidery for celebrations and family weddings in Punjab.",
        },
        {
          t: "Denim Days",
          d: "Relaxed fit denim with a breathable slub cotton top and an effortless lightweight outer layer.",
        },
      ]}
      gallery={[images.women, images.festive, images.denim]}
    />
  ),
});
