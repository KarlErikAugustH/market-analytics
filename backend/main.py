

import os
from dotenv import load_dotenv
from data.DataClient import DataClient
from database.DatabaseHandler import DatabaseHandler

OMXS30_TICKERS = [
    "ABB.ST",
    "ADDT-B.ST",
    "ALFA.ST",
    "ASSA-B.ST",
    "AZN.ST",
    "ATCO-A.ST",
    "BOL.ST",
    "EPI-A.ST",
    "EQT.ST",
    "ERIC-B.ST",
    "ESSITY-B.ST",
    "EVO.ST",
    "HM-B.ST",
    "SHB-A.ST",
    "HEXA-B.ST",
    "INDU-C.ST",
    "INVE-B.ST",
    "LIFCO-B.ST",
    "NIBE-B.ST",
    "NDA-SE.ST",
    "SAAB-B.ST",
    "SAND.ST",
    "SCA-B.ST",
    "SEB-A.ST",
    "SKA-B.ST",
    "SKF-B.ST",
    "SWED-A.ST",
    "TEL2-B.ST",
    "TELIA.ST",
    "VOLV-B.ST",
]



if __name__ == "__main__":    
    load_dotenv()
    data_client = DataClient(OMXS30_TICKERS)
    data = data_client.get_data("2023-01-01", "")    
    result = data_client.calculate_moving_average(data, 50)

    database_handler = DatabaseHandler(
        db_name=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    database_handler.create_table()
    database_handler.save_data(result, "OMXS30", 50)

    





