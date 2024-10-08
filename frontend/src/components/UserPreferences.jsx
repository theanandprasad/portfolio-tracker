import React, { useState, useEffect } from 'react';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    riskTolerance: 'moderate',
    investmentGoals: '',
    investmentHorizon: '5-10 years'
  });

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const userPreferences = await getUserPreferences();
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending preferences update:', preferences);
      await updateUserPreferences(preferences);
      showSuccessToast('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error.response?.data || error.message);
      showErrorToast(`Failed to update preferences: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Risk Tolerance</label>
          <select
            name="riskTolerance"
            value={preferences.riskTolerance}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Investment Goals</label>
          <input
            type="text"
            name="investmentGoals"
            value={preferences.investmentGoals}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Retirement, Buy a house"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Investment Horizon</label>
          <select
            name="investmentHorizon"
            value={preferences.investmentHorizon}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="0-2 years">0-2 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default UserPreferences;