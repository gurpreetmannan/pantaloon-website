# Pantaloons – VR Ambarsar Mall, Amritsar: Fashion Store Website

A premium, editorial-style local store discovery site (clearly labeled as an independent concept, not the official Pantaloons site), built exactly from your brief.

## Look and feel
- White backgrounds, charcoal text, warm cream/beige editorial bands, soft grey dividers, muted burgundy accent.
- Elegant serif headlines (Cormorant Garamond) + clean sans body (Karla). Text-based "Pantaloons" wordmark — no logo imitation.
- AI-generated editorial fashion photos of Indian models (hero, 6 categories, looks, stories, gallery) labeled as representative imagery.
- Subtle fade/slide-in animations, smooth hovers.

## Pages
- **Home (/)**: announcement bar, sticky header, hero ("Find Your Style. Own Every Moment."), Shop by Category (6 cards), Trending Looks editorial grid, Style Inspiration teaser, Why Visit (4 cards), Reviews (4.8/5, 473 reviews, 3 attributed excerpts), Gallery with keyboard-accessible lightbox, Visit Store card (Call, Directions via Plus Code, Official listing), Enquiry form, footer.
- **/women, /men, /kids**: category inspiration pages (no fake products, prices, or SKUs).
- **/collections**: all six categories + trending looks.
- **/style-inspiration**: four journal stories with styling tips.
- **/reviews**: full reputation section with "Read Customer Reviews" link and refresh note.
- **/visit-store**: address, phone, closing time (with "verify" note), map embed, buttons.
- **/contact**: enquiry form with validation (name, phone/email, category, message) and privacy notice; on submit shows a confirmation and offers a WhatsApp/phone fallback (no backend storage).

## Navigation
- Desktop links to every page above, search icon opening a quick page/section finder, mobile hamburger drawer.
- No fabricated offers, live open/closed status, or extra testimonials.

## Technical details
- TanStack routes per page, each with unique head() metadata.
- Design tokens in styles.css (oklch), fonts via link in root head.
- Shared components: Header, AnnouncementBar, Footer, CategoryGrid, Lightbox, StoreCard, EnquiryForm (zod validation).
- Images generated into src/assets.
- Enquiry form stays client-side for now; can later be connected to Lovable Cloud to save enquiries.
