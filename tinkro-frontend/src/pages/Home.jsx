import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Rocket, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home({ setCurrentPage }) {
  const features = [
    {
      icon: Rocket,
      title: 'Innovative Learning',
      description: 'Hands-on robotics kits designed to spark creativity and innovation.',
    },
    {
      icon: Users,
      title: 'For Schools & Students',
      description: 'Perfect for individual learners and bulk orders for educational institutions.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium components and comprehensive learning materials included.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Tinkro - Home | Robotics Kits for Students</title>
        <meta name="description" content="Welcome to Tinkro! Discover innovative robotics kits for school students. Make learning fun with hands-on STEM education." />
      </Helmet>

      {/* Hero Section - Original Design */}
      <section className="relative bg-tinkro-light-blue overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-tinkro-blue">
                Tinker Today, <br /> <span className="gradient-text">Robot Tomorrow.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600">
                Introducing Tinkro: STEM Learning Made Fun! Empowering students to build, code, and blast off into the world of robotics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-tinkro-orange text-white hover:bg-orange-600 shadow-lg"
                  onClick={() => setCurrentPage('products')}
                >
                  Explore Kits <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-tinkro-blue text-tinkro-blue hover:bg-tinkro-blue/10"
                  onClick={() => setCurrentPage('contact')}
                >
                  Contact Us
                </Button>
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
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-tinkro-blue to-tinkro-orange rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-tinkro-blue">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-tinkro-light-blue">
        <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                  <img alt="Unleash Your Child's Creativity with Tinkro" className="responsive-img" src="https://images.unsplash.com/photo-1651421433361-2c45e7f3e801" />
              </motion.div>
               <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-tinkro-blue">Unleash Your Child's <span className="text-tinkro-orange">Creativity</span></h2>
                <p className="text-gray-600 text-lg mb-6">
                  Our STEM-focused robotic kits make learning fun! We provide everything needed to build, code, and innovate, turning complex ideas into exciting, hands-on projects. Perfect for sparking a lifelong passion for technology.
                </p>
                 <Button
                  size="lg"
                  className="bg-tinkro-orange text-white hover:bg-orange-600"
                  onClick={() => setCurrentPage('about')}
                >
                  Learn More
                </Button>
              </motion.div>
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
             <img alt="Tinkro product lineup" className="responsive-img" src="https://images.unsplash.com/photo-1518314916381-77a37c2a49ae" />
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