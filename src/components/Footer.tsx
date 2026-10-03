import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-base mb-3 text-foreground">
              <a href="/" className="hover:text-primary transition-colors">
                Pitory Computer
              </a>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for high-performance computers and exceptional customer service.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3 text-foreground">Order By Phone</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 opacity-60" />
                <span>pitorypc@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 opacity-60" />
                <span>+251 91 826 6383</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3 text-foreground">Business Hours</h4>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>Monday - Friday: 2:00 AM - 12:00 PM</p>
              <p>Saturday: 2:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3 text-foreground">Quick Links</h4>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p><a href="/" className="hover:text-primary transition-colors">Home</a></p>
              <p><a href="/admin" className="hover:text-primary transition-colors">Admin</a></p>
              <p><a href="/cart" className="hover:text-primary transition-colors">Cart</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Pitory Computer Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
