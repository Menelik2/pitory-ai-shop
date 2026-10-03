import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  cartItemCount: number;
  onSearch: (query: string) => void;
}

export function Header({ cartItemCount, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const navigationLinks = [
    { name: "Home", href: "/" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
              Pitory Computer
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search computers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-black/10 bg-secondary/50 focus-visible:ring-primary/30"
              />
            </div>
            <Button type="submit" size="sm" className="rounded-xl h-10">
              Search
            </Button>
          </form>

          <div className="flex items-center space-x-1">
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative rounded-xl h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:flex items-center">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="rounded-xl border-black/10">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-white">
                  <div className="flex flex-col space-y-6 mt-6">
                    <form onSubmit={handleSearch} className="flex flex-col space-y-2">
                      <Input
                        type="text"
                        placeholder="Search computers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-black/10"
                      />
                      <Button type="submit" size="sm" className="rounded-xl">
                        Search
                      </Button>
                    </form>

                    <nav className="flex flex-col space-y-3">
                      {navigationLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
