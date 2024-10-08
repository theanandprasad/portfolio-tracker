const axios = require('axios');
const createError = require('http-errors');
const { getOrSetCache } = require('./cacheService');

const API_KEY = process.env.FINANCIAL_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const getStockPrice = async (symbol) => {
  return getOrSetCache(`stock_price:${symbol}`, async () => {
    try {
      console.log(`Fetching stock price for ${symbol}`);
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: API_KEY
        }
      });

      const data = response.data['Global Quote'];
      if (!data || Object.keys(data).length === 0) {
        console.error(`No data found for symbol ${symbol}`);
        return null;
      }

      const result = {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        lastUpdated: data['07. latest trading day']
      };
      console.log(`Stock price fetched for ${symbol}:`, result);
      return result;
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error.message);
      return null;
    }
  });
};

const getHistoricalPrices = async (symbol, startDate, endDate) => {
  return getOrSetCache(`historical_prices:${symbol}:${startDate}:${endDate}`, async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          outputsize: 'full',
          apikey: API_KEY
        }
      });

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries || Object.keys(timeSeries).length === 0) {
        throw createError(404, `No historical data found for symbol ${symbol}`);
      }

      const filteredPrices = Object.entries(timeSeries)
        .filter(([date]) => date >= startDate && date <= endDate)
        .map(([date, values]) => ({
          date,
          price: parseFloat(values['4. close'])
        }));

      return filteredPrices;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        throw createError(429, 'API rate limit exceeded. Please try again later.');
      }
      console.error(`Error fetching historical prices for ${symbol}:`, error);
      throw error.isHttpError ? error : createError(500, 'Internal server error');
    }
  });
};

module.exports = { getStockPrice, getHistoricalPrices };