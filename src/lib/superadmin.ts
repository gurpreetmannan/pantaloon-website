export type AdminRole =
  | "Super Admin"
  | "Store Manager"
  | "Inventory Admin"
  | "Stylist Head";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  passcode: string;
  status: "Active" | "Suspended";
  isMasterSuperAdmin?: boolean;
  createdAt: string;
};

export type SiteSettings = {
  isSiteOnline: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  emergencyBannerActive: boolean;
  emergencyBannerText: string;
  allowAdminBypass: boolean;
  storeContactPhone: string;
  superadminPasscode: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  type: "security" | "system" | "admin_change" | "store_status";
};

const STORAGE_KEYS = {
  ADMINS: "pantaloons_admin_accounts",
  SETTINGS: "pantaloons_site_settings",
  AUDIT_LOGS: "pantaloons_audit_logs",
  SUPER_AUTH: "pantaloons_superadmin_auth_v1",
};

const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: "SUPER-001",
    name: "Master Super Admin (Owner)",
    email: "owner@pantaloons-ambarsar.in",
    phone: "+91 98721 00001",
    role: "Super Admin",
    passcode: "12345678",
    status: "Active",
    isMasterSuperAdmin: true,
    createdAt: "2026-10-01",
  },
  {
    id: "ADM-101",
    name: "Gurinder Singh",
    email: "gurinder.store@pantaloons.in",
    phone: "+91 98721 44510",
    role: "Store Manager",
    passcode: "123456",
    status: "Active",
    isMasterSuperAdmin: false,
    createdAt: "2026-10-10",
  },
  {
    id: "ADM-102",
    name: "Simran Kaur",
    email: "simran.inventory@pantaloons.in",
    phone: "+91 98140 88231",
    role: "Inventory Admin",
    passcode: "654321",
    status: "Active",
    isMasterSuperAdmin: false,
    createdAt: "2026-10-15",
  },
  {
    id: "ADM-103",
    name: "Harman Preet",
    email: "harman.stylist@pantaloons.in",
    phone: "+91 98780 12345",
    role: "Stylist Head",
    passcode: "112233",
    status: "Active",
    isMasterSuperAdmin: false,
    createdAt: "2026-10-20",
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  isSiteOnline: true,
  maintenanceTitle: "Store Online Portal Under Scheduled Maintenance",
  maintenanceMessage:
    "Our online shopping bag & digital catalogue are briefly offline for seasonal inventory sync. Our physical store at VR Ambarsar Mall (Trillium Mall), Amritsar is fully OPEN from 10:30 AM to 10:00 PM.",
  emergencyBannerActive: false,
  emergencyBannerText: "✨ Grand Festive Gala at VR Ambarsar Mall! Extra 10% Off on purchases above ₹3,999.",
  allowAdminBypass: true,
  storeContactPhone: "+91 183 502 3344",
  superadminPasscode: "12345678",
};

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-10-26 10:15 AM",
    action: "System Startup",
    actor: "System",
    details: "Pantaloons VR Ambarsar Store Portal initialized.",
    type: "system",
  },
  {
    id: "LOG-002",
    timestamp: "2026-10-26 12:45 PM",
    action: "Super Admin Authentication",
    actor: "Master Super Admin",
    details: "Super Admin privileges accessed via master security token.",
    type: "security",
  },
];

// Helper: safe SSR access
function isClient(): boolean {
  return typeof window !== "undefined";
}

// ---------------------- ADMINS MANAGEMENT ----------------------

export function getStoredAdmins(): AdminAccount[] {
  if (!isClient()) return DEFAULT_ADMINS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
      return DEFAULT_ADMINS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMINS;
  } catch {
    return DEFAULT_ADMINS;
  }
}

export function saveNewAdmin(
  adminData: Omit<AdminAccount, "id" | "createdAt" | "isMasterSuperAdmin">
): AdminAccount {
  const current = getStoredAdmins();
  const newAdmin: AdminAccount = {
    ...adminData,
    id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
    isMasterSuperAdmin: false,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [...current, newAdmin];
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    addAuditLog(
      "Admin Account Created",
      "Super Admin",
      `Created admin "${newAdmin.name}" with role "${newAdmin.role}" (Passcode: ${newAdmin.passcode})`,
      "admin_change"
    );
    window.dispatchEvent(new Event("pantaloons_admins_updated"));
  }
  return newAdmin;
}

export function deleteAdmin(adminId: string): { success: boolean; message: string; admins: AdminAccount[] } {
  const current = getStoredAdmins();
  const target = current.find((a) => a.id === adminId);

  if (!target) {
    return { success: false, message: "Admin account not found.", admins: current };
  }

  if (target.isMasterSuperAdmin || target.passcode === "12345678") {
    return {
      success: false,
      message: "Security Protection: Cannot delete Master Super Admin account!",
      admins: current,
    };
  }

  const updated = current.filter((a) => a.id !== adminId);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    addAuditLog(
      "Admin Account Deleted",
      "Super Admin",
      `Deleted admin "${target.name}" (${target.role})`,
      "admin_change"
    );
    window.dispatchEvent(new Event("pantaloons_admins_updated"));
  }

  return { success: true, message: `Admin "${target.name}" removed successfully.`, admins: updated };
}

export function toggleAdminStatus(adminId: string): AdminAccount[] {
  const current = getStoredAdmins();
  const updated = current.map((a) => {
    if (a.id === adminId) {
      if (a.isMasterSuperAdmin) return a; // Master is always Active
      const newStatus: "Active" | "Suspended" = a.status === "Active" ? "Suspended" : "Active";
      addAuditLog(
        "Admin Status Changed",
        "Super Admin",
        `Changed status of "${a.name}" to ${newStatus}`,
        "admin_change"
      );
      return { ...a, status: newStatus };
    }
    return a;
  });

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    window.dispatchEvent(new Event("pantaloons_admins_updated"));
  }
  return updated;
}

export function updateAdminPasscode(adminId: string, newPasscode: string): AdminAccount[] {
  const current = getStoredAdmins();
  const updated = current.map((a) => (a.id === adminId ? { ...a, passcode: newPasscode } : a));

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    addAuditLog("Admin Passcode Updated", "Super Admin", `Updated passcode for admin ID ${adminId}`, "security");
    window.dispatchEvent(new Event("pantaloons_admins_updated"));
  }
  return updated;
}

// ---------------------- SITE SETTINGS & ON/OFF TOGGLE ----------------------

export function getSiteSettings(): SiteSettings {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSiteSettings(partial: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated: SiteSettings = { ...current, ...partial };

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event("pantaloons_site_settings_updated"));
  }
  return updated;
}

export function toggleSiteOnlineStatus(online: boolean): SiteSettings {
  const updated = updateSiteSettings({ isSiteOnline: online });
  if (isClient()) {
    addAuditLog(
      online ? "Website Turned ONLINE" : "Website Turned OFFLINE",
      "Super Admin",
      online
        ? "Super Admin switched the entire website to LIVE mode."
        : "Super Admin engaged maintenance kill-switch. Public traffic diverted to Maintenance screen.",
      "store_status"
    );
  }
  return updated;
}

// ---------------------- AUDIT LOGS ----------------------

export function getAuditLogs(): AuditLog[] {
  if (!isClient()) return DEFAULT_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
      return DEFAULT_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_AUDIT_LOGS;
  } catch {
    return DEFAULT_AUDIT_LOGS;
  }
}

export function addAuditLog(
  action: string,
  actor: string,
  details: string,
  type: AuditLog["type"] = "system"
): void {
  if (!isClient()) return;
  const current = getAuditLogs();
  const now = new Date();
  const timestamp = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;

  const newLog: AuditLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp,
    action,
    actor,
    details,
    type,
  };

  const updated = [newLog, ...current].slice(0, 50); // keep last 50
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    window.dispatchEvent(new Event("pantaloons_audit_logs_updated"));
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// ---------------------- AUTHENTICATION HELPERS ----------------------

export function verifyAdminPasscode(input: string): {
  authorized: boolean;
  isSuperAdmin: boolean;
  admin?: AdminAccount;
} {
  // Check Master Super Admin password first
  if (input === "12345678") {
    return {
      authorized: true,
      isSuperAdmin: true,
      admin: DEFAULT_ADMINS[0],
    };
  }

  // Check stored admin accounts
  const admins = getStoredAdmins();
  const matched = admins.find((a) => a.passcode === input && a.status === "Active");

  if (matched) {
    const isSuper = matched.role === "Super Admin" || matched.isMasterSuperAdmin === true;
    return {
      authorized: true,
      isSuperAdmin: isSuper,
      admin: matched,
    };
  }

  // Fallback for default admin
  if (input === "123456") {
    return {
      authorized: true,
      isSuperAdmin: false,
      admin: DEFAULT_ADMINS[1],
    };
  }

  return {
    authorized: false,
    isSuperAdmin: false,
  };
}

export function checkSuperAdminAuth(): boolean {
  if (!isClient()) return false;
  return sessionStorage.getItem(STORAGE_KEYS.SUPER_AUTH) === "true";
}

export function setSuperAdminAuth(auth: boolean): void {
  if (!isClient()) return;
  if (auth) {
    sessionStorage.setItem(STORAGE_KEYS.SUPER_AUTH, "true");
    addAuditLog("Super Admin Login", "Master Super Admin", "Logged into Super Admin Master Desk", "security");
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.SUPER_AUTH);
  }
}
