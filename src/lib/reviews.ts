export type CustomerReview = {
  id: string;
  name: string;
  city: string;
  rating: number; // 1 to 5
  text: string;
  categoryVisited:
    | "Festive & Ethnic"
    | "Casual & Western"
    | "Menswear"
    | "Kids Fashion"
    | "Overall Store & Service";
  recommendStore: boolean;
  verifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
};

const REVIEWS_STORAGE_KEY = "pantaloons_store_reviews";

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "REV-101",
    name: "Dipanshu Kumar",
    city: "Ranjit Avenue, Amritsar",
    rating: 5,
    text: "Loved my shopping experience at VR Ambarsar! Wide variety of Indian and western festive wear. The store staff was exceptionally polite and helped me select matching dupattas.",
    categoryVisited: "Festive & Ethnic",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-24",
    helpfulCount: 18,
  },
  {
    id: "REV-102",
    name: "Parambir Singh Param",
    city: "Mall Road, Amritsar",
    rating: 5,
    text: "Praised the helpful service from the store team. The new season wedding kurtas and bandhgala jackets collection is top notch. Premium fabric and prompt billing.",
    categoryVisited: "Menswear",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-22",
    helpfulCount: 14,
  },
  {
    id: "REV-103",
    name: "Harpreet Kaur Sandhu",
    city: "Green Avenue, Amritsar",
    rating: 5,
    text: "Best Pantaloons showroom in the region! Super spacious, well air-conditioned, and kid-friendly. We bought festive outfits for the whole family under one roof.",
    categoryVisited: "Overall Store & Service",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-20",
    helpfulCount: 22,
  },
  {
    id: "REV-104",
    name: "Vineet Kumar",
    city: "Circular Road, Amritsar",
    rating: 5,
    text: "Comfortable breathable cotton fabrics and stylish casual wear. The denim fit trials and linen shirts collection were impressive.",
    categoryVisited: "Casual & Western",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-18",
    helpfulCount: 9,
  },
  {
    id: "REV-105",
    name: "Gurpreet Singh Gill",
    city: "Majitha Road, Amritsar",
    rating: 4,
    text: "Great festive sale discounts. The in-house alteration counter hemmed my formal trousers within 25 minutes while we browsed perfumes.",
    categoryVisited: "Menswear",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-15",
    helpfulCount: 11,
  },
  {
    id: "REV-106",
    name: "Simranjeet Kaur",
    city: "Chheharta, Amritsar",
    rating: 5,
    text: "Purchased ethnic kurtas and festive accessories. Staff at the VIP styling consultation counter gave thoughtful color combination suggestions.",
    categoryVisited: "Festive & Ethnic",
    recommendStore: true,
    verifiedPurchase: true,
    date: "2026-10-12",
    helpfulCount: 16,
  },
];

export function getStoredReviews(): CustomerReview[] {
  if (typeof window === "undefined") {
    return INITIAL_REVIEWS;
  }

  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REVIEWS;
  } catch (err) {
    console.error("Failed to read stored reviews:", err);
    return INITIAL_REVIEWS;
  }
}

export function saveNewReview(
  reviewData: Omit<CustomerReview, "id" | "date" | "helpfulCount">
): CustomerReview {
  const current = getStoredReviews();
  const newReview: CustomerReview = {
    ...reviewData,
    id: `REV-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split("T")[0],
    helpfulCount: 0,
  };

  const updated = [newReview, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("pantaloons_reviews_updated"));
    } catch (err) {
      console.error("Failed to persist new review:", err);
    }
  }

  return newReview;
}

export function markReviewHelpful(reviewId: string): CustomerReview[] {
  const current = getStoredReviews();
  const updated = current.map((r) =>
    r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
  );

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("pantaloons_reviews_updated"));
    } catch (err) {
      console.error("Failed to mark review helpful:", err);
    }
  }

  return updated;
}

export function deleteStoredReview(reviewId: string): CustomerReview[] {
  const current = getStoredReviews();
  const updated = current.filter((r) => r.id !== reviewId);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("pantaloons_reviews_updated"));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  }

  return updated;
}

export function getReviewStats(reviews: CustomerReview[] = getStoredReviews()) {
  const totalCount = reviews.length;
  if (totalCount === 0) {
    return {
      averageRating: 5.0,
      totalCount: 0,
      recommendPercentage: 100,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = Number((sum / totalCount).toFixed(1));

  const recommendedCount = reviews.filter((r) => r.recommendStore).length;
  const recommendPercentage = Math.round((recommendedCount / totalCount) * 100);

  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    breakdown[star] = (breakdown[star] || 0) + 1;
  }

  return {
    averageRating,
    totalCount,
    recommendPercentage,
    breakdown,
  };
}
