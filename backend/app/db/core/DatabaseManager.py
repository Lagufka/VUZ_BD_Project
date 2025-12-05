from .DatabaseConfig import DatabaseConfig
from typing import Any, LiteralString, Optional
import psycopg
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

    def close(self):
        self.connection_pool.close()

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

    def execute_query(
        self, query: LiteralString, params: Optional[list] = None
    ) -> list[dict[str, Any]]:
        """Execute a SQL query with optional parameters and return all results.
        SELECT queries and other operations that return data from the database.

        Returns:
            list: A list of tuples containing all rows returned by the query. Each tuple represents one row of results.
        """
        with self._get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def execute_command(
        self, command: LiteralString, params: Optional[list] = None
    ) -> int:
        """Execute a SQL command with optional parameters and return the number of affected rows.
        INSERT, UPDATE, DELETE, and other DML commands.

        Returns:
            int: number of touched rows
        """
        with self._get_cursor() as cursor:
            cursor.execute(command, params)
            return cursor.rowcount

    def begin_transaction(self) -> None:
        """Начать транзакцию вручную"""
        self._get_connection().__enter__()

    def commit_transaction(self) -> None:
        """Завершить транзакцию с сохранением изменений"""
        conn = self._get_connection().__enter__()
        conn.commit()
        conn.__exit__(None, None, None)

    def rollback_transaction(self) -> None:
        """Откатить транзакцию"""
        conn = self._get_connection().__enter__()
        conn.rollback()
        conn.__exit__(None, None, None)

    def execute_update(
        self, query: LiteralString, params: Optional[list] = None
    ) -> int:
        """Алиас для execute_command для лучшей читаемости"""
        return self.execute_command(query, params)

    def fetch_one(
        self, query: LiteralString, params: Optional[list] = None
    ) -> Optional[dict[str, Any]]:
        """Выполнить запрос и вернуть первую строку"""
        with self._get_cursor() as cursor:
            cursor.execute(query, params)
            result = cursor.fetchone()
            return result if result else None

    def fetch_all(
        self, query: LiteralString, params: Optional[list] = None
    ) -> list[dict[str, Any]]:
        """Алиас для execute_query для лучшей читаемости"""
        return self.execute_query(query, params)

    def execute_returning_id(
        self, query: LiteralString, params: Optional[list] = None
    ) -> Optional[int]:
        """Выполнить INSERT с RETURNING id и вернуть ID новой записи"""
        with self._get_cursor() as cursor:
            cursor.execute(query, params)
            result = cursor.fetchone()
            return result['id'] if result else None

    def execute_many(
        self, query: LiteralString, params_list: list[list]
    ) -> int:
        """Выполнить один запрос с несколькими наборами параметров"""
        total_rows = 0
        with self._get_cursor() as cursor:
            for params in params_list:
                cursor.execute(query, params)
                total_rows += cursor.rowcount
        return total_rows

    def table_exists(self, table_name: str) -> bool:
        """Проверить существование таблицы"""
        query = """
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = %s
            )
        """
        result = self.fetch_one(query, [table_name])
        return result['exists'] if result else False

    def get_table_columns(self, table_name: str) -> list[str]:
        """Получить список колонок таблицы"""
        query = """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = %s 
            ORDER BY ordinal_position
        """
        results = self.fetch_all(query, [table_name])
        return [row['column_name'] for row in results] if results else []