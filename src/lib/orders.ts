import { type Product } from "./products";

export type CartItem = {
  id: string; // unique item key: productId-size-color
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  city?: string;
  pincode?: string;
  landmark?: string;
  items: {
    productId: string;
    productName: string;
    categoryLabel: string;
    image: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod" | "upi" | "store_pay";
  status: "Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  notes?: string;
};

const CART_STORAGE_KEY = "pantaloons_store_cart";
const ORDERS_STORAGE_KEY = "pantaloons_store_orders";

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8412",
    customerName: "Manpreet Singh",
    phone: "+91 98721 88402",
    email: "manpreet.amritsar@gmail.com",
    deliveryType: "delivery",
    address: "House 42, Ranjit Avenue, B-Block",
    city: "Amritsar",
    pincode: "143001",
    landmark: "Near Rose Garden",
    items: [
      {
        productId: "prod-m01",
        productName: "Royal Jacquard Silk Men's Kurta",
        categoryLabel: "Men's Ethnic",
        image: "",
        price: 2499,
        size: "42",
        color: "Midnight Navy",
        quantity: 1,
      },
      {
        productId: "prod-ft01",
        productName: "Handcrafted Velvet Embroidered Mojaris",
        categoryLabel: "Footwear Studio",
        image: "",
        price: 1899,
        size: "9",
        color: "Regal Maroon",
        quantity: 1,
      },
    ],
    subtotal: 4398,
    discount: 300,
    deliveryFee: 0,
    total: 4098,
    paymentMethod: "cod",
    status: "Confirmed",
    createdAt: "2026-10-25T14:30:00.000Z",
    notes: "Please pack in festive gift box if possible.",
  },
  {
    id: "ORD-8413",
    customerName: "Navdeep Kaur",
    phone: "+91 98144 55190",
    email: "navdeep.kaur@yahoo.com",
    deliveryType: "pickup",
    city: "Amritsar",
    items: [
      {
        productId: "prod-w01",
        productName: "Embroidered Silk Blend Anarkali Set",
        categoryLabel: "Women's Ethnic",
        image: "",
        price: 3499,
        size: "M",
        color: "Blush Pink",
        quantity: 1,
      },
    ],
    subtotal: 3499,
    discount: 0,
    deliveryFee: 0,
    total: 3499,
    paymentMethod: "store_pay",
    status: "Placed",
    createdAt: "2026-10-26T08:15:00.000Z",
    notes: "Will pick up around 5:00 PM from VR Ambarsar Mall.",
  },
];

// CART UTILITIES
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));
}

export function addToCart(
  product: Product,
  size: string,
  color: string,
  quantity = 1
): CartItem[] {
  const current = getCart();
  const chosenSize = size || product.sizes[0] || "Standard";
  const chosenColor = color || product.colors[0]?.name || "Standard";
  const itemId = `${product.id}-${chosenSize}-${chosenColor}`;

  const existingIndex = current.findIndex((item) => item.id === itemId);
  if (existingIndex >= 0) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({
      id: itemId,
      product,
      size: chosenSize,
      color: chosenColor,
      quantity,
    });
  }

  saveCart(current);
  return current;
}

export function updateCartQuantity(itemId: string, quantity: number): CartItem[] {
  let current = getCart();
  if (quantity <= 0) {
    current = current.filter((item) => item.id !== itemId);
  } else {
    current = current.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
  }
  saveCart(current);
  return current;
}

export function removeFromCart(itemId: string): CartItem[] {
  const current = getCart().filter((item) => item.id !== itemId);
  saveCart(current);
  return current;
}

export function clearCart() {
  saveCart([]);
}

// ORDERS UTILITIES
export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function placeNewOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Order {
  const orders = getStoredOrders();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...data,
    id: `ORD-${randomNum}`,
    status: "Placed",
    createdAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...orders];
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("order-placed", { detail: { order: newOrder } })
    );
  }

  // Cloud sync to Supabase if configured
  import("./supabase").then(({ insertSupabaseOrder }) => {
    insertSupabaseOrder(newOrder).catch((err) =>
      console.warn("Supabase background sync:", err)
    );
  });

  clearCart();
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Order[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  }

  // Cloud sync to Supabase if configured
  import("./supabase").then(({ updateSupabaseOrderStatus }) => {
    updateSupabaseOrderStatus(orderId, status).catch((err) =>
      console.warn("Supabase background status sync:", err)
    );
  });

  return updated;
}

export function deleteOrder(orderId: string): Order[] {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.id !== orderId);
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
