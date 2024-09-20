import { restClient, websocketClient } from "@polygon.io/client-js";
const apiKey = "";

const polygonClient = restClient(apiKey);
const polygonWebsocket = websocketClient(apiKey).stocks();

export async function fetchTickerDetails(symbol) {
  const response = await polygonClient.reference.tickerDetails(symbol);
  return response.results;
}

export async function fetchAggregatedData({
  symbol,
  multiplier,
  timespan,
  from,
  to,
}) {
  console.log("fetchAggregatedData", symbol, multiplier, timespan, from, to);

  try {
    const response = await polygonClient.stocks.aggregates(
      symbol,
      multiplier,
      timespan,
      from,
      to,
    );
    return response.results;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

// Handle incoming messages
polygonWebsocket.onmessage = ({ data }) => {
  console.log("1".repeat(100));
  console.log("onmessage", data);
  const messages = JSON.parse(data);
  messages.forEach((message) => {
    switch (message.ev) {
      case "AM": // Aggregate message
        handleAggregateMessage(message);
        break;
      case "A": // Trade message
        handleTradeMessage(message);
        break;
      // Add more cases as needed for different event types
    }
  });
};

// Function to subscribe to aggregate bars for a specific symbol
export function subscribeToBars(symbol) {
  polygonWebsocket.send(
    JSON.stringify({
      action: "subscribe",
      params: `AM.${symbol}`, // Use "AM" for aggregates
    }),
  );
}

function handleAggregateMessage(message) {
  const bar = {
    time: message.t / 1000, // Convert milliseconds to seconds (UNIX timestamp)
    open: message.o,
    high: message.h,
    low: message.l,
    close: message.c,
    volume: message.v,
  };

  // Call TradingView's onRealtimeCallback to update the chart
  // onRealtimeCallback(bar);
}
