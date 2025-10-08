import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make robotics education accessible and fun for every student, empowering the next generation of innovators.',
    },
    {
      icon: Heart,
      title: 'Our Passion',
      description: 'We believe in hands-on learning that sparks curiosity and builds confidence in STEM subjects.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Constantly updating our kits with the latest technology to keep students engaged and learning.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building a community of young innovators, educators, and robotics enthusiasts across India.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Tinkro | Our Mission & Vision</title>
        <meta name="description" content="Learn about Tinkro's mission to make robotics fun and easy for students. Discover our passion for STEM education and innovation." />
      </Helmet>
      <div>
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Tinkro</h1>
              <p className="text-lg md:text-xl text-blue-50">
                We're on a mission to make robotics education fun, accessible, and engaging for every student in India.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
                <p className="text-gray-600 mb-4 text-lg">
                  Tinkro is a passionate team of educators, engineers, and innovators dedicated to transforming STEM education in India. We believe that every student deserves the opportunity to explore robotics and technology in a hands-on, engaging way.
                </p>
                <p className="text-gray-600 text-lg">
                  Our robotics kits are designed specifically for Indian students from class 6 and above, combining quality components with comprehensive learning materials that make complex concepts easy to understand.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img alt="Tinkro team working on robotics education" className="rounded-2xl shadow-xl" src="https://images.unsplash.com/photo-1694532415679-13a10fb3d519" />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Robotics Education Matters</h2>
              <p className="text-gray-600 text-lg mb-6">
                In today's rapidly evolving world, robotics and automation are shaping the future. By introducing students to robotics early, we're not just teaching them to build robots—we're teaching them to think critically, solve problems creatively, and prepare for careers that don't even exist yet.
              </p>
              <p className="text-gray-600 text-lg">
                Tinkro kits are designed to make this learning journey exciting, with projects that range from simple line-following robots to advanced AI-powered machines. Every kit comes with step-by-step guides, video tutorials, and ongoing support to ensure success.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;