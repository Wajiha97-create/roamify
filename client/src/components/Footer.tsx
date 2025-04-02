import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  MapPin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-heading mb-4">Wanderlust</h3>
            <p className="text-neutral-400 mb-4">Plan your perfect trip within your budget. Discover amazing destinations worldwide.</p>
            <div className="flex space-x-3">
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors">
                <MapPin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="#"><a className="hover:text-white transition-colors">Europe</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Asia</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">North America</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">South America</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Africa</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Oceania</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Travel Types</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="#"><a className="hover:text-white transition-colors">Beach Getaways</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">City Breaks</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Mountain Retreats</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Cultural Experiences</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Adventure Tours</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Luxury Travel</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="#"><a className="hover:text-white transition-colors">Help Center</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Travel Resources</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">FAQ</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Contact Us</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Privacy Policy</a></Link></li>
              <li><Link href="#"><a className="hover:text-white transition-colors">Terms of Service</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-neutral-700 text-neutral-500 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Wanderlust Travel Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
