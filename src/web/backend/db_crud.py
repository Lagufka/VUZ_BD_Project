from database.DeliveryDatabase import DeliveryDatabase
from models import *  # noqa: F403
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import date, datetime
from decimal import Decimal

logger = logging.getLogger(__name__)

class db_crud:  
    def __init__(self, database_manager):
        """Инициализация сервиса с менеджером базы данных"""
        self.db = database_manager
    
    # 1. Получить количество товаров
    def get_total_products_count(self, active_only: bool = True) -> int:
        """
        Получить общее количество товаров
        
        Args:
            active_only: Если True, считать только активные товары
            
        Returns:
            Количество товаров
        """
        try:
            query = "SELECT COUNT(*) as total_products FROM products"
            if active_only:
                query += " WHERE is_active = true"
            
            result = self.db.execute_query(query)
            return result[0]['total_products'] if result else 0
        except Exception as e:
            logger.error(f"Error getting products count: {e}")
            return 0
    
    # 2. Получить товары по страницам
    def get_products_paginated(
        self, 
        page: int = 1, 
        page_size: int = 10,
        active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары с пагинацией
        
        Args:
            page: Номер страницы (начинается с 1)
            page_size: Количество товаров на странице
            active_only: Если True, только активные товары
            
        Returns:
            Список товаров
        """
        try:
            offset = (page - 1) * page_size
            
            query = """
                SELECT p.*, s.name as seller_name, s.company_name
                FROM products p
                LEFT JOIN sellers s ON p.seller_id = s.id
            """
            
            if active_only:
                query += " WHERE p.is_active = true"
            
            query += " ORDER BY p.created_at DESC LIMIT %s OFFSET %s"
            
            return self.db.execute_query(query, (page_size, offset))
        except Exception as e:
            logger.error(f"Error getting paginated products: {e}")
            return []
    
    # 3. Получить товары по покупателю
    def get_products_by_customer(
        self, 
        customer_id: int,
        distinct: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары, которые покупал определенный покупатель
        
        Args:
            customer_id: ID покупателя
            distinct: Если True, возвращать уникальные товары
            
        Returns:
            Список товаров
        """
        try:
            query = """
                SELECT {distinct_clause} p.*, s.name as seller_name
                FROM products p
                JOIN order_items oi ON p.id = oi.product_id
                JOIN orders o ON oi.order_id = o.id
                LEFT JOIN sellers s ON p.seller_id = s.id
                WHERE o.customer_id = %s
                ORDER BY p.name
            """.format(distinct_clause="DISTINCT" if distinct else "")
            
            return self.db.execute_query(query, (customer_id,))
        except Exception as e:
            logger.error(f"Error getting products by customer: {e}")
            return []
    
    # 4. Получить товары по продавцу
    def get_products_by_seller(
        self, 
        seller_id: int,
        active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары определенного продавца
        
        Args:
            seller_id: ID продавца
            active_only: Если True, только активные товары
            
        Returns:
            Список товаров продавца
        """
        try:
            query = "SELECT * FROM products WHERE seller_id = %s"
            params = [seller_id]
            
            if active_only:
                query += " AND is_active = true"
            
            query += " ORDER BY created_at DESC"
            
            return self.db.execute_query(query, tuple(params))
        except Exception as e:
            logger.error(f"Error getting products by seller: {e}")
            return []
    
    # 5. Получить товар по ID
    def get_product_by_id(self, product_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить информацию о товаре по ID
        
        Args:
            product_id: ID товара
            
        Returns:
            Информация о товаре или None если не найден
        """
        try:
            query = """
                SELECT p.*, s.name as seller_name, s.company_name
                FROM products p
                LEFT JOIN sellers s ON p.seller_id = s.id
                WHERE p.id = %s
            """
            
            result = self.db.execute_query(query, (product_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting product by id: {e}")
            return None
    
    # 6. Получить покупателя по номеру телефона
    def get_customer_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """
        Найти покупателя по номеру телефона
        
        Args:
            phone: Номер телефона
            
        Returns:
            Информация о покупателе или None
        """
        try:
            query = """
                SELECT c.*, u.id as user_id, u.phone, u.role, u.created_at as user_created_at
                FROM customers c
                JOIN users u ON c.user_id = u.id
                WHERE u.phone = %s AND u.role = 'customer'
            """
            
            result = self.db.execute_query(query, (phone,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting customer by phone: {e}")
            return None
    
    # 7. Аутентификация покупателя
    def authenticate_customer(
        self, 
        phone: str, 
        password_hash: str
    ) -> Optional[Dict[str, Any]]:
        """
        Аутентификация покупателя по номеру телефона и хешу пароля
        
        Args:
            phone: Номер телефона
            password_hash: Хеш пароля
            
        Returns:
            Информация о покупателе или None если аутентификация не удалась
        """
        try:
            query = """
                SELECT c.*, u.id as user_id, u.phone, u.role, u.created_at
                FROM customers c
                JOIN users u ON c.user_id = u.id
                WHERE u.phone = %s 
                AND u.password_hash = %s
                AND u.role = 'customer'
            """
            
            result = self.db.execute_query(query, (phone, password_hash))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error authenticating customer: {e}")
            return None
    
    # 8. Получить продавца по номеру телефона
    def get_seller_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """
        Найти продавца по номеру телефона
        
        Args:
            phone: Номер телефона
            
        Returns:
            Информация о продавце или None
        """
        try:
            query = """
                SELECT s.*, u.id as user_id, u.phone, u.role, u.created_at as user_created_at
                FROM sellers s
                JOIN users u ON s.user_id = u.id
                WHERE u.phone = %s AND u.role = 'seller'
            """
            
            result = self.db.execute_query(query, (phone,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting seller by phone: {e}")
            return None
    
    # 9. Аутентификация продавца
    def authenticate_seller(
        self, 
        phone: str, 
        password_hash: str
    ) -> Optional[Dict[str, Any]]:
        """
        Аутентификация продавца по номеру телефона и хешу пароля
        
        Args:
            phone: Номер телефона
            password_hash: Хеш пароля
            
        Returns:
            Информация о продавце или None если аутентификация не удалась
        """
        try:
            query = """
                SELECT s.*, u.id as user_id, u.phone, u.role, u.created_at
                FROM sellers s
                JOIN users u ON s.user_id = u.id
                WHERE u.phone = %s 
                AND u.password_hash = %s
                AND u.role = 'seller'
            """
            
            result = self.db.execute_query(query, (phone, password_hash))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error authenticating seller: {e}")
            return None
    
    # 10. Регистрация пользователя (покупателя)
    def register_customer(
        self,
        phone: str,
        password_hash: str,
        name: str,
        email: Optional[str] = None,
        address: Optional[str] = None,
        birth_date: Optional[date] = None
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация нового покупателя
        
        Args:
            phone: Номер телефона
            password_hash: Хеш пароля
            name: Имя покупателя
            email: Email (опционально)
            address: Адрес (опционально)
            birth_date: Дата рождения (опционально)
            
        Returns:
            Кортеж (успех, ID пользователя, сообщение об ошибке)
        """
        try:
            # Проверяем, существует ли пользователь с таким телефоном
            existing = self.get_customer_by_phone(phone)
            if existing:
                return False, None, "Пользователь с таким телефоном уже существует"
            
            # Выполняем регистрацию в транзакции
            query1 = """
                INSERT INTO users (phone, password_hash, role) 
                VALUES (%s, %s, 'customer')
                RETURNING id
            """
            
            query2 = """
                INSERT INTO customers (user_id, name, email, address, birth_date)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """
            
            # Начинаем транзакцию
            self.db.begin_transaction()
            
            try:
                # Создаем пользователя
                user_result = self.db.execute_query(query1, (phone, password_hash))
                if not user_result:
                    raise Exception("Failed to create user")
                
                user_id = user_result[0]['id']
                
                # Создаем покупателя
                customer_result = self.db.execute_query(
                    query2, 
                    (user_id, name, email, address, birth_date)
                )
                
                if not customer_result:
                    raise Exception("Failed to create customer")
                
                self.db.commit_transaction()
                return True, user_id, "Регистрация успешна"
                
            except Exception as e:
                self.db.rollback_transaction()
                raise e
                
        except Exception as e:
            logger.error(f"Error registering customer: {e}")
            return False, None, f"Ошибка регистрации: {str(e)}"
    
    # 11. Регистрация продавца
    def register_seller(
        self,
        phone: str,
        password_hash: str,
        name: str,
        email: Optional[str] = None,
        company_name: Optional[str] = None,
        inn: Optional[str] = None
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация нового продавца
        
        Args:
            phone: Номер телефона
            password_hash: Хеш пароля
            name: Имя продавца
            email: Email (опционально)
            company_name: Название компании (опционально)
            inn: ИНН (опционально)
            
        Returns:
            Кортеж (успех, ID пользователя, сообщение об ошибке)
        """
        try:
            # Проверяем, существует ли продавец с таким телефоном
            existing = self.get_seller_by_phone(phone)
            if existing:
                return False, None, "Продавец с таким телефоном уже существует"
            
            # Выполняем регистрацию в транзакции
            query1 = """
                INSERT INTO users (phone, password_hash, role) 
                VALUES (%s, %s, 'seller')
                RETURNING id
            """
            
            query2 = """
                INSERT INTO sellers (user_id, name, email, company_name, inn)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """
            
            # Начинаем транзакцию
            self.db.begin_transaction()
            
            try:
                # Создаем пользователя
                user_result = self.db.execute_query(query1, (phone, password_hash))
                if not user_result:
                    raise Exception("Failed to create user")
                
                user_id = user_result[0]['id']
                
                # Создаем продавца
                seller_result = self.db.execute_query(
                    query2, 
                    (user_id, name, email, company_name, inn)
                )
                
                if not seller_result:
                    raise Exception("Failed to create seller")
                
                self.db.commit_transaction()
                return True, user_id, "Регистрация продавца успешна"
                
            except Exception as e:
                self.db.rollback_transaction()
                raise e
                
        except Exception as e:
            logger.error(f"Error registering seller: {e}")
            return False, None, f"Ошибка регистрации продавца: {str(e)}"
    
    # 12. Удаление пользователя (покупателя)
    def delete_customer(self, customer_id: int) -> Tuple[bool, str]:
        """
        Удаление покупателя по ID
        
        Args:
            customer_id: ID покупателя
            
        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            # Получаем user_id покупателя
            query_get_user = "SELECT user_id FROM customers WHERE id = %s"
            result = self.db.execute_query(query_get_user, (customer_id,))
            
            if not result:
                return False, "Покупатель не найден"
            
            user_id = result[0]['user_id']
            
            # Удаляем пользователя (каскадно удалится покупатель)
            query_delete = """
                DELETE FROM users 
                WHERE id = %s AND role = 'customer'
            """
            
            rows_affected = self.db.execute_update(query_delete, (user_id,))
            
            if rows_affected > 0:
                return True, "Покупатель успешно удален"
            else:
                return False, "Не удалось удалить покупателя"
                
        except Exception as e:
            logger.error(f"Error deleting customer: {e}")
            return False, f"Ошибка удаления: {str(e)}"
    
    # 13. Удаление продавца
    def delete_seller(
        self, 
        seller_id: int,
        check_dependencies: bool = True
    ) -> Tuple[bool, str]:
        """
        Удаление продавца по ID
        
        Args:
            seller_id: ID продавца
            check_dependencies: Проверять наличие связанных товаров и точек
            
        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            if check_dependencies:
                # Проверяем наличие товаров продавца
                products_count = len(self.get_products_by_seller(seller_id, active_only=False))
                
                # Проверяем наличие точек выдачи
                points_query = "SELECT COUNT(*) FROM pickup_points WHERE seller_id = %s"
                points_result = self.db.execute_query(points_query, (seller_id,))
                points_count = points_result[0]['count'] if points_result else 0
                
                if products_count > 0 or points_count > 0:
                    return False, "У продавца есть связанные товары или точки выдачи"
            
            # Получаем user_id продавца
            query_get_user = "SELECT user_id FROM sellers WHERE id = %s"
            result = self.db.execute_query(query_get_user, (seller_id,))
            
            if not result:
                return False, "Продавец не найден"
            
            user_id = result[0]['user_id']
            
            # Удаляем пользователя (каскадно удалится продавец)
            query_delete = """
                DELETE FROM users 
                WHERE id = %s AND role = 'seller'
            """
            
            rows_affected = self.db.execute_update(query_delete, (user_id,))
            
            if rows_affected > 0:
                return True, "Продавец успешно удален"
            else:
                return False, "Не удалось удалить продавца"
                
        except Exception as e:
            logger.error(f"Error deleting seller: {e}")
            return False, f"Ошибка удаления: {str(e)}"
    
    # 14. Получить все точки по страницам
    def get_pickup_points_paginated(
        self,
        page: int = 1,
        page_size: int = 10,
        active_only: bool = True,
        seller_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Получить точки выдачи с пагинацией
        
        Args:
            page: Номер страницы (начинается с 1)
            page_size: Количество точек на странице
            active_only: Если True, только активные точки
            seller_id: Фильтр по ID продавца (опционально)
            
        Returns:
            Список точек выдачи
        """
        try:
            offset = (page - 1) * page_size
            
            query = """
                SELECT pp.*, s.name as seller_name, s.company_name
                FROM pickup_points pp
                LEFT JOIN sellers s ON pp.seller_id = s.id
            """
            
            conditions = []
            params = []
            
            if active_only:
                conditions.append("pp.is_active = true")
            
            if seller_id is not None:
                conditions.append("pp.seller_id = %s")
                params.append(seller_id)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY pp.id LIMIT %s OFFSET %s"
            params.extend([page_size, offset])
            
            return self.db.execute_query(query, tuple(params))
        except Exception as e:
            logger.error(f"Error getting paginated pickup points: {e}")
            return []
    
    # 15. Зарегистрировать точку выдачи
    def register_pickup_point(
        self,
        seller_id: int,
        name: str,
        address: str,
        phone: Optional[str] = None,
        work_hours: Optional[str] = None
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация новой точки выдачи
        
        Args:
            seller_id: ID продавца
            name: Название точки
            address: Адрес
            phone: Телефон (опционально)
            work_hours: Часы работы (опционально)
            
        Returns:
            Кортеж (успех, ID точки, сообщение)
        """
        try:
            query = """
                INSERT INTO pickup_points 
                (seller_id, name, address, phone, work_hours, is_active)
                VALUES (%s, %s, %s, %s, %s, true)
                RETURNING id
            """
            
            result = self.db.execute_query(
                query, 
                (seller_id, name, address, phone, work_hours)
            )
            
            if result:
                point_id = result[0]['id']
                return True, point_id, "Точка выдачи успешно зарегистрирована"
            else:
                return False, None, "Не удалось зарегистрировать точку выдачи"
                
        except Exception as e:
            logger.error(f"Error registering pickup point: {e}")
            return False, None, f"Ошибка регистрации: {str(e)}"
    
    # 16. Удалить точку выдачи
    def delete_pickup_point(
        self, 
        point_id: int,
        soft_delete: bool = True
    ) -> Tuple[bool, str]:
        """
        Удаление точки выдачи
        
        Args:
            point_id: ID точки выдачи
            soft_delete: Если True, деактивировать вместо удаления
            
        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            if soft_delete:
                # Деактивация точки
                query = """
                    UPDATE pickup_points 
                    SET is_active = false 
                    WHERE id = %s AND is_active = true
                """
                success_message = "Точка выдачи деактивирована"
                fail_message = "Точка выдачи не найдена или уже деактивирована"
            else:
                # Полное удаление
                query = "DELETE FROM pickup_points WHERE id = %s"
                success_message = "Точка выдачи удалена"
                fail_message = "Точка выдачи не найдена"
            
            rows_affected = self.db.execute_update(query, (point_id,))
            
            if rows_affected > 0:
                return True, success_message
            else:
                return False, fail_message
                
        except Exception as e:
            logger.error(f"Error deleting pickup point: {e}")
            return False, f"Ошибка удаления: {str(e)}"
    
    # Дополнительные полезные методы
    
    def get_customer_by_id(self, customer_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить покупателя по ID
        """
        try:
            query = """
                SELECT c.*, u.phone, u.role, u.created_at
                FROM customers c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = %s
            """
            
            result = self.db.execute_query(query, (customer_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting customer by id: {e}")
            return None
    
    def get_seller_by_id(self, seller_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить продавца по ID
        """
        try:
            query = """
                SELECT s.*, u.phone, u.role, u.created_at
                FROM sellers s
                JOIN users u ON s.user_id = u.id
                WHERE s.id = %s
            """
            
            result = self.db.execute_query(query, (seller_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting seller by id: {e}")
            return None
    
    def update_product_quantity(
        self, 
        product_id: int, 
        quantity_change: int
    ) -> bool:
        """
        Обновить количество товара
        
        Args:
            product_id: ID товара
            quantity_change: Изменение количества (может быть отрицательным)
            
        Returns:
            True если успешно
        """
        try:
            query = """
                UPDATE products 
                SET quantity = GREATEST(0, quantity + %s)
                WHERE id = %s
            """
            
            rows_affected = self.db.execute_update(
                query, 
                (quantity_change, product_id)
            )
            return rows_affected > 0
        except Exception as e:
            logger.error(f"Error updating product quantity: {e}")
            return False
    
    def search_products(
        self,
        search_term: str,
        category: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        page: int = 1,
        page_size: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Поиск товаров с фильтрами
        
        Args:
            search_term: Текст для поиска в названии и описании
            category: Категория товара (опционально)
            min_price: Минимальная цена (опционально)
            max_price: Максимальная цена (опционально)
            page: Номер страницы
            page_size: Размер страницы
            
        Returns:
            Список товаров
        """
        try:
            offset = (page - 1) * page_size
            
            query = """
                SELECT p.*, s.name as seller_name
                FROM products p
                LEFT JOIN sellers s ON p.seller_id = s.id
                WHERE p.is_active = true
                AND (p.name ILIKE %s OR p.description ILIKE %s)
            """
            
            # Используем List[Any] для параметров разных типов
            params: List[Any] = [f"%{search_term}%", f"%{search_term}%"]
            
            if category:
                query += " AND p.category = %s"
                params.append(category)
            
            if min_price is not None:
                query += " AND p.price >= %s"
                params.append(float(min_price))
            
            if max_price is not None:
                query += " AND p.price <= %s"
                params.append(float(max_price))
            
            query += " ORDER BY p.created_at DESC LIMIT %s OFFSET %s"
            # Добавляем int значения для LIMIT и OFFSET
            params.extend([page_size, offset])
            
            return self.db.execute_query(query, params)
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            return []