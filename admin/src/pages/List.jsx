import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../Services/api';
import { currency } from '../App';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/get-all-products");
     
      if (response.data) {
        //  console.log("Response data:", response.data.products);
        setList(response.data || []);
        setFilteredList(response.data || []);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Error fetching products");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await api.delete(`/products/delete-product/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const filtered = list.filter((item) =>
      item.productname.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [search, list]);

  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ml-10">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <p className="mt-2 font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{
                      console.log("Item image URL:", item.productname)}
                        <img src={item.imageURL} alt={item.productname} className="h-16 w-16 object-cover rounded-md shadow" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.productname}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold">{currency}{item.price}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeProduct(item._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete Product"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border text-sm rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default List;
