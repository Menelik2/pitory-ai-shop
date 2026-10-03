import { Home, Monitor, Laptop, Headphones } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
        <Link
          to="/"
          className={`flex flex-col items-center p-2.5 rounded-2xl transition-colors min-w-[64px] ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home size={22} strokeWidth={isActive("/") ? 2.25 : 1.75} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>

        <Link
          to="/?category=Desktop"
          className="flex flex-col items-center p-2.5 rounded-2xl transition-colors text-muted-foreground min-w-[64px]"
        >
          <Monitor size={22} strokeWidth={1.75} />
          <span className="text-[10px] mt-1 font-medium">Desktop</span>
        </Link>

        <Link
          to="/?category=Laptop"
          className="flex flex-col items-center p-2.5 rounded-2xl transition-colors text-muted-foreground min-w-[64px]"
        >
          <Laptop size={22} strokeWidth={1.75} />
          <span className="text-[10px] mt-1 font-medium">Laptop</span>
        </Link>

        <Link
          to="/?category=Accessories"
          className="flex flex-col items-center p-2.5 rounded-2xl transition-colors text-muted-foreground min-w-[64px]"
        >
          <Headphones size={22} strokeWidth={1.75} />
          <span className="text-[10px] mt-1 font-medium">Accessories</span>
        </Link>
      </div>
    </div>
  );
}
