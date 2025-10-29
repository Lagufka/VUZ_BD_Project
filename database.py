import psycopg
from psycopg import Connection, Cursor
from psycopg.rows import dict_row, class_row
from contextlib import contextmanager
from typing import Iterator, Any, Optional

import psycopg2.pool
import psycopg_pool

from config import DatabaseConfig, db_config


class DatabaseManager(object):
    def __init__(self, config: DatabaseConfig):
        self.config = config

    
    def get_connection(self) -> Connection:
        return psycopg.connect(self.config.dsn)
    
    @contextmanager
    def get_cursor(self, row_factory=dict_row) -> Iterator[Cursor]:
        conn = self.get_connection()
        try:
            with conn:
                with conn.cursor(row_factory=row_factory) as cur:
                    yield cur
        except Exception as e:
            raise e
