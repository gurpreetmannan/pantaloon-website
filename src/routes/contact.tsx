import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionHeading } from "@/components/site/Sections";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { images, STORE } from "@/lib/store";

const t = "Contact Pantaloons Amritsar – Store Enquiries";
const d = "Send a general enquiry or call Pantaloons at VR Ambarsar Mall, Amritsar on 080 4713 8076.";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" text="Questions about collections, visits or feedback." img={images.accessories} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Get in touch" title="General enquiries">For the fastest answer, call the store directly.</SectionHeading>
          <a href={STORE.tel} className="btn-primary">Call {STORE.phoneDisplay}</a>
          <p className="mt-6 text-sm text-muted-foreground">{STORE.address}</p>
        </div>
        <EnquiryForm />
      </section>
    </>
  ),
});
