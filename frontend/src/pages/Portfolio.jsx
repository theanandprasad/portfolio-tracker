import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getInvestments, addInvestment, updateInvestment, deleteInvestment } from '../services/portfolioService';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Portfolio = () => {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    name: '',
    type: 'Stock',
    purchaseDate: '',
    quantity: '',
    purchasePrice: '',
  });
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await getInvestments();
      setInvestments(data);
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvestment({ ...newInvestment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingInvestment) {
        await updateInvestment(editingInvestment.id, newInvestment);
        showSuccessToast('Investment updated successfully!');
      } else {
        await addInvestment(newInvestment);
        showSuccessToast('Investment added successfully!');
      }
      setNewInvestment({
        symbol: '',
        name: '',
        type: 'Stock',
        purchaseDate: '',
        quantity: '',
        purchasePrice: '',
      });
      setEditingInvestment(null);
      fetchInvestments();
    } catch (error) {
      showErrorToast(error.message || 'Failed to add/update investment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setNewInvestment({
      symbol: investment.symbol,
      name: investment.name,
      type: investment.type,
      purchaseDate: investment.purchaseDate,
      quantity: investment.quantity,
      purchasePrice: investment.purchasePrice,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      try {
        setLoading(true);
        await deleteInvestment(id);
        showSuccessToast('Investment deleted successfully!');
        fetchInvestments();
      } catch (error) {
        showErrorToast(error.message || 'Failed to delete investment');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="symbol"
              value={newInvestment.symbol}
              onChange={handleInputChange}
              placeholder="Symbol"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="name"
              value={newInvestment.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="type"
              value={newInvestment.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Stock">Stock</option>
              <option value="Mutual Fund">Mutual Fund</option>
            </select>
            <input
              type="date"
              name="purchaseDate"
              value={newInvestment.purchaseDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="quantity"
              value={newInvestment.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="purchasePrice"
              value={newInvestment.purchasePrice}
              onChange={handleInputChange}
              placeholder="Purchase Price"
              className="w-full p-2 border rounded"
              required
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={loading}>
              {loading ? 'Processing...' : (editingInvestment ? 'Update Investment' : 'Add Investment')}
            </button>
            {editingInvestment && (
              <button
                type="button"
                onClick={() => {
                  setEditingInvestment(null);
                  setNewInvestment({
                    symbol: '',
                    name: '',
                    type: 'Stock',
                    purchaseDate: '',
                    quantity: '',
                    purchasePrice: '',
                  });
                }}
                className="w-full p-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investments.map((investment) => (
              <div key={investment.id} className="border p-4 rounded">
                <h3 className="font-bold">{investment.name} ({investment.symbol})</h3>
                <p>Type: {investment.type}</p>
                <p>Quantity: {investment.quantity}</p>
                <p>Purchase Price: ${investment.purchasePrice}</p>
                <p>Purchase Date: {new Date(investment.purchaseDate).toLocaleDateString()}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(investment)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(investment.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;