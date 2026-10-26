import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reviews, VisitStore } from "@/components/site/Sections";
import { images } from "@/lib/store";

const t = "Customer Reviews – Pantaloons VR Ambarsar Mall (4.8★)";
const d = "Rated 4.8 out of 5 from 473 reviews. See what local shoppers say about Pantaloons Amritsar.";
export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <>
      <PageHero eyebrow="Reviews" title="What shoppers say" text="Feedback from local customers of the Amritsar store." img={images.hero} />
      <Reviews />
      <VisitStore />
    </>
  ),
});
