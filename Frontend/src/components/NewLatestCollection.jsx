import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Leaf, Egg, ChefHat, Award, Sparkles, Clock, Check } from 'lucide-react';
import PorductItem from './ProductItem';

const PremiumEggCollection = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [eggProducts, setEggProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // In a real app, you would fetch egg products from your API
    setEggProducts(products.slice(0, 10));
  }, [products]);

  const categories = ['All', 'Organic', 'Free-Range', 'Specialty', 'Heirloom'];

  const filterByCategory = (category) => {
    setActiveCategory(category);
    // In a real app, you would filter products here
  };

  // Egg types for demonstration - updated based on brochure
  const eggTypes = [
    'Organic Brown', 'Free-Range White', 'Omega-3 Enriched', 'Farm Fresh',
    'Pasture-Raised', 'Vitamin B12 Rich', 'Selenium Enriched', 'A&D Enriched',
    'Calcium Fortified', 'Golden Yolk'
  ];
  
  // Farm sources for demonstration - based on brochure
  const farmSources = [
    'Nature Hatch Organic', 'Heritage Hens', 'Green Valley Poultry', 'Free Range PvT. Ltd',
    'Wholesome & Fresh Farm', 'Golden Yolk Ranch', 'Nutritional Value Farm', 'Farm Fresh & Nutritious',
    'Feather & Nest', 'Nature Hatch Family Farm'
  ];

  // Benefits from brochure
  const eggBenefits = [
    ['Rich in protein', 'Contains all 9 essential amino acids', 'Higher omega-3 content'],
    ['Excellent source of vitamins', 'Rich in selenium', 'Supports eye health'],
    ['Vitamin B12 for energy', 'Contains zinc & iron', 'Supports immunity'],
    ['Rich in antioxidants', 'Selenium enriched', 'Essential for cell function'],
    ['Supports brain health', 'Fresh daily', 'Nutritional powerhouse'],
    ['Riboflavin for energy', 'Contains vitamin A', 'Perfect protein balance'],
    ['Source of vitamin D', 'Supports bone health', 'Fresh from the farm'],
    ['Essential nutrients', 'Locally sourced', 'From happy hens'],
    ['Zero antibiotics', 'Humane farming', 'Environment-friendly'],
    ['Rich flavor', 'Nutritional benefits', 'Sustainable farming']
  ];

  // Updated egg labels based on brochure
  const eggLabels = [
    { name: 'ORGANIC', class: 'from-green-600 to-green-500' },
    { name: 'FREE-RANGE', class: 'from-amber-500 to-yellow-500' },
    { name: 'OMEGA-3', class: 'from-blue-500 to-teal-500' },
    { name: 'VITAMIN RICH', class: 'from-purple-500 to-pink-500' },
    { name: 'FRESH 48HR', class: 'from-green-500 to-teal-400' }
  ];


  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background Elements - using green from brochure */}
      <div className="absolute inset-0 bg-white z-0"></div>
      {/* gradient-to-br from-green-800 via-green-700 to-green-600 */}
      <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-green-500 filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-yellow-400 filter blur-3xl opacity-20 animate-pulse"></div>
      
      {/* Farm illustration as SVG background element */}
      <div className="absolute opacity-5 right-0 top-0 w-full h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M10,30 Q30,5 50,30 T90,30 L90,90 L10,90 Z" fill="white" />
        </svg>
      </div>
      
      <div className="container relative mx-auto px-4 z-10">
        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 right-8 w-20 h-20 md:w-24 md:h-24"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-white shadow-lg flex items-center justify-center p-2">
              <div className="rounded-full border-4 border-green-600 flex items-center justify-center w-full h-full relative">
                <Egg className="text-balck w-8 h-8 absolute" />
                <div className="absolute w-full h-full rounded-full border-2 border-dashed border-green-600 animate-spin-slow" style={{ animationDuration: '15s' }}></div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full text-xs text-green-800 font-bold px-2 py-1 shadow-lg">
              CERTIFIED
            </div>
          </div>
        </motion.div>
        
        {/* Animated Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-block relative">
            <Title text1={'NATURE'} text2={'HATCH'} />
            <motion.div 
              className="absolute -top-6 -right-6 w-12 h-12 text-yellow-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-full h-full" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-2 mb-6 flex justify-center"
          >
            <div className="px-6 py-1 rounded-full border-2 border-yellow-400 text-yellow-300 flex items-center">
              <span className="uppercase tracking-wider font-bold text-lg">Organic Free Range</span>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-balck max-w-2xl mx-auto text-lg font-light"
          >
            "Twice the Omega-3's, Twice More Vitamin E, One True Beta Carotene"
          </motion.p>
        </motion.div>
        
        {/* Benefit Badges - from brochure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { icon: <Egg />, text: "The Power to Choose" },
            { icon: <Check />, text: "Local Support" },
            { icon: <Clock />, text: "Undeniable Freshness" },  
            { icon: <Award />, text: "Flavor and Color" },
            { icon: <Leaf />, text: "Nutritional Benefits" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-400 text-green-800 flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <span className="text-balck text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Category Filter Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => filterByCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category
                  ? 'bg-yellow-400 text-green-800 shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-balck hover:bg-white/20 hover:shadow-md'
              }`}
            >
              {category === 'Organic' && <Leaf className="inline w-4 h-4 mr-1" />}
              {category === 'Free-Range' && <Egg className="inline w-4 h-4 mr-1" />}
              {category === 'Specialty' && <ChefHat className="inline w-4 h-4 mr-1" />}
              {category === 'Heirloom' && <Award className="inline w-4 h-4 mr-1" />}
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product Grid with Effects - styled like Nature Hatch brochure */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {eggProducts.map((item, index) => (
           <PorductItem key={index} id={item._id} image={item.imageURL} name={item.productname} price={item.price}/>
          ))}
        </motion.div>
        
        {/* Animated CTA Button */}
        <div className="mt-16 text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center px-8 py-3 overflow-hidden text-green-900 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full font-medium shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center">
              View All Nature Hatch Eggs
              <motion.span 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-2"
              >
                →
              </motion.span>
            </span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"
              animate={{ 
                x: ['-100%', '100%'],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "linear"
              }}
              style={{ opacity: 0.6 }}
            />
          </motion.button>
        </div>
        
        {/* Farm Fresh Guarantee */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Award className="text-yellow-400 w-5 h-5 mr-2" />
            <p className="italic text-balck font-medium">
              Farm Fresh Guarantee: From Our Hens to Your Table in 48 Hours
            </p>
          </div>
        </motion.div>
        
        {/* Farm Features - from brochure */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/20"
          >
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Leaf className="text-green-800 w-8 h-8" />
            </div>
            <h3 className="text-balck font-medium text-lg mb-2">Organic Feed</h3>
            <p className="text-balck text-sm">Our hens are fed with 100% organic, non-GMO feed to produce the healthiest eggs possible.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/20"
          >
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Egg className="text-green-800 w-8 h-8" />
            </div>
            <h3 className="text-balck font-medium text-lg mb-2">Free-Range Hens</h3>
            <p className="text-balck text-sm">Our hens roam green pastures daily, resulting in eggs with rich, golden yolks and exceptional flavor.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/20"
          >
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChefHat className="text-green-800 w-8 h-8" />
            </div>
            <h3 className="text-balck font-medium text-lg mb-2">Chef's Choice</h3>
            <p className="text-balck text-sm">Our specialty eggs are preferred by professional chefs for their rich taste and perfect texture.</p>
          </motion.div>
        </div>
        
        {/* Info banner from brochure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-16 bg-green-900/50 backdrop-blur-sm border border-green-700 p-6 rounded-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-green-800 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-balck font-bold text-lg">Nutritional Value</h4>
                <p className="text-balck text-sm mt-1">Vitamin B12, Vitamin D, A&E, Calcium, Phosphorus, Zinc</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="text-yellow-400 font-bold text-3xl">337</div>
                <div className="text-balck text-xs">Less Cholesterol</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-yellow-400 font-bold text-3xl">71%</div>
                <div className="text-balck text-xs">More Vitamin D</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-yellow-400 font-bold text-3xl">2x</div>
                <div className="text-balck text-xs">Omega-3s</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Brochure-style footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-16 text-center text-xs text-balck"
        >
          <p>Nature Hatch Organic Free Range • For Wholesale & Retail Contact</p>
          <p className="mt-1">Topoo, Balaji Behind Bisleri, Prachi Marg, Village Sukhrali, Gurgaon</p>
          <p className="mt-1">+91 98765 43210 • info@naturehatch.com • www.naturehatch.in</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumEggCollection;