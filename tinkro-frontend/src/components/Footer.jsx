import React from 'react';
import { Instagram, Mail, Phone, Youtube, MessageCircle, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ navigateToPage }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
               <img src="/images/tinkro-logo.png" alt="Tinkro Logo" className="h-10 w-auto" onError={e => { e.target.onerror = null; e.target.src = '/favicon.ico'; }} />
            </div>
            <p className="text-gray-300 text-sm">
              Making robotics fun and easy for students. Build, learn, and innovate with Tinkro!
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick Links</span>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/products" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Products
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link to="/blog" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contact</span>
            <div className="space-y-3">
              <a href="mailto:hello@tinkro.in" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Mail className="h-4 w-4" />
                <span>hello@tinkro.in</span>
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
                className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
              >
                <Instagram className="h-5 w-5" />
                <span>@tinkrokits</span>
              </a>
              <a
                href="https://youtube.com/@tinkro?si=tuFbEas0sHTFbni4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors text-sm"
              >
                <Youtube className="h-5 w-5" />
                <span>Tinkro YouTube</span>
              </a>
              <a
                href="https://linkedin.com/company/tinkro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://wa.me/919644525429?text=Hi%20Tinkro%2C%20I%20want%20to%20know%20about%20robotics%20kits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Chat</span>
              </a>
              <a
                href="https://whatsapp.com/channel/0029VaQXKgJKmL8jJ5P0mP0m"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors text-sm"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Tinkro Channel</span>
              </a>
              <a
                href="https://facebook.com/tinkrokits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 transition-colors text-sm"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Tinkro Edutech LLP . All rights reserved. | www.tinkro.in
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;