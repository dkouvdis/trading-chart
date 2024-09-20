const advancedChartElement = "advanced-chart";
import datafeed from "./datafeed.js";

export async function runAdvancedChart() {
  new TradingView.widget({
    container: advancedChartElement,
    locale: "en",
    library_path: "charting_library/",
    datafeed,
    symbol: "AAPL",
    interval: "1D",
    fullscreen: true,
    allow_symbol_change: true,
    debug: true,
  });
}
