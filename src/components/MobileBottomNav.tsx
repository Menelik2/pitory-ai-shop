import { Home, Monitor, Laptop, Headphones } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const CATEGORY_TABS = [
  { key: "home", label: "Home", href: "/", icon: Home, category: null },
  { key: "desktop", label: "Desktop", href: "/?category=Desktop", icon: Monitor, category: "Desktop" },
  { key: "laptop", label: "Laptop", href: "/?category=Laptop", icon: Laptop, category: "Laptop" },
  { key: "accessories", label: "Accessories", href: "/?category=Accessories", icon: Headphones, category: "Accessories" },
] as const;

export function MobileBottomNav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const isOnHome = location.pathname === "/";

  const isTabActive = (category: string | null) => {
    if (!isOnHome) return false;
    if (category === null) {
      // Home is active only when no category filter is applied
      return !activeCategory || activeCategory === "All";
    }
    return activeCategory === category;
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        border-t border-black/[0.06]
        bg-white/70
        backdrop-blur-[20px] backdrop-saturate-[180%]
        supports-[backdrop-filter]:bg-white/55
      "
      style={{
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around py-1.5">
        {CATEGORY_TABS.map(({ key, label, href, icon: Icon, category }) => {
          const active = isTabActive(category);
          return (
            <Link
              key={key}
              to={href}
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-colors min-w-[64px] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
