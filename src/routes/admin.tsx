import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Eye,
  Calendar,
  MessageSquare,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  Search,
  Plus,
  RefreshCw,
  Download,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Sparkles,
  LogOut,
  ChevronRight,
  Filter,
  ShoppingBag,
  Tag,
  Check,
  AlertCircle,
  Home,
  Truck,
  Store,
  Package,
  ExternalLink,
  Printer,
  FileText,
  X,
  Crown,
  Power,
  Key,
  UserPlus,
  UserX,
  ShieldAlert,
  Radio,
  History,
  Sliders,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getTrafficAnalytics,
  getStoredBookings,
  getStoredEnquiries,
  updateBookingStatus,
  deleteBooking,
  saveNewBooking,
  updateEnquiryStatus,
  checkAdminAuth,
  setAdminAuth,
  type Booking,
  type BookingStatus,
  type StoreEnquiry,
} from "@/lib/analytics";
import {
  getStoredProducts,
  saveProduct,
  deleteProduct,
  toggleProductStock,
  resetProductsToDefault,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import {
  getStoredOrders,
  updateOrderStatus,
  deleteOrder,
  type Order,
} from "@/lib/orders";
import {
  getStoredReviews,
  deleteStoredReview,
  type CustomerReview,
} from "@/lib/reviews";
import {
  getStoredAdmins,
  saveNewAdmin,
  deleteAdmin,
  toggleAdminStatus,
  updateAdminPasscode,
  getSiteSettings,
  updateSiteSettings,
  toggleSiteOnlineStatus,
  verifyAdminPasscode,
  checkSuperAdminAuth,
  setSuperAdminAuth,
  getAuditLogs,
  addAuditLog,
  type AdminAccount,
  type SiteSettings,
  type AuditLog,
  type AdminRole,
} from "@/lib/superadmin";
import { STORE, images } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Pantaloons Amritsar — Store Admin & Order Management" },
      {
        name: "description",
        content:
          "Management dashboard for store orders, catalog inventory, bookings, and customer enquiries.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminAccount | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Data states
  const [analytics, setAnalytics] = useState(getTrafficAnalytics());
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderForModal, setSelectedOrderForModal] =
    useState<Order | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<StoreEnquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Super Admin Add Admin Modal state
  const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>("");
  const [newAdminEmail, setNewAdminEmail] = useState<string>("");
  const [newAdminPhone, setNewAdminPhone] = useState<string>("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("Store Manager");
  const [newAdminPasscode, setNewAdminPasscode] = useState<string>("123456");

  // Super Admin Edit Settings form state
  const [settingsMaintenanceTitle, setSettingsMaintenanceTitle] = useState<string>("");
  const [settingsMaintenanceMsg, setSettingsMaintenanceMsg] = useState<string>("");
  const [settingsEmergencyActive, setSettingsEmergencyActive] = useState<boolean>(false);
  const [settingsEmergencyText, setSettingsEmergencyText] = useState<string>("");
  const [settingsPhone, setSettingsPhone] = useState<string>("");
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState<boolean>(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    | "orders"
    | "bookings"
    | "products"
    | "traffic"
    | "enquiries"
    | "reviews"
    | "superadmin_site"
    | "superadmin_admins"
    | "superadmin_logs"
  >("orders");

  // Filter states
  const [orderFilter, setOrderFilter] = useState<string>("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
  const [bookingFilter, setBookingFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] =
    useState<string>("all");
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");

  // New Booking Modal state
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>("");
  const [newCustPhone, setNewCustPhone] = useState<string>("");
  const [newCustService, setNewCustService] = useState<string>(
    "Bridal & Festive Lehenga VIP Styling"
  );
  const [newCustDate, setNewCustDate] = useState<string>("2026-10-26");
  const [newCustTime, setNewCustTime] = useState<string>(
    "03:00 PM - 04:30 PM"
  );
  const [newCustGuests, setNewCustGuests] = useState<number>(2);
  const [newCustNotes, setNewCustNotes] = useState<string>("");

  // New Product Modal state
  const [showNewProductModal, setShowNewProductModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState<string>("");
  const [newProdCategory, setNewProdCategory] =
    useState<ProductCategory>("women");
  const [newProdPrice, setNewProdPrice] = useState<number>(1999);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState<number>(2999);
  const [newProdBadge, setNewProdBadge] = useState<
    "Bestseller" | "New Season" | "Festive '26" | "Trending" | "Staff Pick"
  >("New Season");
  const [newProdFabric, setNewProdFabric] = useState<string>("Pure Cotton");
  const [newProdSizes, setNewProdSizes] = useState<string>("S, M, L, XL");
  const [newProdDesc, setNewProdDesc] = useState<string>("");

  const refreshAllData = () => {
    setOrders(getStoredOrders());
    setBookings(getStoredBookings());
    setEnquiries(getStoredEnquiries());
    setProducts(getStoredProducts());
    setReviewsList(getStoredReviews());
    setAnalytics(getTrafficAnalytics());
    const sets = getSiteSettings();
    setSiteSettings(sets);
    setSettingsMaintenanceTitle(sets.maintenanceTitle);
    setSettingsMaintenanceMsg(sets.maintenanceMessage);
    setSettingsEmergencyActive(sets.emergencyBannerActive);
    setSettingsEmergencyText(sets.emergencyBannerText);
    setSettingsPhone(sets.storeContactPhone);
    setAdminAccounts(getStoredAdmins());
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    setIsMounted(true);
    const superAuth = checkSuperAdminAuth();
    const normalAuth = checkAdminAuth();
    if (superAuth) {
      setIsAuthenticated(true);
      setIsSuperAdmin(true);
    } else if (normalAuth) {
      setIsAuthenticated(true);
      setIsSuperAdmin(false);
    }
    refreshAllData();

    const handleOrderPlaced = () => refreshAllData();
    const handleReviewsUpdated = () => setReviewsList(getStoredReviews());
    const handleAdminsUpdated = () => setAdminAccounts(getStoredAdmins());
    const handleSettingsUpdated = () => setSiteSettings(getSiteSettings());
    const handleLogsUpdated = () => setAuditLogs(getAuditLogs());

    window.addEventListener("order-placed", handleOrderPlaced);
    window.addEventListener("pantaloons_reviews_updated", handleReviewsUpdated);
    window.addEventListener("pantaloons_admins_updated", handleAdminsUpdated);
    window.addEventListener("pantaloons_site_settings_updated", handleSettingsUpdated);
    window.addEventListener("pantaloons_audit_logs_updated", handleLogsUpdated);

    return () => {
      window.removeEventListener("order-placed", handleOrderPlaced);
      window.removeEventListener("pantaloons_reviews_updated", handleReviewsUpdated);
      window.removeEventListener("pantaloons_admins_updated", handleAdminsUpdated);
      window.removeEventListener("pantaloons_site_settings_updated", handleSettingsUpdated);
      window.removeEventListener("pantaloons_audit_logs_updated", handleLogsUpdated);
    };
  }, []);

  const handleDeleteReview = (id: string) => {
    if (window.confirm("Remove this customer review from store records?")) {
      const updated = deleteStoredReview(id);
      setReviewsList(updated);
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = passwordInput.trim();
    const result = verifyAdminPasscode(input);
    if (result.authorized) {
      setAdminAuth(true);
      setIsAuthenticated(true);
      setIsSuperAdmin(result.isSuperAdmin);
      setSuperAdminAuth(result.isSuperAdmin);
      setCurrentAdminUser(result.admin || null);
      setAuthError(null);
      if (result.isSuperAdmin) {
        setActiveTab("superadmin_site");
      }
    } else {
      setAuthError(
        "Incorrect passcode. Enter 12345678 for Super Admin or 123456 for Store Admin."
      );
    }
  };

  const handleQuickUnlockSuperAdmin = () => {
    setPasswordInput("12345678");
    setAdminAuth(true);
    setSuperAdminAuth(true);
    setIsAuthenticated(true);
    setIsSuperAdmin(true);
    setAuthError(null);
    setActiveTab("superadmin_site");
  };

  const handleQuickUnlockStoreAdmin = () => {
    setPasswordInput("123456");
    setAdminAuth(true);
    setSuperAdminAuth(false);
    setIsAuthenticated(true);
    setIsSuperAdmin(false);
    setAuthError(null);
    setActiveTab("orders");
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setSuperAdminAuth(false);
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setCurrentAdminUser(null);
    setPasswordInput("");
  };

  const handleToggleKillSwitch = () => {
    const nextState = !siteSettings.isSiteOnline;
    const updated = toggleSiteOnlineStatus(nextState);
    setSiteSettings(updated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateSiteSettings({
      maintenanceTitle: settingsMaintenanceTitle,
      maintenanceMessage: settingsMaintenanceMsg,
      emergencyBannerActive: settingsEmergencyActive,
      emergencyBannerText: settingsEmergencyText,
      storeContactPhone: settingsPhone,
    });
    setSiteSettings(updated);
    addAuditLog(
      "Site Settings Updated",
      "Super Admin",
      "Updated maintenance configuration & store contact helpline",
      "system"
    );
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 2500);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminPasscode.trim()) return;

    saveNewAdmin({
      name: newAdminName.trim(),
      email:
        newAdminEmail.trim() ||
        `${newAdminName.toLowerCase().replace(/\s+/g, ".")}@pantaloons.in`,
      phone: newAdminPhone.trim() || "+91 98721 00000",
      role: newAdminRole,
      passcode: newAdminPasscode.trim(),
      status: "Active",
    });

    setShowAddAdminModal(false);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPhone("");
    setNewAdminPasscode("123456");
    setAdminAccounts(getStoredAdmins());
  };

  const handleDeleteAdminAccount = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete admin account "${name}"?`
      )
    ) {
      const result = deleteAdmin(id);
      alert(result.message);
      if (result.success) {
        setAdminAccounts(result.admins);
      }
    }
  };

  const handleToggleAdminAccountStatus = (id: string) => {
    const updated = toggleAdminStatus(id);
    setAdminAccounts(updated);
  };

  const handleResetPasscode = (id: string, name: string) => {
    const newPass = window.prompt(`Enter new passcode for ${name}:`, "123456");
    if (newPass && newPass.trim()) {
      const updated = updateAdminPasscode(id, newPass.trim());
      setAdminAccounts(updated);
      alert(`Passcode for ${name} updated to: ${newPass.trim()}`);
    }
  };

  const handleFactoryResetData = () => {
    if (
      window.confirm(
        "CAUTION: Reset all products, bookings, enquiries, and orders back to initial factory demo data?"
      )
    ) {
      resetProductsToDefault();
      addAuditLog(
        "System Data Reset",
        "Super Admin",
        "Factory demo data reset triggered by Super Admin",
        "security"
      );
      refreshAllData();
      alert("System data restored to factory defaults.");
    }
  };

  // ORDER ACTIONS
  const handleOrderStatusChange = (
    orderId: string,
    status: Order["status"]
  ) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal({ ...selectedOrderForModal, status });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Remove this order record from the system?")) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
      if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
        setSelectedOrderForModal(null);
      }
    }
  };

  const handleSendWhatsAppUpdate = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone.replace(/^0+/, "")}`;
    const statusText =
      order.status === "Confirmed"
        ? "has been CONFIRMED by the store team and is being prepared."
        : order.status === "Shipped"
        ? order.deliveryType === "delivery"
          ? "is OUT FOR DELIVERY to your address."
          : "is READY FOR PICKUP at Pantaloons VR Ambarsar Mall (Lower Ground Floor)."
        : order.status === "Delivered"
        ? "has been DELIVERED successfully! Thank you for shopping with Pantaloons Amritsar."
        : `status has been updated to ${order.status}.`;

    const message = `*Pantaloons Amritsar Order Update*%0A%0AHello ${order.customerName},%0AYour Order *#${order.id}* ${statusText}%0A%0A*Total Amount:* ₹${order.total.toLocaleString("en-IN")}%0A*Delivery Type:* ${
      order.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"
    }%0A%0AFor any questions or changes, visit Pantaloons VR Ambarsar Mall or call +91 80471 38076.`;
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  // BOOKING ACTIONS
  const handleStatusChange = (id: string, status: BookingStatus) => {
    const updated = updateBookingStatus(id, status);
    setBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Are you sure you want to remove this appointment?")) {
      const updated = deleteBooking(id);
      setBookings(updated);
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    saveNewBooking({
      customerName: newCustName,
      phone: newCustPhone,
      service: newCustService,
      date: newCustDate,
      timeSlot: newCustTime,
      guests: Number(newCustGuests) || 1,
      notes: newCustNotes,
    });

    setBookings(getStoredBookings());
    setShowNewBookingModal(false);
    setNewCustName("");
    setNewCustPhone("");
    setNewCustNotes("");
  };

  const handleEnquiryStatusChange = (
    id: string,
    status: StoreEnquiry["status"]
  ) => {
    const updated = updateEnquiryStatus(id, status);
    setEnquiries(updated);
  };

  const handleToggleProductStock = (id: string) => {
    const updated = toggleProductStock(id);
    setProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Remove this product from store catalog?")) {
      const updated = deleteProduct(id);
      setProducts(updated);
    }
  };

  const handleResetCatalog = () => {
    if (
      window.confirm(
        "Reset catalog back to standard Pantaloons collection items?"
      )
    ) {
      const restored = resetProductsToDefault();
      setProducts(restored);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const discountPercent = Math.round(
      ((newProdOrigPrice - newProdPrice) / newProdOrigPrice) * 100
    );

    let defaultImg = images.women;
    if (newProdCategory === "men") defaultImg = images.men;
    else if (newProdCategory === "kids") defaultImg = images.kids;
    else if (newProdCategory === "festive") defaultImg = images.festiveReady;
    else if (newProdCategory === "denim") defaultImg = images.denim;
    else if (newProdCategory === "accessories") defaultImg = images.accessories;

    saveProduct({
      name: newProdName,
      category: newProdCategory,
      categoryLabel:
        newProdCategory === "women"
          ? "Women's Collection"
          : newProdCategory === "men"
          ? "Men's Collection"
          : newProdCategory === "kids"
          ? "Kids' Fashion"
          : newProdCategory === "festive"
          ? "Festive Wear"
          : newProdCategory === "denim"
          ? "Denim Studio"
          : "Fashion",
      subCategory: "New Arrival",
      price: Number(newProdPrice),
      originalPrice: Number(newProdOrigPrice),
      discount: discountPercent > 0 ? `${discountPercent}% OFF` : "",
      badge: newProdBadge,
      rating: 4.8,
      reviewsCount: 1,
      image: defaultImg,
      sizes: newProdSizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: [{ name: "Standard", hex: "#A35C38" }],
      fabric: newProdFabric,
      fit: "Regular Fit",
      description:
        newProdDesc || "Premium in-store fashion piece available at Pantaloons.",
      inStock: true,
      storeLocation: "Main Apparel Floor · VR Ambarsar Mall",
    });

    setProducts(getStoredProducts());
    setShowNewProductModal(false);
    setNewProdName("");
    setNewProdDesc("");
  };

  const exportOrdersCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Type",
      "Address",
      "Items Count",
      "Total (Rs)",
      "Payment",
      "Status",
      "Date",
    ];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      o.deliveryType,
      `"${o.address || ""}"`,
      o.items.length,
      o.total,
      o.paymentMethod,
      o.status,
      o.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `pantaloons_orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "All" || o.status === orderFilter;
    const matchesSearch =
      !orderSearchQuery ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery) ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.address && o.address.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      bookingFilter === "All" || b.status === bookingFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      productCategoryFilter === "all" ||
      p.category === productCategoryFilter;
    const matchesSearch =
      !productSearchQuery ||
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(productSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalOrderRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200 text-center animate-fade-up">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-stone-900 to-stone-950 text-white flex items-center justify-center shadow-lg mb-5">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold tracking-widest uppercase mb-2 border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Pantaloons Master Portal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-stone-900 font-normal uppercase tracking-wider">
            Admin & Super Admin
          </h1>
          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            Enter <span className="font-bold text-amber-800 font-mono">12345678</span> for Super Admin Master Access, or <span className="font-bold text-stone-900 font-mono">123456</span> for Store Operations Desk.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                placeholder="Passcode: 12345678 or 123456"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(null);
                }}
                className="w-full px-5 py-3.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 outline-none text-center text-lg tracking-widest font-mono transition-all bg-stone-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs uppercase tracking-wider"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium animate-shake">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full btn-primary font-semibold text-xs tracking-[0.22em] uppercase shadow-xl hover:shadow-2xl transition-all"
            >
              Unlock Console
            </button>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickUnlockSuperAdmin}
                className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Super Admin (12345678)</span>
              </button>

              <button
                type="button"
                onClick={handleQuickUnlockStoreAdmin}
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-stone-600" />
                <span>Store Admin (123456)</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Store Permissions Enabled</span>
            </span>
            <Link to="/" className="text-stone-700 hover:text-accent font-medium underline">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-24">
      {/* Admin Top Header Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-xl font-bold shadow-md ${
                isSuperAdmin
                  ? "bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950"
                  : "bg-accent text-white"
              }`}
            >
              {isSuperAdmin ? <Crown className="w-6 h-6 text-stone-950" /> : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-xl tracking-wider uppercase font-normal">
                  Pantaloons Amritsar
                </span>
                {isSuperAdmin ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3 text-amber-400" /> Super Admin Master
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                    Store Operations Desk
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>VR Ambarsar Mall · Lower Ground Floor</span>
                {currentAdminUser && (
                  <span className="text-stone-300 font-mono">
                    · Logged in as: {currentAdminUser.name} ({currentAdminUser.role})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Super Admin Master Website On/Off Kill-Switch */}
            {isSuperAdmin && (
              <button
                type="button"
                onClick={handleToggleKillSwitch}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow ${
                  siteSettings.isSiteOnline
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                }`}
                title="Super Admin Master Kill-Switch: Turn website Online or Offline"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{siteSettings.isSiteOnline ? "Store: LIVE" : "Store: OFFLINE"}</span>
              </button>
            )}

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>
            <button
              onClick={refreshAllData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowNewProductModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Style</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/60 hover:bg-red-900 text-red-200 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Metrics Cards (Compact 2x2 on Mobile, 4 columns on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Customer Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold text-stone-500 truncate">
                Customer Orders
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="font-display text-xl sm:text-3xl lg:text-4xl font-normal text-stone-900 mt-2 sm:mt-3">
              {orders.length}
            </p>
            <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 text-[11px] sm:text-xs text-stone-600">
              <span className="text-emerald-700 font-bold">
                ₹{totalOrderRevenue.toLocaleString("en-IN")}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="text-amber-700 font-medium truncate">
                {orders.filter((o) => o.status === "Placed").length} New Orders
              </span>
            </div>
          </div>

          {/* Catalog Products */}
          <div
            onClick={() => setActiveTab("products")}
            className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-accent/40 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold text-stone-500 truncate">
                Store Styles
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="font-display text-xl sm:text-3xl lg:text-4xl font-normal text-stone-900 mt-2 sm:mt-3">
              {products.length}
            </p>
            <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 text-[11px] sm:text-xs text-stone-600">
              <span className="text-emerald-700 font-semibold truncate">
                {products.filter((p) => p.inStock).length} In Stock
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="text-stone-400 text-[10px] hidden sm:inline">Manage</span>
            </div>
          </div>

          {/* Total Bookings */}
          <div
            onClick={() => setActiveTab("bookings")}
            className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-blue-500/40 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold text-stone-500 truncate">
                VIP Bookings
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="font-display text-xl sm:text-3xl lg:text-4xl font-normal text-stone-900 mt-2 sm:mt-3">
              {bookings.length}
            </p>
            <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 text-[11px] sm:text-xs text-stone-600">
              <span>{bookings.filter((b) => b.status === "Confirmed").length} Confirmed</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-amber-700 font-medium truncate">
                {bookings.filter((b) => b.status === "Pending").length} Pending
              </span>
            </div>
          </div>

          {/* Website Views */}
          <div
            onClick={() => setActiveTab("traffic")}
            className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-sm border border-stone-200/80 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold text-stone-500 truncate">
                Store Views
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="font-display text-xl sm:text-3xl lg:text-4xl font-normal text-stone-900 mt-2 sm:mt-3">
              {analytics.totalViews.toLocaleString()}
            </p>
            <div className="mt-1 sm:mt-2 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">+18% this week</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-10 border-b border-stone-300 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex space-x-6 sm:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "orders"
                  ? "text-emerald-700 font-bold border-b-2 border-emerald-600"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "products"
                  ? "text-accent font-bold border-b-2 border-accent"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Products & Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "bookings"
                  ? "text-stone-900 font-bold border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Appointments & Trials ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("traffic")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "traffic"
                  ? "text-stone-900 font-bold border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Traffic Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "enquiries"
                  ? "text-stone-900 font-bold border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Customer Messages ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative ${
                activeTab === "reviews"
                  ? "text-stone-900 font-bold border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Reviews & Ratings ({reviewsList.length})</span>
            </button>

            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveTab("superadmin_site")}
                  className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                    activeTab === "superadmin_site"
                      ? "text-rose-700 font-bold border-b-2 border-rose-700"
                      : "text-rose-600/80 hover:text-rose-800 font-medium"
                  }`}
                >
                  <Power className="w-4 h-4 text-rose-600" />
                  <span>Website Kill-Switch</span>
                </button>

                <button
                  onClick={() => setActiveTab("superadmin_admins")}
                  className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                    activeTab === "superadmin_admins"
                      ? "text-amber-800 font-bold border-b-2 border-amber-800"
                      : "text-amber-800/80 hover:text-amber-900 font-medium"
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Admin Staff ({adminAccounts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("superadmin_logs")}
                  className={`pb-4 font-display text-sm sm:text-base uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                    activeTab === "superadmin_logs"
                      ? "text-stone-900 font-bold border-b-2 border-stone-900"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <History className="w-4 h-4 text-stone-600" />
                  <span>Audit Logs</span>
                </button>
              </>
            )}
          </div>

          {activeTab === "orders" && (
            <button
              onClick={exportOrdersCSV}
              className="hidden sm:inline-flex items-center gap-1.5 pb-4 text-xs font-semibold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Orders CSV</span>
            </button>
          )}

          {activeTab === "products" && (
            <div className="hidden sm:flex items-center gap-3 pb-4">
              <button
                onClick={handleResetCatalog}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Reset Catalog
              </button>
              <button
                onClick={() => setShowNewProductModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Style</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= TAB: CUSTOMER ORDERS ================= */}
        {activeTab === "orders" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            {/* Filter and Search Bar for Orders */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "All", count: orders.length },
                  { id: "Placed", count: orders.filter((o) => o.status === "Placed").length },
                  { id: "Confirmed", count: orders.filter((o) => o.status === "Confirmed").length },
                  { id: "Shipped", count: orders.filter((o) => o.status === "Shipped").length },
                  { id: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
                  { id: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
                ].map(({ id, count }) => (
                  <button
                    key={id}
                    onClick={() => setOrderFilter(id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0 ${
                      orderFilter === id
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    <span>{id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        orderFilter === id
                          ? "bg-white/25 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search order ID, customer, address..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-full border border-stone-200 text-xs outline-none focus:border-stone-900 bg-stone-50/50 focus:bg-white transition-all"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop View: Full Data Table (hidden on mobile, visible md and up) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F5EE] border-b border-stone-200 text-stone-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 font-semibold">Order ID</th>
                      <th className="py-4 px-6 font-semibold">Customer & Contact</th>
                      <th className="py-4 px-6 font-semibold">Delivery Type / Address</th>
                      <th className="py-4 px-6 font-semibold">Items Ordered</th>
                      <th className="py-4 px-6 font-semibold">Amount & Payment</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-stone-400"
                        >
                          No orders matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="hover:bg-amber-50/40 transition-colors"
                        >
                          <td className="py-4 px-6 font-mono font-bold text-stone-900">
                            <button
                              onClick={() => setSelectedOrderForModal(o)}
                              className="text-stone-900 hover:text-emerald-700 hover:underline flex items-center gap-1 font-mono font-bold"
                              title="View Order Details & Receipt"
                            >
                              <span>{o.id}</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </button>
                            <p className="text-[10px] text-stone-400 font-sans font-normal mt-0.5">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-stone-900 text-sm">
                              {o.customerName}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <a
                                href={`tel:${o.phone}`}
                                className="text-stone-600 hover:text-accent flex items-center gap-1 font-medium"
                              >
                                <Phone className="w-3 h-3 text-stone-400" />
                                <span>{o.phone}</span>
                              </a>
                              <button
                                onClick={() => handleSendWhatsAppUpdate(o)}
                                className="text-emerald-700 hover:underline flex items-center gap-0.5 text-[11px] font-medium"
                                title="Send WhatsApp Update"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WA</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 max-w-xs">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                o.deliveryType === "delivery"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {o.deliveryType === "delivery" ? (
                                <Truck className="w-3 h-3" />
                              ) : (
                                <Store className="w-3 h-3" />
                              )}
                              <span>
                                {o.deliveryType === "delivery"
                                  ? "Home Delivery"
                                  : "Store Pickup"}
                              </span>
                            </span>
                            <p className="text-[11px] text-stone-600 line-clamp-2">
                              {o.address}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1 max-w-[200px]">
                              {o.items.map((it, idx) => (
                                <p
                                  key={idx}
                                  className="text-[11px] text-stone-800 truncate font-medium"
                                >
                                  • {it.productName} ({it.size}) × {it.quantity}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-stone-900 text-sm">
                              ₹{o.total.toLocaleString("en-IN")}
                            </p>
                            <span className="text-[10px] uppercase font-semibold text-stone-500">
                              {o.paymentMethod.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                o.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : o.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : o.status === "Confirmed"
                                  ? "bg-purple-100 text-purple-800"
                                  : o.status === "Placed"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderForModal(o)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                                title="View Details & Receipt"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              {o.status === "Placed" && (
                                <button
                                  onClick={() =>
                                    handleOrderStatusChange(o.id, "Confirmed")
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {o.status === "Confirmed" && (
                                <button
                                  onClick={() =>
                                    handleOrderStatusChange(o.id, "Shipped")
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 transition"
                                >
                                  Ship / Ready
                                </button>
                              )}
                              {o.status === "Shipped" && (
                                <button
                                  onClick={() =>
                                    handleOrderStatusChange(o.id, "Delivered")
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-medium hover:bg-accent transition"
                                >
                                  Delivered
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(o.id)}
                                title="Remove Order"
                                className="p-1 text-stone-400 hover:text-red-600 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: High-Touch Interactive Order Cards (visible on mobile, hidden md and up) */}
            <div className="md:hidden space-y-3.5">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400">
                  <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-stone-700 text-sm">No orders found</p>
                  <p className="text-xs text-stone-400 mt-1">Try changing the filter or search term</p>
                </div>
              ) : (
                filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3 transition-all"
                  >
                    {/* Card Header: Order ID, Timestamp & Status Pill */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrderForModal(o)}
                            className="font-mono font-bold text-sm text-stone-900 hover:text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <span>#{o.id}</span>
                            <ExternalLink className="w-3 h-3 text-stone-400" />
                          </button>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.deliveryType === "delivery"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {o.deliveryType === "delivery" ? (
                              <Truck className="w-3 h-3" />
                            ) : (
                              <Store className="w-3 h-3" />
                            )}
                            <span>{o.deliveryType === "delivery" ? "Delivery" : "Pickup"}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                          {new Date(o.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "Confirmed"
                            ? "bg-purple-100 text-purple-800"
                            : o.status === "Placed"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>

                    {/* Customer & Address Section */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-900 text-sm truncate">
                          {o.customerName}
                        </p>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">
                          📍 {o.address}
                        </p>
                        {o.deliveryType === "delivery" && o.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              o.address + ", Amritsar"
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:underline font-medium mt-1"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>View on Google Maps</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`tel:${o.phone}`}
                          className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-sm"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4 text-stone-600" />
                        </a>
                        <button
                          onClick={() => handleSendWhatsAppUpdate(o)}
                          className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shadow-sm"
                          title="Send WhatsApp Update"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>
                    </div>

                    {/* Items Summary Box */}
                    <div className="bg-[#FAF8F5] rounded-xl p-3 border border-stone-200/70 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 border-b border-stone-200/60 pb-1.5">
                        <span>Items Ordered ({o.items.length})</span>
                        <span className="font-bold text-stone-900 text-xs">
                          ₹{o.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {o.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-stone-800"
                          >
                            <span className="truncate pr-2 font-medium">
                              • {it.productName} ({it.size}) × {it.quantity}
                            </span>
                            <span className="shrink-0 text-stone-500 font-mono text-[11px]">
                              ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="uppercase font-semibold tracking-wider">
                          Payment: {o.paymentMethod.toUpperCase()}
                        </span>
                        {o.deliveryFee === 0 ? (
                          <span className="text-emerald-700 font-semibold">
                            FREE Delivery
                          </span>
                        ) : (
                          <span>Delivery: ₹{o.deliveryFee}</span>
                        )}
                      </div>
                    </div>

                    {/* Primary Workflow Actions for Mobile */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {o.status === "Placed" && (
                        <button
                          onClick={() =>
                            handleOrderStatusChange(o.id, "Confirmed")
                          }
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Order</span>
                        </button>
                      )}
                      {o.status === "Confirmed" && (
                        <button
                          onClick={() =>
                            handleOrderStatusChange(o.id, "Shipped")
                          }
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>
                            {o.deliveryType === "delivery"
                              ? "Out for Delivery"
                              : "Ready for Pickup"}
                          </span>
                        </button>
                      )}
                      {o.status === "Shipped" && (
                        <button
                          onClick={() =>
                            handleOrderStatusChange(o.id, "Delivered")
                          }
                          className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-accent text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                      {o.status === "Delivered" && (
                        <div className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fulfilled</span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedOrderForModal(o)}
                        className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>Slip & Details</span>
                      </button>
                    </div>

                    {/* Footer Actions: WhatsApp Update & Delete */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-500">
                      <button
                        onClick={() => handleSendWhatsAppUpdate(o)}
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Update</span>
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 flex items-center gap-1 text-[11px]"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: PRODUCTS & CATALOG ================= */}
        {activeTab === "products" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            {/* Filter and Search Bar for Products */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "All Items" },
                  { id: "women", label: "Women" },
                  { id: "men", label: "Men" },
                  { id: "kids", label: "Kids" },
                  { id: "festive", label: "Festive" },
                  { id: "denim", label: "Denim" },
                  { id: "outerwear", label: "Outerwear" },
                  { id: "accessories", label: "Accessories" },
                  { id: "footwear", label: "Footwear" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 ${
                      productCategoryFilter === cat.id
                        ? "bg-accent text-white font-semibold shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search product name, ID, fabric..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-200 text-xs outline-none focus:border-stone-900 bg-stone-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Desktop View: Product Table (hidden on mobile, visible md and up) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F5EE] border-b border-stone-200 text-stone-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 font-semibold">Product</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Price</th>
                      <th className="py-4 px-6 font-semibold">Sizes</th>
                      <th className="py-4 px-6 font-semibold">Fabric Details</th>
                      <th className="py-4 px-6 font-semibold">Store Stock</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-stone-400"
                        >
                          No products found matching filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-amber-50/40 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-14 object-cover object-top rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-stone-900 text-sm line-clamp-1">
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-mono text-[10px] text-stone-400">
                                    {p.id}
                                  </span>
                                  {p.badge && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-stone-800">
                              {p.categoryLabel}
                            </span>
                            <p className="text-[11px] text-stone-400">
                              {p.subCategory}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-stone-900">
                              ₹{p.price.toLocaleString("en-IN")}
                            </p>
                            {p.originalPrice > p.price && (
                              <p className="text-[11px] text-stone-400 line-through">
                                ₹{p.originalPrice.toLocaleString("en-IN")}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {p.sizes.map((s) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 rounded border border-stone-200 text-[10px] font-mono bg-stone-50"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-stone-600 max-w-[160px] truncate">
                            {p.fabric}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleProductStock(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                p.inStock
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.inStock ? "bg-emerald-600" : "bg-red-600"
                                }`}
                              />
                              <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Delete style"
                              className="p-1.5 text-stone-400 hover:text-red-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: Product Touch Cards (visible on mobile, hidden md and up) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400">
                  <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-stone-700 text-sm">No styles found</p>
                  <p className="text-xs text-stone-400 mt-1">Try another category or search keyword</p>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-20 object-cover object-top rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">
                            {p.name}
                          </p>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-stone-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-accent uppercase font-bold tracking-wider">
                            {p.categoryLabel}
                          </span>
                          <span className="text-[10px] text-stone-400">·</span>
                          <span className="font-mono text-[10px] text-stone-400">
                            {p.id}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-bold text-stone-900 text-sm">
                            ₹{p.price.toLocaleString("en-IN")}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-stone-400 line-through">
                              ₹{p.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          {p.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-1 overflow-x-auto max-w-[55%]">
                        {p.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded border border-stone-200 text-[10px] font-mono bg-stone-50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleToggleProductStock(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.inStock
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.inStock ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                        <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "All", count: bookings.length },
                  { id: "Confirmed", count: bookings.filter((b) => b.status === "Confirmed").length },
                  { id: "Pending", count: bookings.filter((b) => b.status === "Pending").length },
                  { id: "Completed", count: bookings.filter((b) => b.status === "Completed").length },
                  { id: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length },
                ].map(({ id, count }) => (
                  <button
                    key={id}
                    onClick={() => setBookingFilter(id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5 ${
                      bookingFilter === id
                        ? "bg-stone-900 text-white shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    <span>{id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        bookingFilter === id
                          ? "bg-white/25 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-200 text-xs outline-none focus:border-stone-900 bg-stone-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Desktop View: Bookings List Table (hidden on mobile, visible md and up) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F5EE] border-b border-stone-200 text-stone-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 font-semibold">Booking ID</th>
                      <th className="py-4 px-6 font-semibold">Customer</th>
                      <th className="py-4 px-6 font-semibold">Contact</th>
                      <th className="py-4 px-6 font-semibold">Service</th>
                      <th className="py-4 px-6 font-semibold">Appointment Slot</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-stone-400"
                        >
                          No customer bookings matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-amber-50/40 transition-colors"
                        >
                          <td className="py-4 px-6 font-mono font-semibold text-stone-900">
                            {b.id}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-stone-900 text-sm">
                              {b.customerName}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {b.guests} {b.guests > 1 ? "Guests" : "Guest"}
                            </p>
                            {b.notes && (
                              <p className="mt-1 text-[11px] text-stone-500 italic max-w-xs truncate">
                                "{b.notes}"
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <a
                              href={`tel:${b.phone}`}
                              className="font-medium text-stone-800 hover:text-accent flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span>{b.phone}</span>
                            </a>
                            {b.email && (
                              <a
                                href={`mailto:${b.email}`}
                                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1.5 mt-0.5"
                              >
                                <Mail className="w-3 h-3 text-stone-400" />
                                <span>{b.email}</span>
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-stone-800">
                              {b.service}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-stone-900">{b.date}</p>
                            <p className="text-[11px] text-stone-500">
                              {b.timeSlot}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "Pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : b.status === "Completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {b.status === "Confirmed" && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {b.status === "Pending" && (
                                <Clock className="w-3 h-3" />
                              )}
                              {b.status === "Cancelled" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>{b.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === "Pending" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(b.id, "Confirmed")
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === "Confirmed" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(b.id, "Completed")
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 transition"
                                >
                                  Mark Done
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                title="Remove appointment"
                                className="p-1 text-stone-400 hover:text-red-600 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: Booking Touch Cards (visible on mobile, hidden md and up) */}
            <div className="md:hidden space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400">
                  <Calendar className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-stone-700 text-sm">No bookings found</p>
                  <p className="text-xs text-stone-400 mt-1">Try another filter status or customer name</p>
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-stone-900">
                          #{b.id}
                        </span>
                        <p className="text-[11px] font-bold text-accent mt-0.5">
                          {b.service}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : b.status === "Completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-stone-900 text-sm">
                          {b.customerName}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          📅 {b.date} · ⏰ {b.timeSlot}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          👥 {b.guests} {b.guests > 1 ? "Guests" : "Guest"}
                          {b.notes && ` · "${b.notes}"`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`tel:${b.phone}`}
                          className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-sm"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4 text-stone-600" />
                        </a>
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.customerName}, this is Pantaloons VR Ambarsar Mall regarding your appointment #${b.id} for ${b.service} on ${b.date} at ${b.timeSlot}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shadow-sm"
                          title="Send WhatsApp Update"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        {b.status === "Pending" && (
                          <button
                            onClick={() => handleStatusChange(b.id, "Confirmed")}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs tracking-wider uppercase"
                          >
                            Confirm VIP Visit
                          </button>
                        )}
                        {b.status === "Confirmed" && (
                          <button
                            onClick={() => handleStatusChange(b.id, "Completed")}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs tracking-wider uppercase"
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status === "Completed" && (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Visit Finished</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: TRAFFIC ================= */}
        {activeTab === "traffic" && (
          <div className="mt-6 space-y-8 animate-fade-up">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-stone-900">
                    Weekly Website Pageviews & Visitors
                  </h3>
                  <p className="text-xs text-stone-500">
                    Showing daily traffic visiting the Pantaloons Amritsar digital store
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-accent" />
                    <span>Page Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-stone-900" />
                    <span>Unique Visitors</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full min-h-[280px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.dailyTraffic}>
                      <defs>
                        <linearGradient
                          id="colorViews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#A35C38"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#A35C38"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorVisitors"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1C1917"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1C1917"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" />
                      <XAxis dataKey="day" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#A35C38"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="Page Views"
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#1C1917"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVisitors)"
                        name="Unique Visitors"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-stone-400">
                    Loading analytics data...
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <h3 className="font-display text-xl uppercase tracking-wider text-stone-900 mb-2">
                  Most Viewed Categories
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  Customer engagement distribution across store collection sections
                </p>

                <div className="h-64 w-full min-h-[250px]">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.categoryBreakdown}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" />
                        <XAxis type="number" stroke="#888" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={140}
                          stroke="#888"
                          fontSize={11}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="views"
                          fill="#A35C38"
                          radius={[0, 8, 8, 0]}
                          name="Views"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-stone-400">
                      Loading chart...
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-stone-900 mb-2">
                    Customer Footfall Conversion
                  </h3>
                  <p className="text-xs text-stone-500 mb-6">
                    Online engagement translating to store visits at VR Ambarsar Mall
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                          Estimated In-Store Visitors
                        </p>
                        <p className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                          850 - 1,200
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        Peak Hours: 4 PM - 9 PM
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                          Direct Navigation Clicks
                        </p>
                        <p className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                          342 Clicks
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 bg-stone-200 px-3 py-1 rounded-full">
                        Google Maps Route
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                          Phone Call Enquiries
                        </p>
                        <p className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                          186 Calls
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 bg-stone-200 px-3 py-1 rounded-full">
                        080 4713 8076
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ENQUIRIES ================= */}
        {activeTab === "enquiries" && (
          <div className="mt-6 space-y-4 animate-fade-up">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 divide-y divide-stone-100">
              {enquiries.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No customer messages recorded yet.
                </div>
              ) : (
                enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-6 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-stone-700">
                          {enq.id}
                        </span>
                        <h4 className="font-semibold text-stone-900 text-sm">
                          {enq.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider">
                          {enq.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            enq.status === "New"
                              ? "bg-purple-100 text-purple-800"
                              : enq.status === "Contacted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {enq.status}
                        </span>
                        <span className="text-xs text-stone-400">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#FAF7F2] p-4 rounded-xl border border-stone-200/60">
                      "{enq.message}"
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-4 text-xs text-stone-600">
                        <a
                          href={`tel:${enq.contact}`}
                          className="flex items-center gap-1.5 hover:text-accent font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{enq.contact}</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {enq.status === "New" && (
                          <button
                            onClick={() =>
                              handleEnquiryStatusChange(enq.id, "Contacted")
                            }
                            className="px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-accent transition"
                          >
                            Mark as Contacted
                          </button>
                        )}
                        {enq.status !== "Closed" && (
                          <button
                            onClick={() =>
                              handleEnquiryStatusChange(enq.id, "Closed")
                            }
                            className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-300 transition"
                          >
                            Close Enquiry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* REVIEWS & RATINGS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Top Review Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Total Store Reviews</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {reviewsList.length + 473}
                </div>
                <span className="text-[11px] text-stone-400">473 Google + {reviewsList.length} Web</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Avg Store Rating</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
                  {(
                    reviewsList.reduce((acc, r) => acc + r.rating, 0) /
                    (reviewsList.length || 1)
                  ).toFixed(1)}
                  ★
                </div>
                <span className="text-[11px] text-stone-400">Out of 5.0 Stars</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Recommendation</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                  {Math.round(
                    (reviewsList.filter((r) => r.recommendStore).length /
                      (reviewsList.length || 1)) *
                      100
                  )}
                  %
                </div>
                <span className="text-[11px] text-stone-400">Would recommend to friends</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Local Verified</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {reviewsList.filter((r) => r.verifiedPurchase).length}
                </div>
                <span className="text-[11px] text-stone-400">VR Ambarsar In-Store Visits</span>
              </div>
            </div>

            {/* Reviews Management Table & Cards */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-stone-900">
                    Live Verified Customer Reviews
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time feedback submitted by Amritsar shoppers. Store moderators can remove spam or abuse.
                  </p>
                </div>
                <a
                  href="/reviews"
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                </a>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Customer & City</th>
                      <th className="py-3.5 px-4 font-semibold">Rating</th>
                      <th className="py-3.5 px-4 font-semibold">Department</th>
                      <th className="py-3.5 px-4 font-semibold">Review Excerpt</th>
                      <th className="py-3.5 px-4 font-semibold">Helpful</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reviewsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No reviews recorded yet.
                        </td>
                      </tr>
                    ) : (
                      reviewsList.map((r) => (
                        <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{r.name}</div>
                            <div className="text-[11px] text-stone-400">{r.city}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold font-mono">
                              <span>{r.rating}</span>
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                              {r.categoryVisited}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-2 text-stone-700 italic">"{r.text}"</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-stone-600">
                            {r.helpfulCount}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-400">
                            {r.date}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Touch Cards View */}
              <div className="md:hidden divide-y divide-stone-100">
                {reviewsList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No reviews recorded yet.
                  </div>
                ) : (
                  reviewsList.map((r) => (
                    <div key={r.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{r.name}</div>
                          <div className="text-xs text-stone-400">{r.city}</div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          <span>{r.rating}</span>
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 italic">"{r.text}"</div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {r.categoryVisited}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-stone-400 text-[11px]">Helpful: {r.helpfulCount}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(r.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUPER ADMIN: WEBSITE KILL-SWITCH & MASTER SETTINGS */}
        {isSuperAdmin && activeTab === "superadmin_site" && (
          <div className="space-y-6">
            {/* Master Kill-Switch Card */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
                siteSettings.isSiteOnline
                  ? "bg-gradient-to-br from-emerald-500/10 via-white to-white border-emerald-300"
                  : "bg-gradient-to-br from-rose-500/15 via-white to-white border-rose-300"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
                      siteSettings.isSiteOnline
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>
                      {siteSettings.isSiteOnline
                        ? "Store is LIVE (Online)"
                        : "Store is OFFLINE (Maintenance Active)"}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-stone-900">
                    Master Website Control Switch
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                    {siteSettings.isSiteOnline
                      ? "Puri website online hai. Customers browse kar sakde han, shopping bag vich add kar sakde han, orders place kar sakde han, te VIP trials book kar sakde han."
                      : "Website currently band (OFF) hai. Normal visitors nu scheduled maintenance screen show ho rahi hai with store address & phone number."}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleKillSwitch}
                    className={`px-6 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2.5 ${
                      siteSettings.isSiteOnline
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                    <span>
                      {siteSettings.isSiteOnline
                        ? "Turn Website OFF (Kill-Switch)"
                        : "Turn Website ONLINE"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Maintenance Display Customizer */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                <div>
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-stone-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-accent" />
                    <span>Public Maintenance Notice Configuration</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Customize what Amritsar shoppers see when the website is turned off.
                  </p>
                </div>
                {settingsSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Settings Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Maintenance Title Heading
                  </label>
                  <input
                    type="text"
                    value={settingsMaintenanceTitle}
                    onChange={(e) => setSettingsMaintenanceTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Public Notice Message
                  </label>
                  <textarea
                    rows={3}
                    value={settingsMaintenanceMsg}
                    onChange={(e) => setSettingsMaintenanceMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                      Store Helpline Phone
                    </label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                      Super Admin Master Passcode
                    </label>
                    <input
                      type="text"
                      disabled
                      value="12345678 (Master Root Key)"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-mono outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Emergency Site-Wide Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                    <input
                      type="checkbox"
                      checked={settingsEmergencyActive}
                      onChange={(e) => setSettingsEmergencyActive(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Broadcast Emergency Announcement Ticker on Website Header</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Festive Sale Live! Extra 10% Cashback on orders."
                    value={settingsEmergencyText}
                    onChange={(e) => setSettingsEmergencyText(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-amber-300 outline-none focus:border-stone-900 bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primary text-xs uppercase tracking-wider">
                    Save System Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 sm:p-8">
              <h4 className="font-display text-lg uppercase tracking-wider text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Super Admin Emergency Actions</span>
              </h4>
              <p className="text-xs text-rose-700 mt-1">
                Caution: Use these master tools only for testing or store resets.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleFactoryResetData}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow"
                >
                  Factory Reset Store Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUPER ADMIN: ADMIN STAFF ACCOUNTS MANAGEMENT */}
        {isSuperAdmin && activeTab === "superadmin_admins" && (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Total Admins</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {adminAccounts.length}
                </div>
                <span className="text-[11px] text-stone-400">Registered Staff</span>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Active Access</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                  {adminAccounts.filter((a) => a.status === "Active").length}
                </div>
                <span className="text-[11px] text-stone-400">Can Login to Portal</span>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Suspended</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
                  {adminAccounts.filter((a) => a.status === "Suspended").length}
                </div>
                <span className="text-[11px] text-stone-400">Revoked Credentials</span>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs uppercase font-bold text-stone-500">Super Admin</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
                  1 <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[11px] text-stone-400">Root Master Account</span>
              </div>
            </div>

            {/* Admin Table / Cards */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-stone-900">
                    Store Staff & Admin Accounts
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Super Admin can create, modify, suspend, and delete admin accounts. Master Super Admin is permanently protected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Add New Admin</span>
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Admin Name</th>
                      <th className="py-3.5 px-4 font-semibold">Role</th>
                      <th className="py-3.5 px-4 font-semibold">Contact Email</th>
                      <th className="py-3.5 px-4 font-semibold">Passcode</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Added Date</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {adminAccounts.map((adm) => (
                      <tr key={adm.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 flex items-center gap-1.5">
                            {adm.name}
                            {adm.isMasterSuperAdmin && (
                              <Crown className="w-3.5 h-3.5 text-amber-500" title="Master Root Super Admin" />
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">{adm.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              adm.role === "Super Admin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : adm.role === "Store Manager"
                                ? "bg-purple-100 text-purple-900"
                                : adm.role === "Inventory Admin"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-emerald-100 text-emerald-900"
                            }`}
                          >
                            {adm.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">{adm.email}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {adm.passcode}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              adm.status === "Active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {adm.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-400">{adm.createdAt}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!adm.isMasterSuperAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAdminAccountStatus(adm.id)}
                                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium"
                                  title="Toggle Status"
                                >
                                  {adm.status === "Active" ? "Suspend" : "Activate"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResetPasscode(adm.id, adm.name)}
                                  className="p-1.5 rounded hover:bg-stone-100 text-stone-600"
                                  title="Change Passcode"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdminAccount(adm.id, adm.name)}
                                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
                                  title="Delete Admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {adm.isMasterSuperAdmin && (
                              <span className="text-[11px] text-stone-400 font-mono italic">
                                Permanent Root
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-stone-100">
                {adminAccounts.map((adm) => (
                  <div key={adm.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                          {adm.name}
                          {adm.isMasterSuperAdmin && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <div className="text-xs text-stone-500">{adm.email}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          adm.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {adm.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span>
                        Role: <strong className="text-stone-900">{adm.role}</strong>
                      </span>
                      <span className="font-mono">
                        Passcode: <strong className="text-stone-900">{adm.passcode}</strong>
                      </span>
                    </div>

                    {!adm.isMasterSuperAdmin && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleToggleAdminAccountStatus(adm.id)}
                          className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-semibold"
                        >
                          {adm.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPasscode(adm.id, adm.name)}
                          className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-semibold"
                        >
                          Change Passcode
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAdminAccount(adm.id, adm.name)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPER ADMIN: AUDIT LOGS */}
        {isSuperAdmin && activeTab === "superadmin_logs" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-accent" />
                  <span>Store System Audit Trail</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Timestamped record of all administrative logins, site status toggles, and staff modifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuditLogs(getAuditLogs())}
                className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-semibold"
              >
                Refresh Logs
              </button>
            </div>

            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">No logs recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        <span>{log.action}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                          {log.actor}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-0.5">{log.details}</p>
                    </div>
                    <span className="font-mono text-stone-400 text-[11px] shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Add Booking Modal */}
      {showNewBookingModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowNewBookingModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl uppercase tracking-wider text-stone-900">
              New Customer Appointment
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Add a walk-in or telephone styling booking for VR Ambarsar Mall branch.
            </p>

            <form onSubmit={handleCreateBooking} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Customer Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Gurpreet Singh"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <input
                  required
                  type="text"
                  placeholder="+91 98721 XXXXX"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Styling Service
                </label>
                <select
                  value={newCustService}
                  onChange={(e) => setNewCustService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-white"
                >
                  <option>Bridal & Festive Lehenga VIP Styling</option>
                  <option>Menswear Bandhgala & Suit Tailoring</option>
                  <option>Family Festive Shopping Curation</option>
                  <option>Personal Wardrobe Consultation</option>
                  <option>Kids Festive Wear Fitting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newCustDate}
                    onChange={(e) => setNewCustDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCustGuests}
                    onChange={(e) => setNewCustGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. 03:00 PM - 04:30 PM"
                  value={newCustTime}
                  onChange={(e) => setNewCustTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferences, outfit ideas, sizes..."
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showNewProductModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowNewProductModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl uppercase tracking-wider text-stone-900">
              Add Store Catalog Item
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Add a new style to the Pantaloons VR Ambarsar Mall collection.
            </p>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Item Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Zari Embroidered Silk Kurta"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) =>
                      setNewProdCategory(e.target.value as ProductCategory)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                    <option value="festive">Festive & Ethnic</option>
                    <option value="denim">Denim</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Badge
                  </label>
                  <select
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="New Season">New Season</option>
                    <option value="Festive '26">Festive '26</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Staff Pick">Staff Pick</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Linen / Raw Silk"
                    value={newProdFabric}
                    onChange={(e) => setNewProdFabric(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Sizes Available
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S, M, L, XL"
                    value={newProdSizes}
                    onChange={(e) => setNewProdSizes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Styling notes, embroidery details..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-stone-900"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details & Packing Slip Modal */}
      {selectedOrderForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm animate-fade-up overflow-y-auto"
          onClick={() => setSelectedOrderForModal(null)}
        >
          <div
            className="relative max-w-2xl w-full my-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base sm:text-lg font-bold text-stone-900 tracking-wider">
                    #{selectedOrderForModal.id}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      selectedOrderForModal.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedOrderForModal.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrderForModal.status === "Confirmed"
                        ? "bg-purple-100 text-purple-800"
                        : selectedOrderForModal.status === "Cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedOrderForModal.status}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 uppercase">
                    {selectedOrderForModal.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Placed on {new Date(selectedOrderForModal.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors print:hidden"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (Mobile-First Bar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 print:hidden">
              <a
                href={`tel:${selectedOrderForModal.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200/60 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Customer
              </a>
              <button
                type="button"
                onClick={() => handleSendWhatsAppUpdate(selectedOrderForModal)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </button>
              {selectedOrderForModal.deliveryType === "delivery" && selectedOrderForModal.address ? (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedOrderForModal.address}, ${selectedOrderForModal.city || ""} ${selectedOrderForModal.pincode || ""}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold border border-stone-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Maps
                </a>
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-50 text-stone-400 text-xs font-medium border border-stone-200">
                  <Store className="w-3.5 h-3.5" /> Pickup
                </div>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Slip
              </button>
            </div>

            {/* Customer & Fulfilment Info */}
            <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 mb-4 border border-stone-200 text-xs space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-stone-900 text-sm">{selectedOrderForModal.customerName}</div>
                  <div className="text-stone-500 font-mono">{selectedOrderForModal.phone}</div>
                  {selectedOrderForModal.email && (
                    <div className="text-stone-500">{selectedOrderForModal.email}</div>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded font-mono uppercase text-[10px] font-bold bg-stone-200 text-stone-800">
                    Payment: {selectedOrderForModal.paymentMethod === "cod" ? "Cash on Delivery" : selectedOrderForModal.paymentMethod === "upi" ? "UPI QR Transfer" : "Pay at Store"}
                  </span>
                </div>
              </div>

              {selectedOrderForModal.deliveryType === "delivery" ? (
                <div className="pt-2 border-t border-stone-200 text-stone-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-800">Delivery Address: </span>
                    {selectedOrderForModal.address}
                    {selectedOrderForModal.landmark && `, Landmark: ${selectedOrderForModal.landmark}`}
                    {selectedOrderForModal.city && `, ${selectedOrderForModal.city}`}
                    {selectedOrderForModal.pincode && ` - ${selectedOrderForModal.pincode}`}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-stone-200 text-stone-600 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-800">Store Pickup: </span>
                    Pantaloons Flagship Mall Boutique (Ready for customer inspection)
                  </div>
                </div>
              )}

              {selectedOrderForModal.notes && (
                <div className="pt-1 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span className="font-semibold">Customer Note:</span> {selectedOrderForModal.notes}
                </div>
              )}
            </div>

            {/* Items Summary */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden mb-4">
              <div className="bg-stone-100 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-600 flex justify-between">
                <span>Items ({selectedOrderForModal.items.length})</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
                {selectedOrderForModal.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-stone-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{item.productName}</p>
                        <p className="text-[11px] text-stone-500">
                          Size: <span className="font-semibold">{item.size}</span>
                          {item.color && <> • Color: <span className="font-semibold">{item.color}</span></>}
                          {" "}• Qty: <span className="font-semibold font-mono">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-stone-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 mb-5 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{selectedOrderForModal.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrderForModal.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Store Discount</span>
                  <span className="font-mono">-₹{selectedOrderForModal.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery / Shipping</span>
                <span className="font-mono">
                  {selectedOrderForModal.deliveryFee === 0 ? "FREE" : `₹${selectedOrderForModal.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700">₹{selectedOrderForModal.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Update Status Bar */}
            <div className="border-t border-stone-200 pt-3 print:hidden">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-2">
                Update Order Lifecycle Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(["Confirmed", "Shipped", "Delivered", "Cancelled"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleOrderStatusChange(selectedOrderForModal.id, st)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold tracking-wider transition-colors border ${
                      selectedOrderForModal.status === st
                        ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Add New Admin Account Modal */}
      {showAddAdminModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowAddAdminModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wider text-stone-900">
                  Add Admin Account
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Navjot Singh"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Store Role *
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Inventory Admin">Inventory Admin</option>
                    <option value="Stylist Head">Stylist Head</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Passcode *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 123456"
                    value={newAdminPasscode}
                    onChange={(e) => setNewAdminPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Staff Email
                </label>
                <input
                  type="email"
                  placeholder="name@pantaloons.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98721 XXXXX"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono outline-none focus:border-stone-900"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs uppercase tracking-wider">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
