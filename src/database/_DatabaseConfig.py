import os
from dataclasses import dataclass
from typing import Callable
from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv("dbenv.env")

@dataclass
class DatabaseConfig:
    host: str = os.getenv("DB_HOST", "localhost")
    port: int = int(os.getenv("DB_PORT", "5432"))
    name: str = os.getenv("DB_NAME", "delivery")
    user: str = os.getenv("DB_USER", "postgres")
    password: str = os.getenv("DB_PASSWORD", "")
    pool_min: int = 1
    pool_max: int = 10
    row_factory: Callable = dict_row

    @property
    def dsn(self) -> str:
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"



db_config = DatabaseConfig()