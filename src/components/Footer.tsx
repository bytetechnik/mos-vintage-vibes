import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-background text-center py-6 text-muted-foreground text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-vintage-orange-foreground font-bold text-sm">MV</span>
              </div>
              <span className="text-xl font-bold">Mo's VintageWorld</span>
            </div>
            <p className="text-urban-gray mb-4">
              Your destination for authentic vintage streetwear and contemporary urban fashion.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-5 h-5 text-urban-gray hover:text-vintage-orange cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-urban-gray hover:text-vintage-orange cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-urban-gray hover:text-vintage-orange cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-urban-gray hover:text-vintage-orange cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-urban-gray hover:text-vintage-orange transition-colors">All Products</Link></li>
              <li><Link to="/products?category=sweaters-hoodies" className="text-urban-gray hover:text-vintage-orange transition-colors">Hoodies</Link></li>
              <li><Link to="/products?category=jeans" className="text-urban-gray hover:text-vintage-orange transition-colors">Jeans</Link></li>
              <li><Link to="/products?category=jackets" className="text-urban-gray hover:text-vintage-orange transition-colors">Jackets</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-urban-gray hover:text-vintage-orange transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-urban-gray hover:text-vintage-orange transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-urban-gray hover:text-vintage-orange transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-urban-gray hover:text-vintage-orange transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-urban-gray hover:text-vintage-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-urban-gray hover:text-vintage-orange transition-colors">Terms of Service</Link></li>
              <li><Link to="/imprint" className="text-urban-gray hover:text-vintage-orange transition-colors">Imprint</Link></li>
              <li><Link to="/return-policy" className="text-urban-gray hover:text-vintage-orange transition-colors">Return Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-urban-gray/30 mt-8 pt-8 text-center text-urban-gray">
          <div className="mt-2">
            Developed by <a href="https://bytetechnik.de" target="_blank" rel="noopener noreferrer" className="underline">Bytetechnik.de</a>
          </div>
          <div className="mt-1">
            &copy; {year} Mo's VintageWorld. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;