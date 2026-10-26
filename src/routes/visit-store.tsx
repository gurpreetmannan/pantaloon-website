import { createFileRoute } from "@tanstack/react-router";
import { Gallery, PageHero, VisitStore } from "@/components/site/Sections";
import { images } from "@/lib/store";

const t = "Visit Pantaloons – VR Ambarsar Mall, Amritsar | Directions & Phone";
const d = "Address, phone, directions and closing time for Pantaloons, Lower Ground Floor, VR Mall, Circular Road, Amritsar.";
export const Route = createFileRoute("/visit-store")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <>
      <PageHero eyebrow="Visit Store" title="See you at VR Ambarsar Mall" text="Find us on the Lower Ground Floor, Circular Road, Amritsar." img={images.store} />
      <VisitStore map />
      <Gallery />
    </>
  ),
});
