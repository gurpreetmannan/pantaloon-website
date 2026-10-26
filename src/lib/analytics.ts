export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  timeSlot: string;
  guests: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
};

export type StoreEnquiry = {
  id: string;
  name: string;
  contact: string;
  category: string;
  message: string;
  createdAt: string;
  status: "New" | "Contacted" | "Closed";
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-9481",
    customerName: "Simran Dhillon",
    phone: "+91 98721 44510",
    email: "simran.dhillon@gmail.com",
    service: "Bridal & Festive Lehenga VIP Styling",
    date: "2026-10-25",
    timeSlot: "02:00 PM - 03:30 PM",
    guests: 3,
    status: "Confirmed",
    notes: "Looking for pastel gold anarkali & matching jewelry for brother's wedding.",
    createdAt: "2026-10-24T10:15:00.000Z",
  },
  {
    id: "BK-9482",
    customerName: "Gurpreet Singh",
    phone: "+91 98140 88291",
    email: "gurpreet.singh@outlook.com",
    service: "Menswear Bandhgala & Suit Tailoring",
    date: "2026-10-25",
    timeSlot: "04:30 PM - 05:30 PM",
    guests: 1,
    status: "Confirmed",
    notes: "Requires custom fitting on chocolate brown jodhpuri coat.",
    createdAt: "2026-10-24T11:40:00.000Z",
  },
  {
    id: "BK-9483",
    customerName: "Harpreet Kaur",
    phone: "+91 98882 12904",
    email: "harpreet.amritsar@yahoo.com",
    service: "Family Festive Shopping Curation",
    date: "2026-10-26",
    timeSlot: "11:30 AM - 01:00 PM",
    guests: 4,
    status: "Pending",
    notes: "Wants coordinated outfits for family of four for Diwali celebrations.",
    createdAt: "2026-10-24T13:20:00.000Z",
  },
  {
    id: "BK-9484",
    customerName: "Rajinder Sharma",
    phone: "+91 98765 33412",
    email: "r.sharma@gmail.com",
    service: "Executive Wardrobe & Smart Casuals",
    date: "2026-10-24",
    timeSlot: "01:00 PM - 02:00 PM",
    guests: 1,
    status: "Completed",
    notes: "Purchased 4 linen shirts & 2 tailored chinos. Fitting verified.",
    createdAt: "2026-10-23T16:05:00.000Z",
  },
  {
    id: "BK-9485",
    customerName: "Amanat Sandhu",
    phone: "+91 98155 77190",
    email: "amanat.sandhu@gmail.com",
    service: "Kids Festive Wear Fitting & Styling",
    date: "2026-10-27",
    timeSlot: "03:00 PM - 04:00 PM",
    guests: 2,
    status: "Confirmed",
    notes: "Sizes needed: 4-5 yrs girl ethnic kurti set and 8 yrs boy kurta pajama.",
    createdAt: "2026-10-24T14:10:00.000Z",
  },
  {
    id: "BK-9486",
    customerName: "Vikramjit Gill",
    phone: "+91 99142 66782",
    service: "Royal Sherwani & Turban Matching",
    date: "2026-10-28",
    timeSlot: "05:00 PM - 06:30 PM",
    guests: 2,
    status: "Pending",
    notes: "Wants wedding reception look trial.",
    createdAt: "2026-10-24T15:45:00.000Z",
  },
];

const INITIAL_ENQUIRIES: StoreEnquiry[] = [
  {
    id: "ENQ-501",
    name: "Navjot Chawla",
    contact: "+91 98761 23450",
    category: "Collections & styles",
    message: "Do you have the new winter velvet kurta sets in stock at VR Ambarsar branch?",
    createdAt: "2026-10-24T09:30:00.000Z",
    status: "New",
  },
  {
    id: "ENQ-502",
    name: "Karanbir Bhatia",
    contact: "karanbir.bhatia@gmail.com",
    category: "Store visit & timings",
    message: "Is parking readily available on weekends near Lower Ground Floor entry?",
    createdAt: "2026-10-24T12:15:00.000Z",
    status: "Contacted",
  },
  {
    id: "ENQ-503",
    name: "Mehak Preet",
    contact: "+91 98144 99011",
    category: "General enquiry",
    message: "Can we request alterations for garments purchased during festive sale?",
    createdAt: "2026-10-23T18:00:00.000Z",
    status: "Closed",
  },
];

const STORAGE_KEYS = {
  BOOKINGS: "pantaloons_store_bookings",
  ENQUIRIES: "pantaloons_store_enquiries",
  PAGE_VIEWS: "pantaloons_page_views",
  VISITOR_ID: "pantaloons_visitor_id",
  AUTH: "pantaloons_admin_authorized",
};

export function recordPageView(path: string = "/") {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS);
    const data = raw ? JSON.parse(raw) : { total: 14820, today: 486, paths: {} };
    data.total = (data.total || 14820) + 1;
    data.today = (data.today || 486) + 1;
    data.paths = data.paths || {};
    data.paths[path] = (data.paths[path] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to record page view", err);
  }
}

export function getTrafficAnalytics() {
  if (typeof window === "undefined") {
    return {
      totalViews: 14820,
      todayViews: 486,
      uniqueCustomers: 3240,
      activeNow: 24,
      conversionRate: "4.8%",
      dailyTraffic: [
        { day: "Mon", views: 1840, visitors: 1120, bookings: 12 },
        { day: "Tue", views: 1950, visitors: 1210, bookings: 15 },
        { day: "Wed", views: 2100, visitors: 1340, bookings: 18 },
        { day: "Thu", views: 2450, visitors: 1580, bookings: 22 },
        { day: "Fri", views: 2890, visitors: 1890, bookings: 29 },
        { day: "Sat", views: 3450, visitors: 2240, bookings: 38 },
        { day: "Sun", views: 3780, visitors: 2460, bookings: 42 },
      ],
      categoryBreakdown: [
        { name: "Festive & Ethnic", views: 5420, share: "36%" },
        { name: "Women's Casual", views: 3680, share: "25%" },
        { name: "Men's Formal/Casual", views: 2840, share: "19%" },
        { name: "Kids Apparel", views: 1650, share: "11%" },
        { name: "Accessories & Bags", views: 1230, share: "9%" },
      ],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS);
    const parsed = raw ? JSON.parse(raw) : null;
    const totalViews = parsed?.total || 14820;
    const todayViews = parsed?.today || 486;

    return {
      totalViews,
      todayViews,
      uniqueCustomers: Math.round(totalViews * 0.22),
      activeNow: 18 + Math.floor(Math.random() * 12),
      conversionRate: "4.8%",
      dailyTraffic: [
        { day: "Mon", views: 1840, visitors: 1120, bookings: 12 },
        { day: "Tue", views: 1950, visitors: 1210, bookings: 15 },
        { day: "Wed", views: 2100, visitors: 1340, bookings: 18 },
        { day: "Thu", views: 2450, visitors: 1580, bookings: 22 },
        { day: "Fri", views: 2890, visitors: 1890, bookings: 29 },
        { day: "Sat", views: 3450, visitors: 2240, bookings: 38 },
        { day: "Sun", views: 3780 + (todayViews % 50), visitors: 2460, bookings: 42 },
      ],
      categoryBreakdown: [
        { name: "Festive & Ethnic", views: 5420, share: "36%" },
        { name: "Women's Casual", views: 3680, share: "25%" },
        { name: "Men's Formal/Casual", views: 2840, share: "19%" },
        { name: "Kids Apparel", views: 1650, share: "11%" },
        { name: "Accessories & Bags", views: 1230, share: "9%" },
      ],
    };
  } catch {
    return {
      totalViews: 14820,
      todayViews: 486,
      uniqueCustomers: 3240,
      activeNow: 24,
      conversionRate: "4.8%",
      dailyTraffic: [],
      categoryBreakdown: [],
    };
  }
}

export function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveNewBooking(
  booking: Omit<Booking, "id" | "createdAt" | "status">
): Booking {
  const current = getStoredBookings();
  const newBooking: Booking = {
    ...booking,
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking[] {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return updated;
}

export function deleteBooking(id: string): Booking[] {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredEnquiries(): StoreEnquiry[] {
  if (typeof window === "undefined") return INITIAL_ENQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
      return INITIAL_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

export function saveNewEnquiry(enquiry: Omit<StoreEnquiry, "id" | "createdAt" | "status">): StoreEnquiry {
  const current = getStoredEnquiries();
  const newEnquiry: StoreEnquiry = {
    ...enquiry,
    id: `ENQ-${Math.floor(500 + Math.random() * 500)}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const updated = [newEnquiry, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
  }
  return newEnquiry;
}

export function updateEnquiryStatus(id: string, status: StoreEnquiry["status"]): StoreEnquiry[] {
  const current = getStoredEnquiries();
  const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
  }
  return updated;
}

export function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true";
}

export function setAdminAuth(authorized: boolean) {
  if (typeof window === "undefined") return;
  if (authorized) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}
