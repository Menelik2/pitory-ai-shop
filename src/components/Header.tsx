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
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.04] bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-[17px] font-semibold tracking-tight text-foreground">
              Pitory
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-full border-black/[0.06] bg-[#f5f5f7] text-sm focus-visible:ring-primary/20"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:flex items-center ml-1">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="rounded-full text-muted-foreground hover:text-foreground h-9 text-[13px]"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-black/[0.08] h-9 text-[13px] font-medium"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white border-l border-black/[0.04]">
                  <div className="flex flex-col space-y-6 mt-8">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2">
                      <Input
                        type="text"
                        placeholder="Search computers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-black/[0.06] bg-[#f5f5f7]"
                      />
                      <Button type="submit" size="sm" className="rounded-full">
                        Search
                      </Button>
                    </form>

                    <nav className="flex flex-col gap-1">
                      {navigationLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="px-3 py-2.5 rounded-xl text-[15px] font-medium text-foreground hover:bg-[#f5f5f7] transition-colors"
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
