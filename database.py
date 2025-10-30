from config import db_config

import psycopg
from psycopg import Connection, Cursor
from typing import Iterator
from contextlib import contextmanager


class DatabaseManager:
    def __init__(self) -> None:
        self.config = db_config

    def get_connection(self) -> Connection:
        return psycopg.connect(self.config.dsn)

    @contextmanager
    def get_cursor(self) -> Iterator[Cursor]:
        conn = self.get_connection()

        try:
            with conn:
                with conn.cursor() as cur:
                    yield cur
        except Exception as e:
            raise e
        finally:
            conn.close()

    @contextmanager
    def transaction(self, arg):
        conn = self.get_connection()

        try:
            with conn:
                
        except Exception as e:
            raise e
        finally:
            conn.close()
        
    

