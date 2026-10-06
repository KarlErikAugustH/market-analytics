import yfinance as yf
import pandas as pd

class DataClient:
    def __init__(self, tickers):
        self.tickers = tickers



    def get_data(self, start_date, end_date):
        
        data_dict = {}
        for ticker in self.tickers:
            data_dict[ticker] = yf.download(ticker, start=start_date, end=end_date)
            
        
        return data_dict





    def print_data(self, data_dict):
        for ticker, data in data_dict.items():
            print(f"Data for {ticker}:")
            print(data)


    def count_above_ma(self, data_dict, window):
        count = 0
        for ticker, data in data_dict.items():
            if not data.empty and len(data) >= window:
                close = data["Close"].squeeze()
                ma = close.rolling(window=window).mean()
                
                if close.iloc[-1] > ma.iloc[-1]:
                    count += 1
        return count

        

    def calculate_moving_average(self, data_dict, window):
        signals = {}

        for ticker, data in data_dict.items():
            if data.empty or len(data) < window:
                continue

            close = data["Close"].squeeze()
            ma = close.rolling(window=window).mean()

            signals[ticker] = close > ma

        signal_df = pd.DataFrame(signals)

        result = pd.DataFrame(index=signal_df.index)

        result["count"] = signal_df.sum(axis=1)
        result["total"] = signal_df.notna().sum(axis=1)
        result["percentage"] = (
            result["count"] / result["total"] * 100
        )

        return result
            
