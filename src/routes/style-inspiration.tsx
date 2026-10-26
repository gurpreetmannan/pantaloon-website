import { createFileRoute } from "@tanstack/react-router";
import { PageHero, StoryList } from "@/components/site/Sections";
import { images } from "@/lib/store";

const t = "Style Inspiration Journal – Pantaloons Amritsar";
const d = "Original styling tips for everyday, smart-casual, denim and celebration outfits.";
export const Route = createFileRoute("/style-inspiration")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <>
      <PageHero eyebrow="The Journal" title="Style Inspiration" text="Original editorial styling suggestions for every occasion." img={images.denim} />
      <section className="mx-auto max-w-7xl px-5 py-24"><StoryList /></section>
    </>
  ),
});
