import { restClient } from "@polygon.io/client-js";
import { createChart } from "lightweight-charts";

const API_KEY = ''

// Initialize Polygon client
const polygonClient = restClient(API_KEY);

// Fetch data from Polygon
async function fetchPolygonData(symbol, from, to) {
  const response = await polygonClient.stocks.aggregates(
    symbol,
    1,
    "day",
    from,
    to,
  );
  return response.results;
}

// Format data for TradingView
function formatDataForTradingView(polygonData) {
  return polygonData.map((item) => ({
    time: item.t / 1000, // Convert milliseconds to seconds
    open: item.o,
    high: item.h,
    low: item.l,
    close: item.c,
  }));
}

// Create and populate TradingView chart
function createTradingViewChart(data) {
  const appElement = document.querySelector("#lightweight-charts");
  const chart = createChart(appElement, { width: 800, height: 400 });
  const candlestickSeries = chart.addCandlestickSeries();
  candlestickSeries.setData(data);
}

// Main function to tie it all together
export async function runLightweightChart() {
  const symbol = "AAPL";
  const from = "2023-01-01";
  const to = "2023-12-31";

  const polygonData = await fetchPolygonData(symbol, from, to);
  const formattedData = formatDataForTradingView(polygonData);
  createTradingViewChart(formattedData);
}
