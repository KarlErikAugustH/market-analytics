import yfinance as yf


class Index:
    def __init__(self, index_name: str): #The ticker of index
        self.index_name = index_name

    def get_index_data(self, start_date, end_date):
        data_dict = {}

        index_data = yf.download(self.index_name, start=start_date, end=end_date)
        data_dict[self.index_name] = index_data["Close"].squeeze()  # Store only the 'Close' column as a Series

        return data_dict

    

