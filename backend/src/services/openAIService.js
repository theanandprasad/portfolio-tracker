const OpenAI = require('openai');
const { getMarketSentiment, getSectorPerformance } = require('./marketDataService');
const { getEconomicIndicators } = require('./economicIndicatorService');
const { getOrSetCache } = require('./cacheService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getInvestmentRecommendations(portfolio, userPreferences, watchlist) {
  try {
    const marketSentiment = await getMarketSentiment();
    const sectorPerformance = await getSectorPerformance();
    const economicIndicators = await getEconomicIndicators();

    const prompt = `Given the following investment portfolio:
${JSON.stringify(portfolio, null, 2)}

User preferences:
${JSON.stringify(userPreferences, null, 2)}

Watchlist items:
${JSON.stringify(watchlist, null, 2)}

Current market conditions:
- Market Sentiment: ${marketSentiment}
- Sector Performance: ${JSON.stringify(sectorPerformance, null, 2)}

Economic Indicators:
- GDP Growth Rate: ${economicIndicators.gdp}%
- Inflation Rate: ${economicIndicators.inflation}%
- Unemployment Rate: ${economicIndicators.unemployment}%

Provide investment recommendations. Consider the user's risk tolerance, investment goals, and investment horizon. Take into account the current market sentiment, sector performance, economic indicators, and watchlist items. Suggest whether to buy more, hold, or sell specific investments, and propose new investments if appropriate, including items from the watchlist. Consider diversification and potential risks.

For each recommendation, provide a brief explanation of the reasoning behind it, considering all the provided data points.

Format your response as follows:
1. Overall market analysis (2-3 sentences)
2. 3-5 specific recommendations, each including:
   - Action (Buy/Sell/Hold)
   - Stock symbol or investment type
   - Brief explanation (2-3 sentences)
3. General advice based on the user's risk tolerance and goals (1-2 sentences)`;

    // Create a cache key based on the prompt
    const cacheKey = `openai_recommendations:${Buffer.from(prompt).toString('base64')}`;

    return await getOrSetCache(cacheKey, async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      return response.choices[0].message.content.trim();
    });
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to get AI recommendations');
  }
}

module.exports = { getInvestmentRecommendations };