import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencySelector } from "@/components/CurrencySelector";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary font-heading">
              Wanderlust
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-10 items-center">
            <Link href="/" className="text-neutral-600 hover:text-primary font-medium">
              Find Destinations
            </Link>
            <Link href="/hotels" className="text-neutral-600 hover:text-primary font-medium">
              Hotels
            </Link>
            <Link href="/attractions" className="text-neutral-600 hover:text-primary font-medium">
              Attractions
            </Link>
            <Link href="/agents" className="text-neutral-600 hover:text-primary font-medium">
              Tour Guides
            </Link>
            <Link href="/plan" className="text-neutral-600 hover:text-primary font-medium">
              Plan Trip
            </Link>
            <Link href="/trips" className="text-neutral-600 hover:text-primary font-medium">
              My Trips
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
            <Button
              variant="outline"
              className="hidden md:block border-primary text-primary hover:bg-primary hover:text-white"
            >
              Sign In
            </Button>
            <Button className="bg-primary text-white hover:bg-blue-700">
              Sign Up
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-neutral-500 hover:text-primary"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t ${mobileMenuVisible ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            Find Destinations
          </Link>
          <Link href="/hotels" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            Hotels
          </Link>
          <Link href="/attractions" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            Attractions
          </Link>
          <Link href="/agents" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            Tour Guides
          </Link>
          <Link href="/plan" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            Plan Trip
          </Link>
          <Link href="/trips" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50">
            My Trips
          </Link>
          <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-primary">
            Sign In
          </Link>
          <div className="px-3 py-2">
            <CurrencySelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
