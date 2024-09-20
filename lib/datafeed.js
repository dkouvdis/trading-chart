import { generateAggregatedData, generateResolveSymbol } from "./helpers.js";
import { subscribeToBars } from "./polygon-client.js";

const configurationData = {
  currency_codes: ["USD"],
  supported_resolutions: ["1D", "1W", "1M"],
  exchanges: [
    { value: "", name: "All Exchanges", desc: "" },
    { value: "NasdaqNM", name: "NasdaqNM", desc: "NasdaqNM" },
    { value: "NYSE", name: "NYSE", desc: "NYSE" },
  ],
  symbols_types: [
    { name: "All types", value: "" },
    { name: "Stock", value: "stock" },
    { name: "Index", value: "index" },
  ],
};

const barsCache = new Map();

export default {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("[searchSymbols]: Method call");
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension,
  ) => {
    const symbol = await generateResolveSymbol(symbolName);
    onSymbolResolvedCallback(symbol, extension);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback,
  ) => {
    const { firstDataRequest } = periodParams;

    const data = await generateAggregatedData(
      symbolInfo.ticker,
      resolution,
      periodParams,
    );

    console.log("[getBars]: Method call data", data);

    if (data.length > 0) {
      if (firstDataRequest) {
        barsCache.set(symbolInfo.ticker, data);
      }

      onHistoryCallback(data, { noData: false });
    } else {
      onHistoryCallback([], { noData: true });
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
  ) => {
    // console.log("[subscribeBars]: Method call with subscriberUID:", symbolInfo);
    // subscribeOnStreaming(
    //   symbolInfo,
    //   resolution,
    //   onRealtimeCallback,
    //   subscriberUID,
    //   onResetCacheNeededCallback,
    //   barsCache.get(symbolInfo.ticker),
    // );

    // Subscribe to the symbol for live updates
    subscribeToBars(symbolInfo.full_name);

    // Store callback for later use if needed
    barsCache.set(symbolInfo.full_name, onRealtimeCallback);
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID,
    );
  },
};
