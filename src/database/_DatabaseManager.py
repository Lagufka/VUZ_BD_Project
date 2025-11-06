from database._DatabaseConfig import DatabaseConfig, db_config

import psycopg
from psycopg import sql
from typing import LiteralString, Optional
from psycopg_pool import ConnectionPool
from contextlib import contextmanager


class DatabaseManager:
    def __init__(self, config: DatabaseConfig) -> None:
        self.config = config
        self.connection_pool = ConnectionPool(
            self.config.dsn,
            min_size=self.config.pool_min,
            max_size=self.config.pool_max,
        )

    @contextmanager
    def _get_connection(self):
        with self.connection_pool.connection() as conn:
            try:
                yield conn
                conn.commit()
            except psycopg.Error as e:
                conn.rollback()
                raise e

    @contextmanager
    def _get_cursor(self):
        with self._get_connection() as conn:
            with conn.cursor(row_factory=self.config.row_factory) as cursor:
                yield cursor

    def execute_query(self, query: LiteralString, params: Optional[list] = None) -> list:
        """Execute a SQL query with optional parameters and return all results.
        SELECT queries and other operations that return data from the database.

        Returns: 
            list: A list of tuples containing all rows returned by the query. Each tuple represents one row of results.
        """
        with self._get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def execute_command(self, command: LiteralString, params: Optional[list] = None) -> int:
        """Execute a SQL command with optional parameters and return the number of affected rows.
        INSERT, UPDATE, DELETE, and other DML commands.
        
        Returns:
            int: number of touched rows
        """
        with self._get_cursor() as cursor:
            cursor.execute(command, params)
            return cursor.rowcount
