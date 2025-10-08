import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Header = ({
  currentPage,
  setCurrentPage,
  cartItemsCount,
  setIsCartOpen
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'products',
    label: 'Products'
  }, {
    id: 'about',
    label: 'About Us'
  }, {
    id: 'blog',
    label: 'Blog'
  }, {
    id: 'contact',
    label: 'Contact'
  }];
  return <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <img src="https://horizons-cdn.hostinger.com/e7c9821b-6b7a-44e2-b895-23441ddb63a1/d68cad29faeccc76733f807b9ad82502.png" alt="Tinkro Logo" className="h-10 w-auto" />
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`text-sm font-medium transition-colors ${currentPage === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                {item.label}
              </button>)}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>}
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && <motion.nav initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map(item => <button key={item.id} onClick={() => {
          setCurrentPage(item.id);
          setIsMobileMenuOpen(false);
        }} className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item.label}
              </button>)}
          </motion.nav>}
      </div>
    </header>;
};
export default Header;