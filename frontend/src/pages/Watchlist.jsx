import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistAlert } from '../services/watchlistService';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [newItem, setNewItem] = useState({ symbol: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWatchlist();
      setWatchlistItems(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch watchlist. Please try again later.');
        showErrorToast(error.message || 'Failed to fetch watchlist');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addToWatchlist(newItem);
      setNewItem({ symbol: '', name: '' });
      showSuccessToast('Item added to watchlist successfully!');
      fetchWatchlist();
    } catch (error) {
      showErrorToast(error.message || 'Failed to add item to watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setLoading(true);
      await removeFromWatchlist(id);
      showSuccessToast('Item removed from watchlist successfully!');
      fetchWatchlist();
    } catch (error) {
      showErrorToast(error.message || 'Failed to remove item from watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlert = async (id, alertData) => {
    try {
      setLoading(true);
      await updateWatchlistAlert(id, alertData);
      showSuccessToast('Alert updated successfully!');
      fetchWatchlist();
    } catch (error) {
      showErrorToast(error.message || 'Failed to update alert');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
        <form onSubmit={handleAddItem} className="mb-8">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItem.symbol}
              onChange={(e) => setNewItem({ ...newItem, symbol: e.target.value })}
              placeholder="Symbol"
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Name"
              className="flex-1 p-2 border rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <h3 className="font-bold">{item.name} ({item.symbol})</h3>
              <p>Current Price: ${item.currentPrice}</p>
              {item.alertPrice && (
                <p>Alert: {item.alertType} ${item.alertPrice}</p>
              )}
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleUpdateAlert(item.id, { alertPrice: prompt('Enter alert price:'), alertType: prompt('Enter alert type (above/below):') })}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Set Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Watchlist;