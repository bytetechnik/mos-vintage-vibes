import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-background text-muted-foreground text-xs sm:text-sm">
      {/* Newsletter Top Row */}
      <div className="w-full flex flex-col items-center justify-center py-8 border-b border-urban-gray/20 px-2 sm:px-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2">Subscribe to our Newsletter</h3>
        <p className="text-urban-gray mb-4 text-xs sm:text-sm max-w-md text-center">Get exclusive offers, updates, and the latest drops straight to your inbox.</p>
        <form
          className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md"
          onSubmit={e => { e.preventDefault(); /* Add subscribe logic here */ }}
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-3 py-2 rounded border border-urban-gray/30 focus:border-vintage-orange focus:outline-none w-full sm:w-auto text-sm bg-white text-black"
          />
          <button
            type="submit"
            className="bg-vintage-orange hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition-colors text-sm"
          >
            Subscribe
          </button>
        </form>
      </div>
      {/* Main Footer Grid */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand/About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.jpeg" alt="Mo's VintageWorld Logo" className="w-8 h-8 object-contain rounded" />
              <span className="text-xl font-bold">Mo's VintageWorld</span>
            </div>
            <p className="text-urban-gray mb-4 max-w-xs">
              Your destination for authentic vintage streetwear and contemporary urban fashion.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
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
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-urban-gray/30 py-6 text-center text-urban-gray">
        <div className="mb-1">
          Developed by <a href="https://bytetechnik.de" target="_blank" rel="noopener noreferrer" className="underline">Bytetechnik.de</a>
        </div>
        <div>
          &copy; {year} Mo's VintageWorld. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;