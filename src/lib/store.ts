import hero from "@/assets/hero.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import women from "@/assets/women.jpg";
import men from "@/assets/men.jpg";
import kids from "@/assets/kids.jpg";
import denim from "@/assets/denim.jpg";
import festive from "@/assets/festive.jpg";
import accessories from "@/assets/accessories.jpg";
import store from "@/assets/store.jpg";
import dailyEssentials from "@/assets/daily-essentials.jpg";
import smartCasual from "@/assets/smart-casual.jpg";
import festiveReady from "@/assets/festive-ready.jpg";

export const images = {
  hero,
  heroBanner,
  women,
  men,
  kids,
  denim,
  festive,
  accessories,
  store,
  dailyEssentials,
  smartCasual,
  festiveReady,
};

export const STORE = {
  name: "Pantaloons – VR Ambarsar Mall",
  address:
    "Lower Ground Floor, VR Ambarsar Mall, Circular Road, inside Trilium Mall, Nirankari Colony, Amritsar, Punjab 143001, India",
  shortAddress: "VR Ambarsar Mall, Circular Rd, Amritsar 143001",
  phoneDisplay: "080 4713 8076",
  tel: "tel:+918047138076",
  plusCode: "MV5H+84 Amritsar, Punjab",
  directions:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Pantaloons VR Ambarsar Mall Amritsar"),
  mapEmbed:
    "https://maps.google.com/maps?q=" +
    encodeURIComponent("Pantaloons VR Ambarsar Mall Amritsar") +
    "&output=embed",
  official:
    "https://stores.pantaloons.com/pantaloons/stores-in-amritsar/stores-in-medical-enclave/pantaloons-in-medical-enclave-amritsar--ac590a12-c7a9-4df7-8bae-a79edaa41ea5/home",
  reviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Pantaloons VR Ambarsar Mall Amritsar"),
  shopping: "https://www.google.co.in/search?hl=en&gl=IN&udm=28&q=Pantaloons",
  closing: "10:00 PM",
  rating: 4.8,
  reviewCount: 473,
};

export type Category = {
  slug: string;
  title: string;
  desc: string;
  img: string;
  to: "/women" | "/men" | "/kids" | "/collections";
};

export const categories: Category[] = [
  { slug: "women", title: "Women's Fashion", desc: "Contemporary dresses, tops, denim and styling inspiration.", img: women, to: "/women" },
  { slug: "men", title: "Men's Fashion", desc: "Shirts, T-shirts, trousers, jeans and smart-casual looks.", img: men, to: "/men" },
  { slug: "kids", title: "Kids' Fashion", desc: "Playful, comfortable clothing and family shopping ideas.", img: kids, to: "/kids" },
  { slug: "denim", title: "Denim & Casualwear", desc: "Versatile denim, easy T-shirts and everyday outfits.", img: denim, to: "/collections" },
  { slug: "festive", title: "Occasion & Festive Style", desc: "Polished outfits for celebrations and special events.", img: festive, to: "/collections" },
  { slug: "accessories", title: "Accessories & Styling", desc: "Finishing touches that complete every look.", img: accessories, to: "/collections" },
];

export type ShopCategory = {
  id: string;
  title: string;
  tagline: string;
  img: string;
  to: "/women" | "/men" | "/kids" | "/collections";
  type: "women" | "men" | "kids" | "outerwear" | "denim" | "festive" | "accessories" | "footwear";
};

export const shopCategories: ShopCategory[] = [
  { id: "womens", title: "WOMEN'S", tagline: "Contemporary dresses & festive wear", img: women, to: "/women", type: "women" },
  { id: "mens", title: "MEN'S", tagline: "Shirts, chinos & smart essentials", img: men, to: "/men", type: "men" },
  { id: "kids", title: "KIDS", tagline: "Playful comfort for boys & girls", img: kids, to: "/kids", type: "kids" },
  { id: "outerwear", title: "OUTERWEAR", tagline: "Denim jackets & seasonal layers", img: denim, to: "/collections", type: "outerwear" },
  { id: "denim", title: "DENIM", tagline: "Signature jeans & casual fits", img: dailyEssentials, to: "/collections", type: "denim" },
  { id: "festive", title: "FESTIVE", tagline: "Royal celebration kurtas & lehengas", img: festive, to: "/collections", type: "festive" },
  { id: "accessories", title: "ACCESSORIES", tagline: "Handcrafted bags & jewelry", img: accessories, to: "/collections", type: "accessories" },
  { id: "footwear", title: "FOOTWEAR", tagline: "Festive heels, shoes & styling", img: festiveReady, to: "/collections", type: "footwear" },
];

export const trendingLooks = [
  {
    id: "daily-essentials",
    title: "DAILY ESSENTIALS",
    desc: "Crisp charcoal crewneck, dark rinse denim, white sneakers, leather belt & timepiece",
    tag: "EVERYDAY",
    img: dailyEssentials,
    items: [
      { name: "Charcoal Cotton Crewneck", category: "T-Shirt" },
      { name: "Dark Indigo Slim-Fit Denim", category: "Bottoms" },
      { name: "Full Grain Leather Belt", category: "Accessories" },
      { name: "Minimalist Leather Strap Watch", category: "Watches" },
      { name: "Low-Profile White Sneakers", category: "Footwear" },
    ],
  },
  {
    id: "smart-casual",
    title: "SMART-CASUAL",
    desc: "White oxford button-down, rust fine-knit sweater, tailored beige chinos & leather watch",
    tag: "WORK & CASUAL",
    img: smartCasual,
    items: [
      { name: "Classic White Oxford Shirt", category: "Shirts" },
      { name: "Burnt Orange Rust Knit Pullover", category: "Knitwear" },
      { name: "Tailored Chino Trousers in Sand", category: "Trousers" },
      { name: "Classic Watch with Brown Leather Band", category: "Accessories" },
    ],
  },
  {
    id: "festive-ready",
    title: "FESTIVE READY",
    desc: "Ivory zari-embroidered silk kurta, flared printed maroon anarkali & handcrafted bangles",
    tag: "CELEBRATIONS",
    img: festiveReady,
    items: [
      { name: "Ivory Silk Kurta with Gold Zari Collar", category: "Ethnic Men" },
      { name: "Maroon Foil-Printed Anarkali Ensemble", category: "Ethnic Women" },
      { name: "Dual-Tone Metallic Bangles & Kadas", category: "Jewellery" },
      { name: "Tailored Beige Churidar / Trouser", category: "Ethnic Bottoms" },
    ],
  },
];

export const looks = [
  { title: "Contemporary Everyday", tag: "Daily", img: women },
  { title: "Relaxed Weekend", tag: "Casual", img: denim },
  { title: "Office & Smart-Casual", tag: "Work", img: men },
  { title: "Modern Denim Pairings", tag: "Denim", img: denim },
  { title: "Family Celebrations", tag: "Occasion", img: festive },
  { title: "Seasonal Colour Stories", tag: "Seasonal", img: accessories },
];

export const stories = [
  { title: "Everyday Style, Effortlessly Done", tip: "Build around one neutral base — cream, beige or white — and change the mood with a single coloured layer or accessory.", img: women },
  { title: "Smart-Casual Looks for Every Occasion", tip: "A crisp linen shirt with tailored chinos moves easily from office meetings to dinner. Roll the sleeves for a relaxed finish.", img: men },
  { title: "Fresh Ways to Style Your Denim", tip: "Try tonal denim — a lighter jacket over darker jeans — with a plain white tee to keep the look clean and modern.", img: denim },
  { title: "Dress Up for Celebrations", tip: "Rich jewel tones like burgundy with subtle embroidery feel festive without being overwhelming. Let one statement piece lead.", img: festive },
];

export const reviews = [
  { name: "Dipanshu Kumar", text: "Loved my shopping experience, wide variety of Indian and western festive wear... store staff is polite and helpful." },
  { name: "Parambir Singh Param", text: "Praised the helpful service from the store staff and the extensive new season range." },
  { name: "Vineet Kumar", text: "Mentioned comfortable fabrics and the collection of trousers, shirts and kurtas." },
];

export const gallery = [
  { src: store, alt: "Representative fashion store interior with clothing racks", label: "Interior" },
  { src: women, alt: "Woman in a cream embroidered dress", label: "Fashion & Dresses" },
  { src: festive, alt: "Woman in a burgundy festive kurta set", label: "Occasion" },
  { src: men, alt: "Man in a light blue linen shirt", label: "Menswear" },
  { src: denim, alt: "Couple wearing denim jackets", label: "Denim" },
  { src: accessories, alt: "Leather handbag, sunglasses and watch", label: "Accessories" },
  { src: kids, alt: "Smiling children in colourful outfits", label: "Kids" },
];
