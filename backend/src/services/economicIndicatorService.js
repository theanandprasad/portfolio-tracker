const axios = require('axios');
const API_KEY = process.env.FINANCIAL_API_KEY;

async function getEconomicIndicators() {
  try {
    const gdpResponse = await axios.get(`https://www.alphavantage.co/query?function=REAL_GDP&interval=annual&apikey=${API_KEY}`);
    const inflationResponse = await axios.get(`https://www.alphavantage.co/query?function=INFLATION&apikey=${API_KEY}`);
    const unemploymentResponse = await axios.get(`https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${API_KEY}`);

    const gdp = gdpResponse.data.data[0].value;
    const inflation = inflationResponse.data.data[0].value;
    const unemployment = unemploymentResponse.data.data[0].value;

    return { gdp, inflation, unemployment };
  } catch (error) {
    console.error('Error fetching economic indicators:', error);
    return { gdp: 'N/A', inflation: 'N/A', unemployment: 'N/A' };
  }
}

module.exports = { getEconomicIndicators };