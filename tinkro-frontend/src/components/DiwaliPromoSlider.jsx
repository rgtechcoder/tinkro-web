import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';

const diwaliSlides = [
  {
    id: 2,
    title: "🎉 Happy Diwali from Tinkro! 🎆",
    subtitle: "Tinkro परिवार की तरफ से आप सभी को दीपावली की हार्दिक शुभकामनाएं! May your life be filled with light, learning, and innovation.",
    buttonText: "Wish Your Friends 🎉",
    bgGradient: "from-purple-600 via-pink-400 to-yellow-400",
    icon: "🎇",
    cta: false
  },
  {
    id: 1,
    title: "🪔 Diwali Special Offer! ✨",
    subtitle: "Light up your learning this Diwali! Get 25% OFF on all Robotics Kits",
    buttonText: "Shop Now 🛍️",
    bgGradient: "from-orange-500 via-yellow-500 to-red-500",
    icon: "🪔",
    cta: true
  },
  {
    id: 3,
    title: "🤖 Festival of Lights, Festival of Learning",
    subtitle: "This Diwali, spark curiosity and creativity with hands-on robotics & STEM kits.",
    buttonText: "Explore STEM Kits 🚀",
    bgGradient: "from-blue-600 via-cyan-400 to-yellow-300",
    icon: "✨",
    cta: true
  },
  {
    id: 4,
    title: "🔥 25% OFF Diwali Mega Sale!",
    subtitle: "Grab your favorite robotics kits at flat 25% discount. Limited time Diwali offer!",
    buttonText: "Get 25% OFF Now",
    bgGradient: "from-yellow-400 via-orange-500 to-red-600",
    icon: "💥",
    cta: true
  }
];

const DiwaliPromoSlider = ({ setCurrentPage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % diwaliSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;
  const currentSlideData = diwaliSlides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.6 }}
          className={`relative bg-gradient-to-r ${currentSlideData.bgGradient} px-4 py-8 flex flex-col items-center justify-center`}
          style={{ minHeight: 320 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors z-20"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="container mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl animate-pulse">{currentSlideData.icon}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {currentSlideData.title}
                </h2>
                <span className="text-3xl animate-pulse">{currentSlideData.icon}</span>
              </div>
              <p className="text-lg md:text-xl text-white/95 mb-4 font-medium drop-shadow-md">
                {currentSlideData.subtitle}
              </p>
              {currentSlideData.cta && (
                <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
                  <Button
                    onClick={() => setCurrentPage && setCurrentPage('products')}
                    className="bg-white text-orange-600 hover:bg-yellow-50 font-bold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    {currentSlideData.buttonText}
                  </Button>
                  <span className="text-sm text-white/80 font-medium">
                    *Valid till Bhai Dooj | Limited Time Only
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-10 text-2xl animate-bounce" style={{animationDelay: '0s'}}>🪔</div>
            <div className="absolute top-12 right-16 text-xl animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
            <div className="absolute bottom-8 left-20 text-lg animate-bounce" style={{animationDelay: '1s'}}>🎆</div>
            <div className="absolute bottom-4 right-12 text-xl animate-pulse" style={{animationDelay: '1.5s'}}>🎇</div>
            <div className="absolute top-1/2 left-8 text-sm animate-pulse" style={{animationDelay: '2s'}}>⭐</div>
            <div className="absolute top-1/3 right-8 text-sm animate-bounce" style={{animationDelay: '2.5s'}}>🌟</div>
          </div>

          {/* Progress indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {diwaliSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DiwaliPromoSlider;