export function Footer() {
  return (
    <footer className="bg-card/90 backdrop-blur border-t mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Pitory Computer
            </h3>
            <p className="text-muted-foreground">
              Your trusted partner for high-performance computers and exceptional customer service.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Information</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: support@pitorycomputer.com</p>
              <p>Phone: +251 91 826 6383</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Business Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Pitory Computer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}