import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Lock,
  Power,
  AlertTriangle,
} from "lucide-react";

import { AnnouncementBar, Header, Footer } from "../components/site/Layout";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { recordPageView } from "../lib/analytics";
import {
  getSiteSettings,
  toggleSiteOnlineStatus,
  checkSuperAdminAuth,
  type SiteSettings,
} from "../lib/superadmin";
import { checkAdminAuth } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pantaloons Amritsar – Fashion & Online Store · VR Ambarsar Mall" },
      { name: "description", content: "Explore contemporary Indian fashion, festive kurtas, lehengas, denim & order online with Home Delivery & VR Ambarsar Store Pickup." },
      { property: "og:site_name", content: "Pantaloons Amritsar" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.pantaloon.shop" },
      { property: "og:title", content: "Pantaloons Amritsar – Fashion & Online Store · VR Ambarsar Mall" },
      { property: "og:description", content: "Explore contemporary Indian fashion, festive kurtas, lehengas, denim & order online with Home Delivery & VR Ambarsar Store Pickup." },
      { property: "og:image", content: "https://www.pantaloon.shop/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Pantaloons VR Ambarsar Mall Fashion Store" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pantaloons Amritsar – Fashion & Online Store" },
      { name: "twitter:description", content: "Explore contemporary fashion, festive kurtas, denim & store details at VR Ambarsar Mall, Amritsar." },
      { name: "twitter:image", content: "https://www.pantaloon.shop/og-image.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Marcellus&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MaintenanceOfflineScreen({
  settings,
}: {
  settings: SiteSettings;
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6 max-w-5xl mx-auto w-full">
        <div>
          <span className="font-display tracking-[0.3em] text-xs uppercase text-amber-400 font-bold">
            Pantaloons · VR Ambarsar
          </span>
          <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase mt-1">
            Store Portal Offline
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Maintenance Active
        </div>
      </div>

      {/* Center Notice Card */}
      <div className="relative z-10 max-w-xl mx-auto my-auto py-10 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide leading-tight text-white">
          {settings.maintenanceTitle}
        </h1>
        <p className="mt-4 text-stone-300 text-sm leading-relaxed">
          {settings.maintenanceMessage}
        </p>

        {/* Physical Store Contact Card */}
        <div className="mt-7 p-6 rounded-3xl bg-white/[0.04] border border-white/10 text-left text-xs sm:text-sm space-y-3.5">
          <div className="flex items-start gap-3 text-stone-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Mall Location:</span>
              Pantaloons, Ground & 1st Floor, VR Ambarsar Mall (Trillium Mall), Circular Road, Amritsar, Punjab 143001
            </div>
          </div>
          <div className="flex items-center gap-3 text-stone-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Store Hours: </span>
              10:30 AM – 10:00 PM (Daily)
            </div>
          </div>
          <div className="flex items-center gap-3 text-stone-300">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Store Helpline: </span>
              <a href={`tel:${settings.storeContactPhone}`} className="text-amber-400 underline font-mono">
                {settings.storeContactPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${settings.storeContactPhone}`}
            className="btn-white text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> Call Store Team
          </a>
          <a
            href="https://maps.google.com/?q=VR+Ambarsar+Mall+Amritsar"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> Open Maps Navigation
          </a>
        </div>
      </div>

      {/* Bottom Footer with Staff / Super Admin Access */}
      <div className="relative z-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3 max-w-5xl mx-auto w-full">
        <p>© 2026 Pantaloons Amritsar (Aditya Birla Fashion & Retail Ltd).</p>
        <Link
          to="/admin"
          className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-stone-400 font-mono"
        >
          <Lock className="w-3.5 h-3.5" /> Staff & Super Admin Desk
        </Link>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      recordPageView(window.location.pathname);
      setIsSuperAdmin(checkSuperAdminAuth());
      setIsAdmin(checkAdminAuth());
    }

    const handleSettingsUpdate = () => {
      setSiteSettings(getSiteSettings());
      setIsSuperAdmin(checkSuperAdminAuth());
      setIsAdmin(checkAdminAuth());
    };

    window.addEventListener("pantaloons_site_settings_updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("pantaloons_site_settings_updated", handleSettingsUpdate);
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  // If website is turned OFF by Super Admin and visitor is not on /admin
  const isStoreOffline = isMounted && !siteSettings.isSiteOnline && !isAdminRoute && !isSuperAdmin && !isAdmin;

  if (isStoreOffline) {
    return <MaintenanceOfflineScreen settings={siteSettings} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Super Admin / Admin Alert if viewing site while it is offline */}
      {isMounted && !siteSettings.isSiteOnline && (isSuperAdmin || isAdmin) && !isAdminRoute && (
        <div className="bg-rose-950 text-rose-100 text-xs px-4 py-2.5 flex flex-wrap items-center justify-between sticky top-0 z-[100] border-b border-rose-800 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping shrink-0" />
            <span className="font-bold uppercase tracking-wider text-rose-300">Super Admin Notice:</span>
            <span>The website is currently OFFLINE to regular shoppers (Maintenance Mode active).</span>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => toggleSiteOnlineStatus(true)}
                className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors shadow"
              >
                Turn Website ONLINE
              </button>
            )}
            <Link to="/admin" className="underline hover:text-white text-[11px] font-mono ml-2">
              Super Admin Desk →
            </Link>
          </div>
        </div>
      )}

      {/* Emergency Store Notice Banner if enabled by Super Admin */}
      {isMounted && siteSettings.emergencyBannerActive && siteSettings.emergencyBannerText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-2 px-4 text-center tracking-wide shadow-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{siteSettings.emergencyBannerText}</span>
        </div>
      )}

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
