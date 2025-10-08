import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Products = ({ addToCart }) => {
  const products = [
    {
      id: 1,
      name: 'Beginner Robotics Kit',
      price: 2499,
      description: 'Perfect starter kit for class 6-8 students. Includes motors, sensors, and easy-to-follow guide.',
      image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80',
    },
    {
      id: 2,
      name: 'Advanced Robotics Kit',
      price: 4999,
      description: 'For class 9-12 students. Advanced sensors, programmable microcontroller, and complex projects.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    },
    {
      id: 3,
      name: 'School Bulk Pack (10 Kits)',
      price: 22999,
      description: 'Special bulk pricing for schools. Includes 10 beginner kits with teacher training materials.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
    },
    {
      id: 4,
      name: 'AI & Robotics Kit',
      price: 6999,
      description: 'Cutting-edge kit with AI capabilities. Perfect for advanced learners and competitions.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
    },
    {
      id: 5,
      name: 'Sensor Expansion Pack',
      price: 1499,
      description: 'Add-on pack with ultrasonic, IR, and temperature sensors for existing kits.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
    },
    {
      id: 6,
      name: 'Competition Robotics Kit',
      price: 8999,
      description: 'Professional-grade kit for robotics competitions. Includes premium components and tools.',
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&q=80',
    },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart! 🎉",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Products - Tinkro | Robotics Kits for Students</title>
        <meta name="description" content="Browse our collection of robotics kits for students. From beginner to advanced levels, find the perfect kit for learning robotics." />
      </Helmet>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Robotics Kits</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose from our range of carefully designed robotics kits for every skill level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;