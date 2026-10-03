import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-[15px] tracking-tight text-foreground mb-3">
              <a href="/" className="hover:text-primary transition-colors">
                Pitory
              </a>
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
              <p><a href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</a></p>
              <p><a href="/cart" className="text-foreground/80 hover:text-primary transition-colors">Cart</a></p>
              <p><a href="/admin" className="text-foreground/80 hover:text-primary transition-colors">Admin</a></p>
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
