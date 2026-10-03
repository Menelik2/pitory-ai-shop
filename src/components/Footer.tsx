import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      className="
        border-t border-black/[0.04]
        bg-white/70
        backdrop-blur-[20px] backdrop-saturate-[180%]
      "
      style={{
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-[15px] tracking-tight text-foreground mb-3">
              <Link to="/" className="hover:text-primary transition-colors">
                Pitory
              </Link>
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              High-performance computers with exceptional service.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:pitorypc@gmail.com"
                className="flex items-center gap-2.5 text-[13px] text-foreground/80 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 opacity-50" />
                pitorypc@gmail.com
              </a>
              <a
                href="tel:+251918266383"
                className="flex items-center gap-2.5 text-[13px] text-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 opacity-50" />
                +251 91 826 6383
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Hours
            </h4>
            <div className="space-y-1.5 text-[13px] text-muted-foreground">
              <p>Mon – Sat: 2:00 AM – 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Links
            </h4>
            <div className="space-y-2 text-[13px]">
              <p>
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </p>
              <p>
                <Link to="/cart" className="text-foreground/80 hover:text-primary transition-colors">
                  Cart
                </Link>
              </p>
              <p>
                <Link
                  to="/auth?redirect=/admin"
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.04] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Pitory Computer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
