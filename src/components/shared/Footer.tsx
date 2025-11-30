"use client";
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (email) {
      // Add subscribe logic here
      console.log('Subscribing:', email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-background text-muted-foreground text-xs sm:text-sm border-t border-urban-gray/20">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand/About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.jpeg" alt="Mo's VintageWorld Logo" width={32} height={32} className="w-8 h-8 object-contain rounded" />
              <span className="text-xl font-bold">Mo&apos;s Vintageworld</span>
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
              <li><Link href="/products" className="text-urban-gray hover:text-vintage-orange transition-colors">All Products</Link></li>
              <li><Link href="/products?category=sweaters-hoodies" className="text-urban-gray hover:text-vintage-orange transition-colors">Hoodies</Link></li>
              <li><Link href="/products?category=jeans" className="text-urban-gray hover:text-vintage-orange transition-colors">Jeans</Link></li>
              <li><Link href="/products?category=jackets" className="text-urban-gray hover:text-vintage-orange transition-colors">Jackets</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-urban-gray hover:text-vintage-orange transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-urban-gray hover:text-vintage-orange transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="text-urban-gray hover:text-vintage-orange transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="text-urban-gray hover:text-vintage-orange transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-2">Newsletter</h3>
            <p className="text-urban-gray mb-4 text-center md:text-left">Get exclusive offers and latest drops.</p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-3 py-2 rounded border border-urban-gray/30 focus:border-vintage-orange focus:outline-none w-full sm:w-auto text-sm bg-white text-black"
              />
              <button
                onClick={handleSubscribe}
                className="bg-vintage-orange hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition-colors text-sm w-full sm:w-auto"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-urban-gray/30 py-6 text-center text-urban-gray">
        <div className="mb-1">
          Developed by <a href="https://bytetechnik.de" target="_blank" rel="noopener noreferrer" className="underline">Bytetechnik.de</a>
        </div>
        <div>
          &copy; {year} Mo&apos;s VintageWorld. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;