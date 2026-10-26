import { Link } from "@tanstack/react-router";
import { PageHero, SectionHeading, VisitStore } from "./Sections";
import { ProductExplorer } from "./ProductExplorer";
import type { ProductCategory } from "@/lib/products";

export function CategoryPage({
  eyebrow,
  title,
  intro,
  img,
  ideas,
  gallery,
  category,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  img: string;
  ideas: { t: string; d: string }[];
  gallery: string[];
  category?: ProductCategory;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} img={img} />

      {/* Real In-Store Products Catalog for this category */}
      {category && (
        <ProductExplorer
          initialCategory={category}
          title={`Explore ${eyebrow}'s Collection`}
          subtitle={`Discover premium ${eyebrow.toLowerCase()} styles, fabrics, and sizes currently available at Pantaloons VR Ambarsar Mall.`}
        />
      )}

      {/* Style Ideas & Inspiration */}
      <section className="mx-auto max-w-7xl px-5 py-20 border-t border-stone-200/60">
        <SectionHeading eyebrow="Curator's Notes" title="Styling ideas for the season">
          Curated styling advice and outfit pairing suggestions from the fashion desk at Pantaloons VR Ambarsar Mall.
        </SectionHeading>
        <div className="grid gap-10 md:grid-cols-3">
          {ideas.map((i, n) => (
            <div key={i.t} className="border-t border-foreground pt-6">
              <p className="text-xs text-accent font-mono font-semibold">0{n + 1}</p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-normal uppercase tracking-wide">{i.t}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((g, i) => (
            <img
              key={i}
              src={g}
              alt="Pantaloons fashion gallery"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-500"
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/collections" className="btn-outline">
            Browse All Collections
          </Link>
        </div>
      </section>

      <VisitStore />
    </>
  );
}
