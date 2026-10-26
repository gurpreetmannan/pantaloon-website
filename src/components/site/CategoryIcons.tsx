import type { FC, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const WomenCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#8B4B32]" {...props}>
    {/* Dress silhouette */}
    <path
      d="M24 10 L28 16 L22 24 L20 46 L38 46 L36 24 L30 16 L34 10 Z"
      fill="#A45E43"
      opacity="0.88"
    />
    <path
      d="M28 10 C28 12 30 14 29 14 C28 14 30 12 30 10"
      stroke="#5A2E1D"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Thin belt */}
    <rect x="22" y="24" width="14" height="2" fill="#5A2E1D" rx="0.5" />
    {/* Flared skirt pleats */}
    <path d="M26 26 L24 46 M32 26 L34 46" stroke="#5A2E1D" strokeWidth="1" strokeDasharray="1 2" opacity="0.6" />
    {/* High heels alongside */}
    <path
      d="M44 38 L42 45 L40 45 L40 43 L42 43 L44 38 Z"
      fill="#6B3522"
    />
    <path
      d="M48 40 L46 45 L45 45 L45 43 L46.5 43 L48 40 Z"
      fill="#6B3522"
    />
  </svg>
);

export const MenCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#995335]" {...props}>
    {/* Crisp collared shirt */}
    <path
      d="M20 18 L26 14 L38 14 L44 18 L46 44 L18 44 Z"
      fill="#A65F42"
      opacity="0.9"
    />
    {/* Collar */}
    <path
      d="M26 14 L32 22 L24 20 Z"
      fill="#C78368"
      stroke="#522718"
      strokeWidth="1.2"
    />
    <path
      d="M38 14 L32 22 L40 20 Z"
      fill="#C78368"
      stroke="#522718"
      strokeWidth="1.2"
    />
    {/* Placket & Buttons */}
    <line x1="32" y1="22" x2="32" y2="44" stroke="#522718" strokeWidth="1.5" />
    <circle cx="32" cy="27" r="1" fill="#FFFFFF" />
    <circle cx="32" cy="33" r="1" fill="#FFFFFF" />
    <circle cx="32" cy="39" r="1" fill="#FFFFFF" />
    {/* Breast Pocket */}
    <rect x="23" y="27" width="6" height="7" rx="0.5" fill="#8F4E34" stroke="#522718" strokeWidth="1" />
  </svg>
);

export const KidsCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#7F4E38]" {...props}>
    {/* Child & Parent or Toddler outfit silhouette */}
    {/* Child avatar */}
    <circle cx="27" cy="18" r="4.5" fill="#D3967C" />
    <path
      d="M22 25 C22 23 32 23 32 25 L34 38 L20 38 Z"
      fill="#6C7F60"
      opacity="0.9"
    />
    {/* Parent silhouette alongside */}
    <circle cx="41" cy="14" r="5.5" fill="#C48469" />
    <path
      d="M35 22 C35 20 47 20 47 22 L49 42 L33 42 Z"
      fill="#A25C40"
      opacity="0.85"
    />
  </svg>
);

export const OuterwearCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#3D566E]" {...props}>
    {/* Denim trucker jacket */}
    <path
      d="M17 18 L24 14 L40 14 L47 18 L46 44 L18 44 Z"
      fill="#3A536B"
      opacity="0.9"
    />
    {/* Collar */}
    <path d="M24 14 L30 19 L23 18 Z" fill="#4B6884" stroke="#223342" strokeWidth="1.2" />
    <path d="M40 14 L34 19 L41 18 Z" fill="#4B6884" stroke="#223342" strokeWidth="1.2" />
    {/* Front center seam & buttons */}
    <line x1="32" y1="18" x2="32" y2="44" stroke="#223342" strokeWidth="1.5" />
    {/* Pocket flaps with brass rivets */}
    <path d="M22 23 L28 23 L28 27 L25 29 L22 27 Z" fill="#2E4459" stroke="#223342" strokeWidth="1" />
    <circle cx="25" cy="25" r="0.8" fill="#D4AF37" />
    <path d="M36 23 L42 23 L42 27 L39 29 L36 27 Z" fill="#2E4459" stroke="#223342" strokeWidth="1" />
    <circle cx="39" cy="25" r="0.8" fill="#D4AF37" />
  </svg>
);

export const DenimCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#2F4E68]" {...props}>
    {/* Folded / hanging jeans */}
    <path
      d="M21 16 L43 16 L42 46 L33 46 L32 27 L31 46 L22 46 Z"
      fill="#32506D"
      stroke="#1E3245"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Waistband */}
    <rect x="21" y="16" width="22" height="4" fill="#3D5F82" stroke="#1E3245" strokeWidth="1" />
    {/* Leather brand patch on back */}
    <rect x="36" y="17" width="5" height="2.5" fill="#A86E3C" rx="0.5" />
    {/* Rivet / button */}
    <circle cx="32" cy="18" r="0.9" fill="#D4AF37" />
    {/* Pocket arches */}
    <path d="M23 20 Q26 24 29 20" stroke="#E6A85C" strokeWidth="1" fill="none" />
    <path d="M35 20 Q38 24 41 20" stroke="#E6A85C" strokeWidth="1" fill="none" />
  </svg>
);

export const FestiveCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#8B263E]" {...props}>
    {/* Festive Kurta & Anarkali set */}
    {/* Kurta top */}
    <path
      d="M20 18 L25 14 L33 14 L35 18 L34 44 L20 44 Z"
      fill="#E7DFD2"
      stroke="#8C7355"
      strokeWidth="1.2"
    />
    {/* Zari Gold collar */}
    <path d="M25 14 L29 17 L29 27 L25 27 Z" fill="#D4AF37" />
    {/* Flared festive anarkali / dupatta */}
    <path
      d="M32 20 L37 16 L43 19 L46 44 L31 44 Z"
      fill="#98263E"
      stroke="#5F1626"
      strokeWidth="1.2"
    />
    {/* Gold zari foil prints on lehenga */}
    <circle cx="37" cy="28" r="1.2" fill="#F3D379" />
    <circle cx="41" cy="33" r="1.2" fill="#F3D379" />
    <circle cx="36" cy="38" r="1.2" fill="#F3D379" />
    <circle cx="42" cy="40" r="1.2" fill="#F3D379" />
  </svg>
);

export const AccessoriesCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#7C4931]" {...props}>
    {/* Structured leather tote bag */}
    <path
      d="M20 25 L40 25 L38 45 L22 45 Z"
      fill="#9A593A"
      stroke="#592F1B"
      strokeWidth="1.2"
    />
    {/* Handles */}
    <path
      d="M25 25 C25 18 35 18 35 25"
      stroke="#592F1B"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Sunglasses next to bag */}
    <circle cx="42" cy="36" r="3.5" fill="#222222" stroke="#D4AF37" strokeWidth="1" />
    <circle cx="47" cy="36" r="3.5" fill="#222222" stroke="#D4AF37" strokeWidth="1" />
    <line x1="44" y1="35" x2="45" y2="35" stroke="#D4AF37" strokeWidth="1" />
  </svg>
);

export const FootwearCategoryIcon: FC<IconProps> = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#7D462E]" {...props}>
    {/* Clutch bag */}
    <rect x="26" y="24" width="18" height="12" rx="1.5" fill="#A86144" stroke="#5A2E1C" strokeWidth="1.2" />
    <path d="M26 24 L35 31 L44 24" stroke="#5A2E1C" strokeWidth="1.2" fill="none" />
    <circle cx="35" cy="31" r="1" fill="#D4AF37" />
    {/* Jewelry earrings / bracelets */}
    <circle cx="21" cy="26" r="2.5" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    <circle cx="21" cy="33" r="3.5" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    <circle cx="48" cy="38" r="3" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
  </svg>
);
