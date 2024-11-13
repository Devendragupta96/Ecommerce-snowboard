import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import shoppingCart from './assets/shoppingCart.png';
import './App.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Initial loading state to false
  const [sortOrder, setSortOrder] = useState('high-to-low');

  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://run.mocky.io/v3/92348b3d-54f7-4dc5-8688-ec7d855b6cce?mocky-delay=500ms');
      const fetchedProducts = response.data.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: parseFloat(item.product.variants[0].price),
        image: item.product.images[0]?.src,
        description: item.product.images[0]?.alt || 'No description available',
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    const sortedProducts = [...products].sort((a, b) => 
      event.target.value === 'high-to-low' 
        ? b.price - a.price 
        : a.price - b.price
    );
    setProducts(sortedProducts);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>All Collection</h1>
        <div className="sort-container">
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="high-to-low">Price, High to Low</option>
            <option value="low-to-high">Price, Low to High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="load-container">
          <button className="load compress"></button>
        </div>
      ) : (
        products.length === 0 ? (
          <div className="load-container">
            <button className="load" onClick={fetchProducts}>Load Products</button>
          </div>
        ) : (
          <motion.div
            className="product-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img src={product.image} alt={product.title} />
                <h4>{product.title}</h4>
                <p>Rs. {product.price.toFixed(2)}</p>
                <button><img src={shoppingCart} alt="cart" />ADD TO CART</button>
              </div>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
};

export default App;
