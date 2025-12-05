import os
from dotenv import find_dotenv, load_dotenv 
from typing import Annotated
from fastapi import Depends
from .DatabaseCRUD import DatabaseCRUD
from ..core import DatabaseManager
from ..core import db_config


db_service = DatabaseCRUD(DatabaseManager(db_config))
async def get_db_service() -> DatabaseCRUD:
    return db_service

DbServiceDep = Annotated[DatabaseCRUD, Depends(get_db_service)]