import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getPortfolioSummary, getAssetAllocation, getPerformanceMetrics } from '../services/analyticsService';
import AIRecommendations from '../components/AIRecommendations';
import UserPreferences from '../components/UserPreferences';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('Fetching analytics data...');

      const summaryData = await getPortfolioSummary();
      console.log('Portfolio summary:', summaryData);
      setSummary(summaryData);

      const allocationData = await getAssetAllocation();
      console.log('Asset allocation:', allocationData);
      setAllocation(allocationData);

      const performanceData = await getPerformanceMetrics();
      console.log('Performance metrics:', performanceData);
      setPerformance(performanceData);

      setError(null);
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      setError('Failed to fetch analytics data. Please try again later.');
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
        <h1 className="text-2xl font-bold mb-4">Portfolio Analytics</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        
        <UserPreferences />
        
        {/* Portfolio Summary */}
        {summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Portfolio Summary</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              <p><strong>Total Value:</strong> ${summary.totalValue.toFixed(2)}</p>
              <p><strong>Total Cost:</strong> ${summary.totalCost.toFixed(2)}</p>
              <p><strong>Total Profit:</strong> ${summary.totalProfit.toFixed(2)}</p>
              <p><strong>Profit Percentage:</strong> {summary.profitPercentage.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {/* Asset Allocation */}
        {allocation.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Asset Allocation</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              {allocation.map((item, index) => (
                <p key={index}><strong>{item.type}:</strong> {item.percentage.toFixed(2)}% (${item.value.toFixed(2)})</p>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {performance.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Performance Metrics</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              {performance.map((item, index) => (
                <div key={index} className="mb-2">
                  <p><strong>{item.name} ({item.symbol}):</strong></p>
                  <p>Sharpe Ratio: {item.sharpeRatio.toFixed(4)}</p>
                  <p>Beta: {item.beta.toFixed(4)}</p>
                  <p>Total Return: {(item.totalReturn * 100).toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
          <AIRecommendations />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
