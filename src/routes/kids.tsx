import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { images } from "@/lib/store";

const t = "Kids' Fashion & Catalog – Pantaloons Amritsar";
const d = "Browse comfortable, colourful children's clothing and festive outfits at Pantaloons, VR Ambarsar Mall.";

export const Route = createFileRoute("/kids")({
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
      eyebrow="Kids"
      category="kids"
      title="Little looks, big smiles."
      intro="Explore our children's collection of festive lehengas, boy's kurta-pyjama jacket sets, and durable bio-washed cotton playwear."
      img={images.kids}
      ideas={[
        {
          t: "Play-Ready Basics",
          d: "Soft, skin-safe combed cotton tees and multi-pocket cargo shorts for everyday playtime.",
        },
        {
          t: "Festive Splendour",
          d: "Comfort-lined embroidered lehengas and bandhgala kurta sets that kids love wearing all day.",
        },
        {
          t: "Family Matching",
          d: "Coordinate festive color tones with parents for Diwali, weddings, and family portrait shoots.",
        },
      ]}
      gallery={[images.kids, images.hero, images.festive]}
    />
  ),
});
