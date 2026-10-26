import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { images } from "@/lib/store";

const t = "Men's Fashion & Catalog – Pantaloons Amritsar";
const d = "Browse shirts, kurtas, Nehru jackets, trousers, and smart-casual looks at Pantaloons, VR Ambarsar Mall.";

export const Route = createFileRoute("/men")({
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
      eyebrow="Men"
      category="men"
      title="Sharp. Relaxed. Ready."
      intro="Explore our men's collection of pure Irish linen shirts, royal silk kurtas, heritage bandhgala waistcoats, and smart chinos."
      img={images.men}
      ideas={[
        {
          t: "Linen & Chinos",
          d: "Breathable mandarin collar shirts with tailored stretch chinos for meetings and relaxed evening dinners.",
        },
        {
          t: "Weekend Denim",
          d: "Vintage-washed denim jackets paired with dark rinse slim denim and low-profile white sneakers.",
        },
        {
          t: "Celebration Ready",
          d: "Structured bandhgala Nehru jackets layered over silk kurtas with matching pocket squares.",
        },
      ]}
      gallery={[images.men, images.denim, images.hero]}
    />
  ),
});
