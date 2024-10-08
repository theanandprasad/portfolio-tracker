import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getPortfolioSummary } from '../services/analyticsService';
import { getRecentActivities } from '../services/portfolioService';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const summaryData = await getPortfolioSummary();
      const activitiesData = await getRecentActivities();
      setSummary(summaryData);
      setRecentActivities(activitiesData);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again later.');
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

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Total Value</h2>
              <p className="text-3xl font-bold text-green-600">${summary.totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Total Profit/Loss</h2>
              <p className={`text-3xl font-bold ${summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${summary.totalProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Profit Percentage</h2>
              <p className={`text-3xl font-bold ${summary.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.profitPercentage.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Total Investments</h2>
              <p className="text-3xl font-bold text-blue-600">{summary.investments.length}</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
            <p>No investments found. Add some investments to see your portfolio summary.</p>
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
          {recentActivities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent activities.</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/portfolio" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center">
            View Full Portfolio
          </Link>
          <Link to="/analytics" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center">
            View Analytics
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;