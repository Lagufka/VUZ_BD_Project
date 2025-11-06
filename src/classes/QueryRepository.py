from typing import LiteralString, Optional, List, Any, Dict, Union
import re


class QueryRepository:
    """
    Безопасный репозиторий для генерации SQL-запросов с параметризацией
    """

    

    
    @staticmethod
    def select(
        table: str,
        columns: Union[str, List[str]] = "*",
        where: Optional[Dict[str, Any]] = None,
        order_by: Optional[Union[str, List[str]]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        distinct: bool = False
    ) -> tuple[LiteralString, List[Any]]:
        """
        Генерация SELECT запроса с параметрами
        
        Returns:
            tuple: (query, parameters) - запрос и список параметров
        """
        params: List[Any] = []
        
        # Валидация идентификаторов
        table_safe = QueryRepository._validate_identifier(table)
        
        # Обработка колонок
        if isinstance(columns, list):
            columns_safe = [QueryRepository._validate_identifier(col) for col in columns]
            columns_str = ", ".join(columns_safe)
        else:
            if columns != "*":
                columns_str = QueryRepository._validate_identifier(columns)
            else:
                columns_str = columns
        
        # Базовый запрос
        distinct_str = "DISTINCT " if distinct else ""
        query = f'SELECT {distinct_str}{columns_str} FROM "{table_safe}"'
        
        # Добавление условий WHERE с параметрами
        if where:
            where_conditions = []
            for key, value in where.items():
                key_safe = QueryRepository._validate_identifier(key)
                if value is None:
                    where_conditions.append(f'"{key_safe}" IS NULL')
                else:
                    param_index = len(params) + 1
                    where_conditions.append(f'"{key_safe}" = ${param_index}')
                    params.append(value)
            
            query += f" WHERE {' AND '.join(where_conditions)}"
        
        # Добавление сортировки (только безопасные идентификаторы)
        if order_by:
            if isinstance(order_by, list):
                order_by_safe = [QueryRepository._validate_order_clause(clause) for clause in order_by]
                order_by_str = ", ".join(order_by_safe)
            else:
                order_by_str = QueryRepository._validate_order_clause(order_by)
            query += f" ORDER BY {order_by_str}"
        
        # Добавление LIMIT и OFFSET
        if limit is not None:
            if not isinstance(limit, int) or limit < 0:
                raise ValueError("Limit must be a non-negative integer")
            query += f" LIMIT {limit}"
        
        if offset is not None:
            if not isinstance(offset, int) or offset < 0:
                raise ValueError("Offset must be a non-negative integer")
            query += f" OFFSET {offset}"
        
        return query, params  # type: ignore
    
    @staticmethod
    def insert(
        table: str,
        data: Dict[str, Any],
        returning: Optional[Union[str, List[str]]] = None
    ) -> tuple[LiteralString, List[Any]]:
        """
        Генерация INSERT запроса с параметрами
        """
        if not data:
            raise ValueError("Data cannot be empty for INSERT")
        
        params: List[Any] = []
        table_safe = QueryRepository._validate_identifier(table)
        
        columns_safe = [QueryRepository._validate_identifier(key) for key in data.keys()]
        columns_str = ", ".join(f'"{col}"' for col in columns_safe)
        
        # Параметризованные значения
        value_placeholders = []
        for value in data.values():
            param_index = len(params) + 1
            value_placeholders.append(f"${param_index}")
            params.append(value)
        
        values_str = ", ".join(value_placeholders)
        
        query = f'INSERT INTO "{table_safe}" ({columns_str}) VALUES ({values_str})'
        
        # Добавление RETURNING
        if returning:
            if isinstance(returning, list):
                returning_safe = [QueryRepository._validate_identifier(col) for col in returning]
                returning_str = ", ".join(f'"{col}"' for col in returning_safe)
            else:
                returning_safe = QueryRepository._validate_identifier(returning)
                returning_str = f'"{returning_safe}"'
            query += f" RETURNING {returning_str}"
        
        return query, params  # type: ignore
    
    
    @staticmethod
    def _validate_identifier(identifier: str) -> str:
        """
        Строгая валидация идентификаторов
        """
        # Разрешаем только буквы, цифры и подчеркивания
        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', identifier):
            raise ValueError(f"Potential SQL injection detected in identifier: {identifier}")
        return identifier
    
    @staticmethod
    def _validate_order_clause(clause: str) -> str:
        """
        Валидация ORDER BY выражений
        """
        # Разрешаем только безопасные идентификаторы и направления сортировки
        parts = clause.split()
        if len(parts) > 2:
            raise ValueError(f"Invalid ORDER BY clause: {clause}")
        
        column = QueryRepository._validate_identifier(parts[0])
        
        if len(parts) == 2:
            direction = parts[1].upper()
            if direction not in ('ASC', 'DESC'):
                raise ValueError(f"Invalid sort direction: {direction}")
            return f"{column} {direction}"
        
        return column

    
