import { fetchAggregatedData, fetchTickerDetails } from "./polygon-client.js";

export const generateResolveSymbol = async (symbol) => {
  const tickerDetails = await fetchTickerDetails(symbol);

  return {
    ticker: tickerDetails.ticker,
    name: tickerDetails.name,
    description: tickerDetails.description,
    type: tickerDetails.type,
    // session: "24x7",
    // timezone: "Etc/UTC",
    exchange: tickerDetails.primary_exchange,
    minmov: 1,
    pricescale: 100,
    // has_intraday: false,
    // has_no_volume: true,
    // has_weekly_and_monthly: false,
    // supported_resolutions: ["1", "5", "30", "60", "1D", "1W"],
    // volume_precision: 2,
    // data_status: "streaming",
  };
};

export const generateAggregatedData = async (
  symbol,
  resolution,
  periodParams,
) => {
  const { from, to } = periodParams;
  const splitResolution = splitTimeFrame(resolution);
  let bars = [];

  const aggregatedData = await fetchAggregatedData({
    symbol,
    multiplier: splitResolution.multiplier,
    timespan: findTimeSpan(splitResolution.timespan),
    from: unixTimestampToDate(from),
    to: unixTimestampToDate(to),
  });

  if (aggregatedData?.length > 0) {
    aggregatedData.forEach((bar) => {
      bars.push({
        time: getTime(bar.t),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
      });
    });

    return bars;
  }

  return bars;
};

function splitTimeFrame(timeFrame) {
  const match = timeFrame.match(/^(\d+)([A-Za-z]+)$/);

  if (match) {
    return {
      multiplier: parseInt(match[1], 10),
      timespan: match[2],
    };
  }
  return null; // Return null if the format doesn't match
}

function unixTimestampToDate(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toISOString().split("T")[0]; // Adjust based on your preferred format
}

function findTimeSpan(timeSpan) {
  switch (timeSpan) {
    case "D":
      return "day";
    case "W":
      return "week";
    case "M":
      return "month";
    default:
      return "day";
  }
}

function getTime(timeStamp) {
  const timestamp = new Date(timeStamp);
  return timestamp.getTime();
}
