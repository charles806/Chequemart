import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { FaTrash, FaRegArrowAltCircleLeft, FaShoppingCart } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import ProductItem from '../../Component/ProductItem';
import { toast } from 'sonner';

const Compare = () => {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('compareItems') || '[]');
    setCompareItems(items);
    setLoading(false);
  }, []);

  const removeFromCompare = (id) => {
    const updated = compareItems.filter(item => item.id !== id);
    localStorage.setItem('compareItems', JSON.stringify(updated));
    setCompareItems(updated);
    toast.success("Removed from compare");
  };

  const clearAll = () => {
    localStorage.setItem('compareItems', '[]');
    setCompareItems([]);
    toast.success("Compare cleared");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5252]"></div>
      </div>
    );
  }

  return (
    <section className="section py-8 pb-12 bg-gray-50 min-h-screen">
      <div className="my-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#ff5252]">Home</Link>
            <FaRegArrowAltCircleLeft className="rotate-180 text-xs" />
            <span className="text-gray-800">Compare</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                Compare Products
              </h1>
              <p className="mt-1 text-gray-500">
                {compareItems.length} {compareItems.length === 1 ? 'product' : 'products'} to compare
              </p>
            </div>
            {compareItems.length > 0 && (
              <Button
                variant="text"
                startIcon={<FaTrash />}
                onClick={clearAll}
                className="text-gray-500! hover:text-[#ff5252]!"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {compareItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No products to compare
            </h2>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Add products to compare by clicking the compare icon on any product card.
            </p>
            <Button
              variant="contained"
              className="bg-linear-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]! text-white! px-8 py-2.5! rounded-lg!"
            >
              <Link to="/products" className="text-white!">
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-left font-semibold text-gray-600 w-48"></th>
                  {compareItems.map(item => (
                    <th key={item.id} className="p-4 relative">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#ff5252] hover:text-white transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-600">Image</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <img
                        src={item.image || '/src/assets/image/product1.jpg'}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-600">Name</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <Link to={`/products/${item.id}`} className="hover:text-[#ff5252] font-medium">
                        {item.name}
                      </Link>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-600">Brand</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-gray-600">
                      {item.brand || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-600">Price</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <span className="text-[#ff5252] font-bold text-lg">
                        ₦{item.price?.toLocaleString() || 0}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-600">Actions</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <Link to={`/products/${item.id}`}>
                        <Button
                          variant="contained"
                          size="small"
                          className="!bg-[#ff5252] !text-white"
                        >
                          View Details
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Compare;