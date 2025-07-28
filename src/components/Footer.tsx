import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/90 backdrop-blur border-t mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
             
              <a href="/" className="hover:text-primary transition-colors"> Pitory Computer </a>
            </h3>
            <p className="text-muted-foreground">
              Your trusted partner for high-performance computers and exceptional customer service.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Order By Phone</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email: pitorypc@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone: +251 91 826 6383</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Business Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday - Friday: 2:00 AM - 12:00 PM</p>
              <p>Saturday: 2:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-muted-foreground">
              <p><a href="/" className="hover:text-primary transition-colors">Home</a></p>
              <p><a href="/admin" className="hover:text-primary transition-colors">Admin</a></p>
              <p><a href="/cart" className="hover:text-primary transition-colors">Cart</a></p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Pitory Computer Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
