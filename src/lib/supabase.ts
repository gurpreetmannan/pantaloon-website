import { createClient } from "@supabase/supabase-js";
import type { Order, CartItem } from "./orders";
import type { Review } from "./reviews";
import type { Product } from "./products";

// Read Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

/**
 * Checks if Supabase is fully configured with valid non-placeholder keys.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project") &&
      !supabaseAnonKey.includes("your-anon-key")
  );
};

// Initialize the Supabase client if configured, otherwise provide null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// 1. ORDERS CLOUD SYNC
// ==========================================

export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch orders error:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      customerName: row.customer_name,
      phone: row.customer_phone || row.phone,
      email: row.customer_email || row.email || undefined,
      deliveryType: row.delivery_type,
      address: row.address || undefined,
      city: row.city || undefined,
      pincode: row.pincode || undefined,
      landmark: row.landmark || undefined,
      items: row.items || [],
      subtotal: Number(row.subtotal),
      deliveryCharge: Number(row.delivery_charge || 0),
      total: Number(row.total),
      status: row.status,
      createdAt: row.created_at,
      paymentMethod: row.payment_method || "Cash on Delivery",
    }));
  } catch (err) {
    console.warn("Supabase fetch orders exception:", err);
    return null;
  }
}

export async function insertSupabaseOrder(order: Order): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("orders").insert([
      {
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.phone,
        customer_email: order.email || null,
        delivery_type: order.deliveryType,
        address: order.address || null,
        city: order.city || null,
        pincode: order.pincode || null,
        landmark: order.landmark || null,
        items: order.items,
        subtotal: order.subtotal,
        delivery_charge: order.deliveryCharge,
        total: order.total,
        status: order.status,
        payment_method: order.paymentMethod,
        created_at: order.createdAt,
      },
    ]);

    if (error) {
      console.warn("Supabase insert order error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase insert order exception:", err);
    return false;
  }
}

export async function updateSupabaseOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.warn("Supabase update status error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase update status exception:", err);
    return false;
  }
}

// ==========================================
// 2. REVIEWS CLOUD SYNC
// ==========================================

export async function fetchSupabaseReviews(): Promise<Review[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch reviews error:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      author: row.author,
      rating: Number(row.rating),
      date: row.date || new Date(row.created_at).toLocaleDateString(),
      location: row.location || "VR Ambarsar Shopper",
      content: row.content,
      verified: Boolean(row.verified ?? true),
      badge: row.badge || undefined,
      status: row.status || "approved",
    }));
  } catch (err) {
    console.warn("Supabase fetch reviews exception:", err);
    return null;
  }
}

export async function insertSupabaseReview(review: Review): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("reviews").insert([
      {
        id: review.id,
        author: review.author,
        rating: review.rating,
        date: review.date,
        location: review.location,
        content: review.content,
        verified: review.verified,
        badge: review.badge || null,
        status: review.status,
      },
    ]);

    if (error) {
      console.warn("Supabase insert review error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase insert review exception:", err);
    return false;
  }
}

// ==========================================
// 3. BOOKINGS (VIP CONSULTATIONS) SYNC
// ==========================================

export async function fetchSupabaseBookings(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch bookings error:", error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetch bookings exception:", err);
    return null;
  }
}

export async function insertSupabaseBooking(booking: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("bookings").insert([
      {
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        email: booking.email || null,
        category: booking.category,
        preferred_date: booking.preferredDate,
        time_slot: booking.timeSlot,
        notes: booking.notes || null,
        status: booking.status || "Confirmed",
        created_at: booking.createdAt || new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("Supabase insert booking error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase insert booking exception:", err);
    return false;
  }
}

// ==========================================
// 4. SITE SETTINGS & MAINTENANCE SYNC
// ==========================================

export async function fetchSupabaseSiteSettings(): Promise<{
  isOnline: boolean;
  maintenanceMessage: string;
} | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "global")
      .single();

    if (error) {
      console.warn("Supabase fetch settings error:", error.message);
      return null;
    }

    if (data) {
      return {
        isOnline: Boolean(data.is_site_online),
        maintenanceMessage: data.maintenance_message || "",
      };
    }
    return null;
  } catch (err) {
    console.warn("Supabase fetch settings exception:", err);
    return null;
  }
}

export async function updateSupabaseSiteSettings(
  isOnline: boolean,
  maintenanceMessage: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("site_settings").upsert({
      id: "global",
      is_site_online: isOnline,
      maintenance_message: maintenanceMessage,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Supabase update settings error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase update settings exception:", err);
    return false;
  }
}
