import React, { useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/analyticsService';
import { showErrorToast } from '../utils/toast';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching AI recommendations...');
      const data = await getAIRecommendations();
      console.log('AI recommendations received:', data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error in fetchRecommendations:', error);
      setError('Failed to fetch AI recommendations. Please try again later.');
      showErrorToast('Failed to fetch AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading AI recommendations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!recommendations) {
    console.log('No recommendations available');
    return <div className="text-center">No recommendations available.</div>;
  }

  console.log('Rendering AI recommendations:', recommendations);

  const formatRecommendations = (recs) => {
    if (typeof recs === 'string') {
      return (
        <div className="whitespace-pre-wrap">
          {recs.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      );
    }

    return (
      <div>
        {recs.marketAnalysis && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Market Analysis:</h4>
            <p>{recs.marketAnalysis}</p>
          </div>
        )}
        {recs.specificRecommendations && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Specific Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {recs.specificRecommendations.map((rec, index) => (
                <li key={index}>
                  <span className="font-medium">{rec.action} {rec.symbol}:</span> {rec.explanation}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recs.generalAdvice && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">General Advice:</h4>
            <p>{recs.generalAdvice}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">AI Investment Recommendations</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {formatRecommendations(recommendations)}
      </div>
    </div>
  );
};

export default AIRecommendations;