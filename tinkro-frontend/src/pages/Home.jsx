import React, { useEffect, useState, useRef } from 'react';
import { Rocket, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ATLParticles from '@/components/ATLParticles';
import ProductService from '../services/ProductService';

// --- MarqueeSlider: Continuous smooth scrolling image carousel ---
function MarqueeSlider() {
  const images = [
    '/unleash.jpeg',
    '/unleash2.jpeg',
    '/unleash3.jpeg',
    '/unleash4.jpeg',
  ];
  // Repeat images for seamless loop
  const allImages = [...images, ...images];
  return (
    <div className="marquee-slider">
      {/* ...existing code... */}
    </div>
  );
}


// ...existing code...


export default function Home({ setCurrentPage }) {
  // Featured products state
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // Learn More section state
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Load featured products on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const products = await ProductService.getFeaturedProducts();
        if (isMounted) setFeaturedProducts(products || []);
      } catch (err) {
        setFeaturedProducts([]);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const features = [
    {
      icon: Rocket,
      title: 'Innovative Learning',
      description: 'Hands-on robotics kits designed to spark creativity and innovation.',
      bg: 'from-blue-100 to-blue-50',
      heading: 'text-blue-600',
      border: 'bg-gradient-to-r from-blue-500 to-blue-400',
      iconBg: 'from-blue-500 to-blue-400',
    },
    {
      icon: Users,
      title: 'For Schools & Students',
      description: 'Perfect for individual learners and bulk orders for educational institutions.',
      bg: 'from-pink-100 to-pink-50',
      heading: 'text-pink-600',
      border: 'bg-gradient-to-r from-pink-500 to-pink-400',
      iconBg: 'from-pink-500 to-pink-400',
    },
    {
      icon: Award,
      title: 'ATL Lab Setup & Services',
      description: 'We provide complete setup, training, and support for ATL (Atal Tinkering Lab) and modern STEM/Robotics labs in schools. Send your enquiry to get all the details and guidance for your institution!',
      bg: 'from-orange-100 to-orange-50',
      heading: 'text-orange-600',
      border: 'bg-gradient-to-r from-orange-500 to-orange-400',
      iconBg: 'from-orange-500 to-orange-400',
    },
  ];

  // Auto-hover/spotlight state for features
  const [activeFeature, setActiveFeature] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <Helmet>
        <title>Tinkro - Home | Robotics Kits for Students</title>
        <meta name="description" content="Welcome to Tinkro! Discover innovative robotics kits for school students. Make learning fun with hands-on STEM education." />
      </Helmet>

      {/* Hero Section - Upgraded Robotics Brand Look */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tinkro-blue via-tinkro-light-blue to-tinkro-orange min-h-[520px] flex items-center">
        {/* Animated SVG Gears/Shapes */}
        <svg className="absolute left-0 top-0 w-96 h-96 opacity-10 z-0" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#00529A" strokeWidth="18" fill="#E6F4FF" />
          <g>
            <circle cx="200" cy="200" r="80" fill="#F58220" opacity="0.18" />
            <rect x="120" y="120" width="160" height="160" rx="80" fill="#00529A" opacity="0.08" />
          </g>
        </svg>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-tinkro-orange to-tinkro-blue shadow-lg animate-spin-slow">
                  {/* Simple robot/gear icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#F58220" strokeWidth="3"/><circle cx="16" cy="16" r="7" fill="#00529A"/><rect x="14" y="4" width="4" height="6" rx="2" fill="#00529A"/><rect x="14" y="22" width="4" height="6" rx="2" fill="#00529A"/><rect x="4" y="14" width="6" height="4" rx="2" fill="#00529A"/><rect x="22" y="14" width="6" height="4" rx="2" fill="#00529A"/></svg>
                </span>
                <span className="uppercase tracking-widest text-xs font-bold text-tinkro-orange">India's Top Robotics Brand</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-tinkro-blue drop-shadow-lg">
                Tinker Today, <br /> <span className="gradient-text">Robot Tomorrow.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 font-medium">
                <span className="text-tinkro-orange font-bold">Tinkro</span> makes STEM learning fun! Empowering students to build, code, and blast off into the world of robotics with <span className="text-tinkro-blue font-bold">India's most creative kits</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-tinkro-orange to-tinkro-blue text-white shadow-lg px-8 text-lg font-semibold hover:from-orange-600 hover:to-blue-800"
                  >
                    Explore Kits <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-tinkro-blue text-tinkro-blue hover:bg-tinkro-blue/10 px-8 text-lg font-semibold"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-tinkro-blue to-tinkro-orange rounded-full blur-3xl opacity-20"></div>
              <img 
                alt="Tinker Today, Robot Tomorrow - Girl building a robot" 
                className="rounded-2xl shadow-2xl relative z-10 animate-float w-full max-w-md responsive-img" 
                src="https://horizons-cdn.hostinger.com/e7c9821b-6b7a-44e2-b895-23441ddb63a1/b38127d5ea95fcb740734489af69d353.jpg" 
              />
            </motion.div>
          </div>
        </div>
      </section>


  {/* Features Section */}
      {/* Top Robotics Kits Section (moved below features) */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Top Robotics Kits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">India’s most loved robotics kits for students and schools—trusted by educators, loved by innovators!</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.7, type: 'spring', bounce: 0.35 }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(80, 120, 255, 0.18)', y: -8 }}
                className="relative bg-white rounded-3xl shadow-xl p-7 flex flex-col items-center border border-blue-100 hover:border-tinkro-blue transition-all group overflow-hidden"
              >
                <div className="relative w-28 h-28 mb-4">
                  <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-tinkro-orange to-tinkro-blue flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#F58220" strokeWidth="2"/><circle cx="16" cy="16" r="7" fill="#00529A"/></svg>
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-tinkro-blue text-center group-hover:text-tinkro-orange transition-colors">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 text-center">{product.description}</p>
                <span className="text-xl font-bold text-tinkro-orange mb-2">₹{product.price}</span>
                <Link to="/products" className="mt-auto">
                  <Button size="sm" className="bg-tinkro-blue text-white hover:bg-orange-500 transition-colors">View Details</Button>
                </Link>
                {/* Animated border effect */}
                <span className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-tinkro-orange transition-all"></span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products">
              <Button size="lg" className="bg-tinkro-orange text-white hover:bg-orange-600 shadow-lg px-8 py-3 text-lg font-semibold">See All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="gradient-text">Tinkro?</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Empowering the next generation with hands-on robotics education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.7, type: 'spring', bounce: 0.35 }}
                  animate={
                    feature.title === 'ATL Lab Setup & Services'
                      ? isActive
                        ? { scale: 1.08, rotate: -1, boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.18)' }
                        : { scale: 1, rotate: 0, boxShadow: '0 2px 8px 0 rgba(255,152,0,0.08)' }
                      : isActive
                        ? { scale: 1.06, boxShadow: '0 8px 32px 0 rgba(80, 120, 255, 0.15)' }
                        : { scale: 1, boxShadow: '0 2px 8px 0 rgba(80,120,255,0.06)' }
                  }
                  whileHover={
                    feature.title === 'ATL Lab Setup & Services'
                      ? { scale: 1.12, rotate: -2, boxShadow: '0 12px 40px 0 rgba(255, 152, 0, 0.22)' }
                      : { scale: 1.06, boxShadow: '0 8px 32px 0 rgba(80, 120, 255, 0.15)' }
                  }
                  className={`relative p-8 rounded-2xl shadow-lg border border-gray-100 group overflow-hidden transition-all ${isActive ? 'ring-2 ring-tinkro-blue/30' : ''} bg-gradient-to-br ${feature.bg} ${feature.title === 'ATL Lab Setup & Services' ? 'atl-animated-card' : ''}`}
                  style={{ cursor: 'pointer', zIndex: feature.title === 'ATL Lab Setup & Services' ? 10 : 'auto' }}
                >
                  {/* Animated SVG wave background and particles for ATL card */}
                  {feature.title === 'ATL Lab Setup & Services' && (
                    <>
                      <span className="atl-glow-border"></span>
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <svg width="100%" height="100%" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0 w-full h-full">
                          <path d="M0 120 Q100 180 200 120 T400 120 V180 H0Z" fill="#fffbe6" opacity="0.35">
                            <animate attributeName="d" dur="6s" repeatCount="indefinite"
                              values="M0 120 Q100 180 200 120 T400 120 V180 H0Z;M0 130 Q100 110 200 140 T400 130 V180 H0Z;M0 120 Q100 180 200 120 T400 120 V180 H0Z" />
                          </path>
                        </svg>
                        <ATLParticles />
                      </div>
                    </>
                  )}
                  {/* Animated glowing border for ATL card */}
                  {feature.title === 'ATL Lab Setup & Services' && (
                    <span className="atl-glow-border"></span>
                  )}
                  {/* Animated gradient border */}
                  <div className={`absolute inset-0 rounded-2xl pointer-events-none z-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} style={{background: 'linear-gradient(120deg, #3b82f6 0%, #f59e42 100%)', filter: 'blur(12px)', opacity: 0.18}}></div>
                  {/* Icon with pop effect */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-md ${feature.title === 'ATL Lab Setup & Services' ? 'atl-float-icon' : ''}`}
                    animate={
                      feature.title === 'ATL Lab Setup & Services'
                        ? { y: [0, -8, 0, 8, 0], scale: isActive ? 1.22 : 1, rotate: isActive ? -10 : 0 }
                        : isActive ? { scale: 1.18, rotate: -8 } : { scale: 1, rotate: 0 }
                    }
                    transition={
                      feature.title === 'ATL Lab Setup & Services'
                        ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                        : { type: 'spring', stiffness: 300 }
                    }
                  >
                    <feature.icon className="h-8 w-8 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-3 relative z-10 transition-colors duration-300 ${feature.heading} ${isActive ? '!text-black' : ''} group-hover:text-black`}>{feature.title}</h3>
                  <p className={`text-gray-600 relative z-10 ${feature.title === 'ATL Lab Setup & Services' ? 'font-medium text-base md:text-lg atl-animated-bg' : ''}`}>{feature.description}</p>
                  {/* Enquiry Here link for ATL Lab Setup & Services with animation and highlight */}
                  {feature.title === 'ATL Lab Setup & Services' && (
                    <motion.div
                      className="relative z-10 mt-4 flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.13 }}
                        whileTap={{ scale: 0.97 }}
                        className="atl-enquiry-btn px-5 py-2 rounded-full font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        style={{ fontWeight: 600, letterSpacing: '0.02em', position: 'relative', overflow: 'hidden' }}
                        onClick={() => setCurrentPage && setCurrentPage('contact')}
                      >
                        <span className="atl-btn-shimmer"></span>
                        <span className="relative z-10 inline-block align-middle">Enquiry Here</span>
                        <span className="relative z-10 inline-block ml-1 animate-bounce">→</span>
                      </motion.button>
                      <span className="text-xs text-orange-500 font-medium animate-fade-in">Quick Response!</span>
                    </motion.div>
                  )}
                  {/* Gradient bottom border */}
                  <div className={`absolute left-0 right-0 bottom-0 h-2 rounded-b-2xl ${feature.border}`}></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 bg-tinkro-light-blue">
        <div className="container mx-auto px-2 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center rounded-3xl bg-white/60 p-2 md:p-6" style={{boxShadow:'0 4px 32px 0 rgba(25,118,210,0.06)'}}>
            {/* Left Marquee */}
            <div className="hidden md:flex flex-col gap-4 h-full justify-center">
              <MarqueeSlider direction="left" />
            </div>
            {/* Center Text */}
            <div className="flex flex-col items-center justify-center text-center py-8 px-2 md:px-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-tinkro-blue">Unleash Your Child's <span className="text-tinkro-orange">Creativity</span></h2>
              <p className="text-gray-600 text-base md:text-lg mb-6 max-w-xl">
                Our STEM-focused robotic kits make learning fun! We provide everything needed to build, code, and innovate, turning complex ideas into exciting, hands-on projects. Perfect for sparking a lifelong passion for technology.
              </p>
              <Button
                size="lg"
                className="bg-tinkro-orange text-white hover:bg-orange-600"
                onClick={() => setShowLearnMore((v) => !v)}
              >
                Learn More {showLearnMore ? <span>&#9650;</span> : <span>&#9660;</span>}
              </Button>
              {/* --- Learn More Content Section (collapsible) --- */}
              {showLearnMore && (
                <div className="mt-10 flex flex-col gap-8">
                  {/* Card 1: What's Included */}
                  <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-tinkro-blue mb-4 flex items-center gap-2">
                      <span role="img" aria-label="included">🛠️</span> What's Included in Every Kit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                      <div>
                        <div className="font-semibold text-tinkro-blue">High-Quality Components</div>
                        <div className="text-gray-700">Motors, sensors, microcontrollers, and all necessary parts</div>
                      </div>
                      <div>
                        <div className="font-semibold text-tinkro-blue">Step-by-Step Guide</div>
                        <div className="text-gray-700">Easy-to-follow instructions with images and videos</div>
                      </div>
                      <div>
                        <div className="font-semibold text-tinkro-blue">Coding Software</div>
                        <div className="text-gray-700">Block-based and text-based programming options</div>
                      </div>
                      <div>
                        <div className="font-semibold text-tinkro-blue">Project Ideas</div>
                        <div className="text-gray-700">10+ exciting projects to build and customize</div>
                      </div>
                    </div>
                  </div>
                  {/* Card 2: Skills */}
                  <div className="bg-[#f8fafc] rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-tinkro-blue mb-4 flex items-center gap-2">
                      <span role="img" aria-label="skills">🧑‍💻</span> Skills Your Child Will Develop
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
                      <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                        <div className="font-semibold text-tinkro-blue flex items-center gap-2"><span>⌨️</span> Programming</div>
                        <div className="text-gray-700">Learn Python, C++, or block-based coding through hands-on robotics projects</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                        <div className="font-semibold text-tinkro-blue flex items-center gap-2"><span>🛠️</span> Engineering</div>
                        <div className="text-gray-700">Understand mechanics, electronics, and how things work from the inside out</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                        <div className="font-semibold text-tinkro-blue flex items-center gap-2"><span>🧠</span> Problem Solving</div>
                        <div className="text-gray-700">Develop critical thinking and debugging skills through trial and error</div>
                      </div>
                    </div>
                  </div>
                  {/* Card 3: Ages */}
                  <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-tinkro-blue mb-4">Perfect for Ages 6-18</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
                      <div className="border-l-4 border-green-500 pl-3">
                        <div className="font-bold text-green-700">Beginner (6-10)</div>
                        <div className="text-gray-700">Simple snap-together kits with block coding</div>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <div className="font-bold text-blue-700">Intermediate (11-14)</div>
                        <div className="text-gray-700">Arduino-based projects with sensor integration</div>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <div className="font-bold text-orange-700">Advanced (15-18)</div>
                        <div className="text-gray-700">AI, IoT, and competition-ready robotics</div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        className="bg-tinkro-blue text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                        onClick={() => setCurrentPage && setCurrentPage('products')}
                      >
                        Browse Our Kits &rarr;
                      </button>
                    </div>
                  </div>
                  </div>
                )}
            </div>
            {/* Right Marquee (mirror or static) */}
            <div className="hidden md:flex flex-col gap-4 h-full justify-center">
              <MarqueeSlider direction="left" />
            </div>
          </div>
        </div>
      </section>


      {/* Product Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Build. Code. <span className="gradient-text">Blast Off.</span></h2>
            <p className="text-lg mb-8 text-gray-600 max-w-3xl mx-auto">
              Discover our range of educational robotics & electronics kits for young innovators. From LED fun kits to advanced competition robots, there's a Tinkro kit for every curious mind.
            </p>
             <img 
               alt="Tinkro 4WD Car" 
               className="responsive-img" 
               src="/4wd car.jpeg" 
               style={{width: '100%', maxWidth: '100%', height: 'auto', objectFit: 'contain', borderRadius: '16px', margin: '0 auto', display: 'block'}} 
             />
            <Button
              size="lg"
              className="bg-tinkro-blue text-white hover:bg-blue-800 mt-12"
              onClick={() => setCurrentPage('products')}
            >
              See All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}



