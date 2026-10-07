import os
from dotenv import load_dotenv
from fastapi import APIRouter

from backend.database.DatabaseHandler import DatabaseHandler

load_dotenv()

database_handler = DatabaseHandler(
    db_name=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

router = APIRouter()

@router.get("/")
def read_root():
    return {"Hello": "World"}


@router.get("/index_data")
def read_index_data(index_name: str):
    return database_handler.get_index_data(index_name)


@router.get("/ma")
def read_moving_average(index_name: str, ma_window: int):
    return database_handler.get_data(index_name, ma_window)

@router.get("/ma200")
def read_ma200_data(index_name: str, ma_window: int):
    return database_handler.get_ma200_data(index_name, ma_window)