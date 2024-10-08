const axios = require('axios');
const API_KEY = process.env.FINANCIAL_API_KEY;

async function getMarketSentiment() {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}`);
    const data = response.data;

    if (!data || !data.feed || !Array.isArray(data.feed)) {
      console.error('Unexpected data structure from API:', data);
      return 'Neutral'; // Default to neutral if we can't get sentiment
    }

    const sentiments = data.feed.map(item => item.overall_sentiment_score).filter(score => score !== undefined);

    if (sentiments.length === 0) {
      console.error('No valid sentiment scores found');
      return 'Neutral';
    }

    const averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    if (averageSentiment > 0.2) return 'Positive';
    if (averageSentiment < -0.2) return 'Negative';
    return 'Neutral';
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    return 'Neutral'; // Default to neutral in case of error
  }
}

async function getSectorPerformance() {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`);
    return response.data['Rank A: Real-Time Performance'];
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    return {};
  }
}

module.exports = { getMarketSentiment, getSectorPerformance };