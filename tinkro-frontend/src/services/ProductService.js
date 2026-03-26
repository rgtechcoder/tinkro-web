/**
 * ProductService - Complete Product Management Service  
 * Handles all product operations: Create, Read, Update, Delete
 * Uses Firebase Firestore with localStorage fallback for cross-device sync
 */

import firestoreService from './FirestoreService.js';

class ProductService {
  static STORAGE_KEY = 'tinkro_products'; // Only used for minimal caching now

  // Default products for initialization
  static getDefaultProducts() {
    return [
      {
        id: 1,
        name: 'Beginner Robotics Kit',
        price: 2499,
        description: 'Perfect starter kit for class 6-8 students. Includes motors, sensors, and easy-to-follow guide.',
        image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80',
        category: 'Arduino Kits',
        stock: 50,
        status: 'published',
        featured: true,
        order: 1,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 2,
        name: 'Advanced Robotics Kit',
        price: 4999,
        description: 'For class 9-12 students. Advanced sensors, programmable microcontroller, and complex projects.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
        category: 'Advanced Kits',
        stock: 30,
        status: 'published',
        featured: true,
        order: 2,
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString()
      },
      {
        id: 3,
        name: 'School Bulk Pack (10 Kits)',
        price: 22999,
        description: 'Special bulk pricing for schools. Includes 10 beginner kits with teacher training materials.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
        category: 'Bulk Packs',
        stock: 15,
        status: 'published',
        featured: false,
        order: 3,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-01').toISOString()
      },
      {
        id: 4,
        name: 'AI & Robotics Kit',
        price: 6999,
        description: 'Cutting-edge kit with AI capabilities. Perfect for advanced learners and competitions.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
        category: 'AI Kits',
        stock: 25,
        status: 'published',
        featured: true,
        order: 4,
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString()
      },
      {
        id: 5,
        name: 'Sensor Expansion Pack',
        price: 1499,
        description: 'Add-on pack with ultrasonic, IR, and temperature sensors for existing kits.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
        category: 'Accessories',
        stock: 100,
        status: 'published',
        featured: false,
        order: 5,
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-15').toISOString()
      },
      {
        id: 6,
        name: 'Competition Robotics Kit',
        price: 8999,
        description: 'Professional-grade kit for robotics competitions. Includes premium components and tools.',
        image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&q=80',
        category: 'Competition Kits',
        stock: 20,
        status: 'published',
        featured: true,
        order: 6,
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date('2024-03-01').toISOString()
      }
    ];
  }

  // Sync default products to Firebase (one-time setup)
  static async syncDefaultsToFirebase(products) {
    if (!firestoreService.isAvailable()) return;
    try {
      console.log('🔄 ProductService: Syncing', products.length, 'default products to Firebase...');
      for (const product of products) {
        await firestoreService.addProduct(product);
      }
      // Only cache product count, not full data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ count: products.length, lastSync: Date.now() }));
      console.log('✅ ProductService: Default products synced to Firebase successfully');
    } catch (error) {
      console.warn('⚠️ ProductService: Failed to sync defaults to Firebase:', error);
    }
  }

  // Get all products with Firebase integration
  static async getAllProducts() {
    try {
      // Always use Firebase for product data
      if (firestoreService.isAvailable()) {
        const firebaseProducts = await firestoreService.getAllProducts();
        if (firebaseProducts.length > 0) {
          console.log('✅ ProductService: Loaded', firebaseProducts.length, 'products from Firebase');
          // Only cache product count, not full data
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ count: firebaseProducts.length, lastSync: Date.now() }));
          return firebaseProducts;
        } else {
          // Initialize Firebase with defaults if empty
          console.log('🔄 ProductService: Firebase empty, syncing defaults...');
          const defaults = this.getDefaultProducts();
          await this.syncDefaultsToFirebase(defaults);
          return defaults;
        }
      }
      // Fallback: no localStorage for full product data
      console.warn('⚠️ ProductService: Firebase unavailable, returning empty product list.');
      return [];
    } catch (error) {
      console.error('⚠️ ProductService: Error loading products:', error);
      // Final fallback to defaults (do not cache)
      return this.getDefaultProducts();
    }
  }

  // Get only published products (for frontend display)
  static async getPublishedProducts() {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts
        .filter(product => product.status === 'published')
        .sort((a, b) => (a.order || 999) - (b.order || 999)); // Sort by order
    } catch (error) {
      console.error('ProductService: Error loading published products:', error);
      return [];
    }
  }

  // Get featured products (for homepage slider)
  static async getFeaturedProducts() {
    try {
      const publishedProducts = await this.getPublishedProducts();
      return publishedProducts.filter(product => product.featured === true);
    } catch (error) {
      console.error('ProductService: Error loading featured products:', error);
      return [];
    }
  }

  // Add new product with Firebase sync
  static async addProduct(productData) {
    try {
      const products = await this.getAllProducts();
      console.log('ProductService: Adding product:', productData.name);

      // Get next order number
      const maxOrder = Math.max(...products.map(p => p.order || 0));

      // Prepare product data (without id)
      const newProductData = {
        name: productData.name || 'Untitled Product',
        price: parseFloat(productData.price) || 0,
        description: productData.description || '',
        image: productData.image || '',
        category: productData.category || 'General',
        stock: parseInt(productData.stock) || 0,
        status: productData.status || 'published',
        featured: productData.featured || false,
        order: productData.order || (maxOrder + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to Firebase first for cross-device sync
      let addedProduct = null;
      try {
        addedProduct = await firestoreService.addProduct(newProductData);
        console.log('ProductService: Product synced to Firebase:', addedProduct.name);
      } catch (firebaseError) {
        console.warn('ProductService: Firebase sync failed, using localStorage only:', firebaseError);
        // Fallback: generate a string id
        addedProduct = { ...newProductData, id: Date.now().toString() };
      }

      // Only update product count in localStorage
      products.push(addedProduct);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ count: products.length, lastSync: Date.now() }));
      console.log('ProductService: Product added successfully:', addedProduct.name);
      return addedProduct;
    } catch (error) {
      console.error('ProductService: Error adding product:', error);
      throw error;
    }
  }

  // Update existing product
  static updateProduct(id, productData) {
    return (async () => {
      try {
        let products = await this.getAllProducts();
        console.log('ProductService: Updating product with ID:', id);

        const productIndex = products.findIndex(product => 
          product.id === parseInt(id) || product.id === id
        );

        if (productIndex === -1) {
          throw new Error(`Product not found with ID: ${id}`);
        }

        // Handle base64 images (from file upload)
        let processedImageUrl = productData.image;
        if (productData.image && productData.image.trim()) {
          processedImageUrl = productData.image.trim();
          if (processedImageUrl.startsWith('data:image/')) {
            console.log('ProductService: Base64 image detected for product');
          } else {
            if (processedImageUrl !== products[productIndex].image) {
              const separator = processedImageUrl.includes('?') ? '&' : '?';
              processedImageUrl = `${processedImageUrl}${separator}v=${Date.now()}`;
            }
          }
        }

        const updatedProduct = {
          ...products[productIndex],
          ...productData,
          image: processedImageUrl,
          price: parseFloat(productData.price) || products[productIndex].price,
          stock: parseInt(productData.stock) || products[productIndex].stock,
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };

        // Try to update in Firebase first
        try {
          if (firestoreService.isAvailable()) {
            await firestoreService.updateProduct(updatedProduct.id, updatedProduct);
            console.log('ProductService: Product updated in Firebase:', updatedProduct.name);
          }
        } catch (firebaseError) {
          console.warn('ProductService: Firebase update failed, using localStorage only:', firebaseError);
        }

        products[productIndex] = updatedProduct;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
        console.log('ProductService: Product updated successfully:', updatedProduct.name);
        return updatedProduct;
      } catch (error) {
        console.error('ProductService: Error updating product:', error);
        throw error;
      }
    })();
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const products = await this.getAllProducts();
      const filteredProducts = products.filter(product => 
        product.id !== parseInt(id) && product.id !== id
      );

      if (products.length === filteredProducts.length) {
        throw new Error('Product not found');
      }

      // Try to delete from Firebase first
      try {
        if (firestoreService.isAvailable()) {
          await firestoreService.deleteProduct(id);
          console.log('ProductService: Product deleted from Firebase, ID:', id);
        }
      } catch (firebaseError) {
        console.warn('ProductService: Firebase delete failed, using localStorage only:', firebaseError);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
      console.log('ProductService: Product deleted successfully, ID:', id);
      return true;
    } catch (error) {
      console.error('ProductService: Error deleting product:', error);
      throw error;
    }
  }

  // Update product order (for custom arrangement)
  static async updateProductOrder(productId, newOrder) {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex(p => p.id === parseInt(productId));
      
      if (productIndex === -1) {
        throw new Error('Product not found');
      }

      products[productIndex].order = newOrder;
      products[productIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      console.log(`ProductService: Product order updated - ID: ${productId}, New Order: ${newOrder}`);
      return products[productIndex];
    } catch (error) {
      console.error('ProductService: Error updating product order:', error);
      throw error;
    }
  }

  // Toggle featured status
    static async toggleFeatured(productId) {
      try {
        let products = await this.getAllProducts();
        const productIndex = products.findIndex(p => p.id === parseInt(productId));
        if (productIndex === -1) {
          throw new Error('Product not found');
        }
        products[productIndex].featured = !products[productIndex].featured;
        products[productIndex].updatedAt = new Date().toISOString();
        // Try to update in Firebase first
        try {
          if (firestoreService.isAvailable()) {
            await firestoreService.updateProduct(products[productIndex].id, products[productIndex]);
            console.log(`ProductService: Featured status toggled in Firebase - ID: ${productId}, Featured: ${products[productIndex].featured}`);
          }
        } catch (firebaseError) {
          console.warn('ProductService: Firebase toggleFeatured failed, using localStorage only:', firebaseError);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
        console.log(`ProductService: Featured status toggled - ID: ${productId}, Featured: ${products[productIndex].featured}`);
        return products[productIndex];
      } catch (error) {
        console.error('ProductService: Error toggling featured status:', error);
        throw error;
      }
    }

  // Get product categories
  static async getCategories() {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products.map(product => product.category))];
      return categories.length > 0 ? categories : ['Arduino Kits', 'Advanced Kits', 'AI Kits', 'Accessories'];
    } catch (error) {
      console.error('ProductService: Error loading categories:', error);
      return ['Arduino Kits', 'Advanced Kits', 'AI Kits', 'Accessories'];
    }
  }

  // Validate product data
  static validateProductData(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters');
    }
    
    if (!productData.price || parseFloat(productData.price) <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!productData.description || productData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!productData.stock || parseInt(productData.stock) < 0) {
      errors.push('Stock must be 0 or greater');
    }

    return errors;
  }

  // Clear all products from Firebase
  static async clearFirebaseProducts() {
    if (!firestoreService.isAvailable()) return;
    try {
      const products = await firestoreService.getAllProducts();
      for (const product of products) {
        await firestoreService.deleteProduct(product.id);
      }
      console.log('✅ ProductService: Cleared all products from Firebase');
    } catch (error) {
      console.error('⚠️ ProductService: Failed to clear Firebase products:', error);
    }
  }

  // Reset to default products (for testing/debugging)
  static async resetToDefault() {
    try {
      const defaultProducts = this.getDefaultProducts();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultProducts));
      // Clear Firebase before syncing defaults
      if (firestoreService.isAvailable()) {
        await this.clearFirebaseProducts();
        await this.syncDefaultsToFirebase(defaultProducts);
      }
      console.log('ProductService: Reset to default products completed');
      return defaultProducts;
    } catch (error) {
      console.error('ProductService: Error resetting to defaults:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      let product = null;
      if (firestoreService.isAvailable()) {
        const products = await firestoreService.getAllProducts();
        product = products.find(p => p.id === id || p.id === parseInt(id));
      } else {
        const products = await this.getAllProducts();
        product = products.find(p => p.id === id || p.id === parseInt(id));
      }
      if (!product) {
        throw new Error(`Product not found with ID: ${id}`);
      }
      return product;
    } catch (error) {
      console.error('ProductService: Error getting product by ID:', error);
      throw error;
    }
  }
}

export default ProductService;