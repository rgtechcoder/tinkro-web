import React from 'react';
import { Instagram, Mail, Phone, Youtube } from 'lucide-react';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
               <img src="https://horizons-cdn.hostinger.com/e7c9821b-6b7a-44e2-b895-23441ddb63a1/d68cad29faeccc76733f807b9ad82502.png" alt="Tinkro Logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 text-sm">
              Making robotics fun and easy for students. Build, learn, and innovate with Tinkro!
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick Links</span>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('home')} className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </button>
              <button onClick={() => setCurrentPage('products')} className="block text-gray-300 hover:text-white transition-colors text-sm">
                Products
              </button>
              <button onClick={() => setCurrentPage('about')} className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </button>
              <button onClick={() => setCurrentPage('blog')} className="block text-gray-300 hover:text-white transition-colors text-sm">
                Blog
              </button>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contact</span>
            <div className="space-y-3">
              <a href="mailto:tinkrokits@gmail.com" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Mail className="h-4 w-4" />
                <span>tinkrokits@gmail.com</span>
              </a>
              <a href="tel:9644525429" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Phone className="h-4 w-4" />
                <span>9644525429</span>
              </a>
              <a href="tel:6260947192" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Phone className="h-4 w-4" />
                <span>6260947192</span>
              </a>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Follow Us</span>
            <div className="space-y-3">
              <a
                href="https://instagram.com/tinkrokits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Instagram className="h-5 w-5" />
                <span>@tinkrokits</span>
              </a>
              <a
                href="https://youtube.com/@tinkro?si=tuFbEas0sHTFbni4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Youtube className="h-5 w-5" />
                <span>Tinkro YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Tinkro. All rights reserved. | www.tinkro.in
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;