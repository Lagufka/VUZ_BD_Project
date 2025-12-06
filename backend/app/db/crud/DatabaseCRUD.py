import logging
from typing import List, Dict, Any, Optional, Tuple
from decimal import Decimal

logger = logging.getLogger(__name__)


class DatabaseCRUD:
    def __init__(self, database_manager):
        """Инициализация сервиса с менеджером базы данных"""
        self.db = database_manager

    # ========== ТОВАРЫ ==========

    def get_total_products_count(self, active_only: bool = True) -> int:
        """
        Получить общее количество товаров

        Args:
            active_only: Если True, считать только товары с остатком > 0

        Returns:
            Количество товаров
        """
        try:
            query = "SELECT COUNT(*) as total_products FROM product"
            if active_only:
                query += " WHERE remaining_amount > 0"

            result = self.db.execute_query(query)
            return result[0]["total_products"] if result else 0
        except Exception as e:
            logger.error(f"Error getting products count: {e}")
            return 0

    def get_products_paginated(
        self, page: int = 1, page_size: int = 10, active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары с пагинацией

        Args:
            page: Номер страницы (начинается с 1)
            page_size: Количество товаров на странице
            active_only: Если True, только товары с остатком > 0

        Returns:
            Список товаров
        """
        try:
            offset = (page - 1) * page_size

            query = """
                SELECT p.*, 
                       s.first_name || ' ' || s.second_name as seller_full_name,
                       s.phone_number as seller_phone
                FROM product p
                LEFT JOIN seller s ON p.seller_id = s.id
            """

            if active_only:
                query += " WHERE p.remaining_amount > 0"

            query += " ORDER BY p.id LIMIT %s OFFSET %s"

            return self.db.execute_query(query, (page_size, offset))
        except Exception as e:
            logger.error(f"Error getting paginated products: {e}")
            return []

    def get_products_by_customer(
        self, buyer_id: int, distinct: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары, которые покупал определенный покупатель

        Args:
            buyer_id: ID покупателя
            distinct: Если True, возвращать уникальные товары

        Returns:
            Список товаров
        """
        try:
            distinct_clause = "DISTINCT" if distinct else ""
            query = f"""
                SELECT {distinct_clause} p.*, 
                       s.first_name || ' ' || s.second_name as seller_full_name
                FROM product p
                JOIN parcel pc ON p.id = pc.product_id
                LEFT JOIN seller s ON p.seller_id = s.id
                WHERE pc.buyer_id = %s
                ORDER BY p.product_name
            """

            return self.db.execute_query(query, (buyer_id,))
        except Exception as e:
            logger.error(f"Error getting products by customer: {e}")
            return []

    def get_products_by_seller(
        self, seller_id: int, active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Получить товары определенного продавца

        Args:
            seller_id: ID продавца
            active_only: Если True, только товары с остатком > 0

        Returns:
            Список товаров продавца
        """
        try:
            query = "SELECT * FROM product WHERE seller_id = %s"
            params = [seller_id]

            if active_only:
                query += " AND remaining_amount > 0"

            query += " ORDER BY id"

            return self.db.execute_query(query, tuple(params))
        except Exception as e:
            logger.error(f"Error getting products by seller: {e}")
            return []

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
                SELECT p.*, 
                       s.first_name, s.second_name, s.patronymic,
                       s.phone_number as seller_phone, s.email as seller_email
                FROM product p
                LEFT JOIN seller s ON p.seller_id = s.id
                WHERE p.id = %s
            """

            result = self.db.execute_query(query, (product_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting product by id: {e}")
            return None

    # ========== ПОКУПАТЕЛИ ==========


    def get_buyer_by_phone(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """
        Найти покупателя по номеру телефона

        Args:
            phone_number: Номер телефона

        Returns:
            Информация о покупателе или None
        """
        try:
            # Приводим номер телефона к единому формату
            # formatted_phone = self._normalize_phone_number(phone_number)

            # Ищем в базе по отформатированному номеру
            query = """
                SELECT * FROM buyer 
                WHERE phone_number = %s
            """

            result = self.db.execute_query(query, (phone_number,))

            # Если не нашли по отформатированному номеру, пробуем найти по любому формату
            if not result:
                result = self._search_by_any_phone_format(phone_number)

            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting buyer by phone: {e}")
            return None


    def _normalize_phone_number(self, phone: str) -> str:
        """
        Привести номер телефона к единому формату

        Формат: +7XXXXXXXXXX (11 цифр, начинается с +7)
        """
        if not phone:
            return ""

        # Удаляем все нецифровые символы
        digits = "".join(filter(str.isdigit, phone))

        if not digits:
            return phone.strip()

        # Обработка российских номеров
        if len(digits) == 11 and digits.startswith(("7", "8")):
            # Преобразуем 8XXXXXXXXXX или 7XXXXXXXXXX в +7XXXXXXXXXX
            return "+7" + digits[1:]
        elif len(digits) == 10:
            # Преобразуем XXXXXXXXXX в +7XXXXXXXXXX
            return "+7" + digits
        else:
            # Для других форматов оставляем как есть
            return "+7" + digits[-10:] if len(digits) >= 10 else phone.strip()


    def _search_by_any_phone_format(self, phone: str) -> Optional[List]:
        """
        Поиск по всем возможным форматам номера телефона

        Используется, если поиск по отформатированному номеру не дал результатов
        """
        try:
            # Получаем цифры из номера
            digits = "".join(filter(str.isdigit, phone))

            if not digits:
                return None

            # Формируем все возможные варианты номера
            possible_formats = []

            # Если номер содержит 11 цифр (российский формат)
            if len(digits) == 11:
                possible_formats.extend(
                    [
                        "+7" + digits[1:],  # +7XXXXXXXXXX
                        "8" + digits[1:],  # 8XXXXXXXXXX
                        "7" + digits[1:],  # 7XXXXXXXXXX
                        digits,  # 7/8XXXXXXXXXX
                        "+7" + digits[1:-2] + "-" + digits[-2:],  # +7XXX-XX-XX
                    ]
                )
            # Если номер содержит 10 цифр
            elif len(digits) == 10:
                possible_formats.extend(
                    [
                        "+7" + digits,  # +7XXXXXXXXXX
                        "8" + digits,  # 8XXXXXXXXXX
                        "7" + digits,  # 7XXXXXXXXXX
                        digits,  # XXXXXXXXXX
                        "+7" + digits[:-2] + "-" + digits[-2:],  # +7XXX-XX-XX
                    ]
                )

            # Добавляем формат с разделителями
            if len(digits) >= 10:
                formatted_with_dashes = (
                    "+7"
                    + digits[-10:-7]
                    + "-"
                    + digits[-7:-4]
                    + "-"
                    + digits[-4:-2]
                    + "-"
                    + digits[-2:]
                )
                possible_formats.append(formatted_with_dashes)

            # Убираем дубликаты
            possible_formats = list(set(possible_formats))

            # Ищем по всем форматам
            for phone_format in possible_formats:
                query = """
                    SELECT * FROM buyer 
                    WHERE phone_number = %s
                """
                result = self.db.execute_query(query, (phone_format,))
                if result:
                    return result

            return None
        except Exception as e:
            logger.error(f"Error searching by any phone format: {e}")
            return None

    def authenticate_buyer(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """
        Аутентификация покупателя по номеру телефона

        Args:
            phone_number: Номер телефона

        Returns:
            Информация о покупателе или None если аутентификация не удалась
        """
        try:
            query = """
                SELECT * FROM buyer 
                WHERE phone_number = %s 
            """

            result = self.db.execute_query(query, (phone_number))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error authenticating buyer: {e}")
            return None

    # ========== ПРОДАВЦЫ ==========

    def get_seller_by_phone(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """
        Найти продавца по номеру телефона

        Args:
            phone_number: Номер телефона

        Returns:
            Информация о продавце или None
        """
        try:
            query = """
                SELECT * FROM seller 
                WHERE phone_number = %s
            """

            result = self.db.execute_query(query, (phone_number,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting seller by phone: {e}")
            return None

    def authenticate_seller(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """
        Аутентификация продавца по номеру телефона и email

        Args:
            phone_number: Номер телефона

        Returns:
            Информация о продавце или None если аутентификация не удалась
        """
        try:
            query = """
                SELECT * FROM seller 
                WHERE phone_number = %s 
            """

            result = self.db.execute_query(query, (phone_number))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error authenticating seller: {e}")
            return None

    # ========== РЕГИСТРАЦИЯ ==========

    def register_buyer(
        self,
        first_name: str,
        second_name: str,
        phone_number: str,
        email: Optional[str] = None,
        patronymic: Optional[str] = None,
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация нового покупателя

        Returns:
            Кортеж (успех, ID покупателя, сообщение об ошибке)
        """

        print("Зашли внутрь")
        try:
            # Проверяем, существует ли покупатель с таким телефоном
            existing = self.get_buyer_by_phone(phone_number)
            if existing:
                return False, None, "Покупатель с таким телефоном уже существует"
            print("Пользователя с таким телефоном не существует")
            
            
            query = """
                INSERT INTO buyer 
                (first_name, second_name, patronymic, phone_number, email)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """

            result = self.db.execute_query(
                query, (first_name, second_name, patronymic, phone_number, email)
            )

            if result:
                buyer_id = result[0]["id"]
                return True, buyer_id, "Регистрация успешна"
            else:
                return False, None, "Не удалось зарегистрировать покупателя"

        except Exception as e:
            logger.error(f"Error registering buyer: {e}")
            return False, None, f"Ошибка регистрации: {str(e)}"

    def register_seller(
        self,
        first_name: str,
        second_name: str,
        phone_number: str,
        email: Optional[str] = None,
        patronymic: Optional[str] = None,
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация нового продавца

        Returns:
            Кортеж (успех, ID продавца, сообщение об ошибке)
        """
        try:
            # Проверяем, существует ли продавец с таким телефоном
            existing = self.get_seller_by_phone(phone_number)
            if existing:
                return False, None, "Продавец с таким телефоном уже существует"

            query = """
                INSERT INTO seller 
                (first_name, second_name, patronymic, phone_number, email)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """

            result = self.db.execute_query(
                query, (first_name, second_name, patronymic, phone_number, email)
            )

            if result:
                seller_id = result[0]["id"]
                return True, seller_id, "Регистрация продавца успешна"
            else:
                return False, None, "Не удалось зарегистрировать продавца"

        except Exception as e:
            logger.error(f"Error registering seller: {e}")
            return False, None, f"Ошибка регистрации продавца: {str(e)}"

    # ========== УДАЛЕНИЕ ==========

    def delete_buyer(self, buyer_id: int) -> Tuple[bool, str]:
        """
        Удаление покупателя по ID

        Args:
            buyer_id: ID покупателя

        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            # Проверяем, есть ли у покупателя посылки
            parcels_query = "SELECT COUNT(*) FROM parcel WHERE buyer_id = %s"
            parcels_result = self.db.execute_query(parcels_query, (buyer_id,))
            parcels_count = parcels_result[0]["count"] if parcels_result else 0

            if parcels_count > 0:
                return False, "У покупателя есть активные посылки"

            query = "DELETE FROM buyer WHERE id = %s"
            rows_affected = self.db.execute_update(query, (buyer_id,))

            if rows_affected > 0:
                return True, "Покупатель успешно удален"
            else:
                return False, "Покупатель не найден"

        except Exception as e:
            logger.error(f"Error deleting buyer: {e}")
            return False, f"Ошибка удаления: {str(e)}"

    def delete_seller(
        self, seller_id: int, check_dependencies: bool = True
    ) -> Tuple[bool, str]:
        """
        Удаление продавца по ID

        Args:
            seller_id: ID продавца
            check_dependencies: Проверять наличие связанных товаров

        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            if check_dependencies:
                # Проверяем наличие товаров продавца
                products_count = len(
                    self.get_products_by_seller(seller_id, active_only=False)
                )

                if products_count > 0:
                    return False, "У продавца есть связанные товары"

            query = "DELETE FROM seller WHERE id = %s"
            rows_affected = self.db.execute_update(query, (seller_id,))

            if rows_affected > 0:
                return True, "Продавец успешно удален"
            else:
                return False, "Продавец не найден"

        except Exception as e:
            logger.error(f"Error deleting seller: {e}")
            return False, f"Ошибка удаления: {str(e)}"

    # ========== ТОЧКИ ==========

    def get_points_paginated(
        self, page: int = 1, page_size: int = 10, point_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Получить пункты с пагинацией

        Args:
            page: Номер страницы (начинается с 1)
            page_size: Количество точек на странице
            point_type: Фильтр по типу пункта (опционально)

        Returns:
            Список пунктов
        """
        try:
            offset = (page - 1) * page_size

            query = "SELECT * FROM point"

            conditions = []
            params = []

            if point_type is not None:
                conditions.append("type = %s")
                params.append(point_type)

            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            query += " ORDER BY id LIMIT %s OFFSET %s"
            params.extend([page_size, offset])

            return self.db.execute_query(query, tuple(params))
        except Exception as e:
            logger.error(f"Error getting paginated points: {e}")
            return []

    def register_point(
        self, addres: str, point_type: str, phone_number: Optional[str] = None
    ) -> Tuple[bool, Optional[int], str]:
        """
        Регистрация нового пункта

        Args:
            addres: Адрес пункта
            point_type: Тип пункта
            phone_number: Телефон (опционально)

        Returns:
            Кортеж (успех, ID точки, сообщение)
        """
        try:
            query = """
                INSERT INTO point (addres, type, phone_number)
                VALUES (%s, %s, %s)
                RETURNING id
            """

            result = self.db.execute_query(query, (addres, point_type, phone_number))

            if result:
                point_id = result[0]["id"]
                return True, point_id, "Пункт успешно зарегистрирован"
            else:
                return False, None, "Не удалось зарегистрировать пункт"

        except Exception as e:
            logger.error(f"Error registering point: {e}")
            return False, None, f"Ошибка регистрации: {str(e)}"

    def delete_point(self, point_id: int) -> Tuple[bool, str]:
        """
        Удаление пункта

        Args:
            point_id: ID пункта

        Returns:
            Кортеж (успех, сообщение)
        """
        try:
            # Проверяем, используется ли пункт в посылках


            query = "DELETE FROM point WHERE id = %s"
            rows_affected = self.db.execute_update(query, (point_id,))

            if rows_affected > 0:
                return True, "Пункт успешно удален"
            else:
                return False, "Пункт не найден"

        except Exception as e:
            logger.error(f"Error deleting point: {e}")
            return False, f"Ошибка удаления: {str(e)}"

    # ========== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ==========

    def get_buyer_by_id(self, buyer_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить покупателя по ID
        """
        try:
            query = "SELECT * FROM buyer WHERE id = %s"
            result = self.db.execute_query(query, (buyer_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting buyer by id: {e}")
            return None

    def get_seller_by_id(self, seller_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить продавца по ID
        """
        try:
            query = "SELECT * FROM seller WHERE id = %s"
            result = self.db.execute_query(query, (seller_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting seller by id: {e}")
            return None

    def get_point_by_id(self, point_id: int) -> Optional[Dict[str, Any]]:
        """
        Получить пункт по ID
        """
        try:
            query = "SELECT * FROM point WHERE id = %s"
            result = self.db.execute_query(query, (point_id,))
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting point by id: {e}")
            return None

    def update_product_quantity(self, product_id: int, quantity_change: int) -> bool:
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
                UPDATE product 
                SET remaining_amount = GREATEST(0, remaining_amount + %s)
                WHERE id = %s
            """

            rows_affected = self.db.execute_update(query, (quantity_change, product_id))
            return rows_affected > 0
        except Exception as e:
            logger.error(f"Error updating product quantity: {e}")
            return False

    def search_products(
        self,
        search_term: str,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        min_weight: Optional[Decimal] = None,
        max_weight: Optional[Decimal] = None,
        page: int = 1,
        page_size: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Поиск товаров с фильтрами

        Args:
            search_term: Текст для поиска в названии и описании
            min_price: Минимальная цена (опционально)
            max_price: Максимальная цена (опционально)
            min_weight: Минимальный вес (опционально)
            max_weight: Максимальный вес (опционально)
            page: Номер страницы
            page_size: Размер страницы

        Returns:
            Список товаров
        """
        try:
            offset = (page - 1) * page_size

            query = """
                SELECT p.*, 
                       s.first_name || ' ' || s.second_name as seller_full_name
                FROM product p
                LEFT JOIN seller s ON p.seller_id = s.id
                WHERE p.remaining_amount > 0
                AND (p.product_name ILIKE %s OR p.discription ILIKE %s)
            """
            params: List[Any] = []
            
            if(search_term):
                params = [f"%{search_term}%", f"%{search_term}%"]

            if min_price is not None:
                query += " AND p.price >= %s"
                params.append(float(min_price))

            if max_price is not None:
                query += " AND p.price <= %s"
                params.append(float(max_price))

            if min_weight is not None:
                query += " AND p.weight >= %s"
                params.append(float(min_weight))

            if max_weight is not None:
                query += " AND p.weight <= %s"
                params.append(float(max_weight))

            query += " ORDER BY p.id LIMIT %s OFFSET %s"
            params.extend([page_size, offset])

            return self.db.execute_query(query, params)
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            return []

    def create_parcel(
        self,
        buyer_id: int,
        product_id: int,
        destination_point_id: int,
        parcel_price: Decimal,
        track_number: str,
        status: str = "created",
    ) -> Tuple[bool, Optional[int], str]:
        """
        Создание посылки

        Args:
            buyer_id: ID покупателя
            product_id: ID товара
            destination_point_id: ID пункта назначения
            parcel_price: Стоимость пересылки
            track_number: Трек-номер
            status: Статус посылки

        Returns:
            Кортеж (успех, ID посылки, сообщение)
        """
        try:
            # Проверяем наличие товара
            product = self.get_product_by_id(product_id)
            if not product or product["remaining_amount"] <= 0:
                return False, None, "Товар недоступен"

            # Проверяем покупателя
            buyer = self.get_buyer_by_id(buyer_id)
            if not buyer:
                return False, None, "Покупатель не найден"

            # Проверяем пункт назначения
            point = self.get_point_by_id(destination_point_id)
            if not point:
                return False, None, "Пункт назначения не найден"

            query = """
                INSERT INTO parcel 
                (track_number, status, parcel_price, creation_date, 
                 destination_point_id, buyer_id, product_id)
                VALUES (%s, %s, %s, NOW(), %s, %s, %s)
                RETURNING id
            """

            result = self.db.execute_query(
                query,
                (
                    track_number,
                    status,
                    float(parcel_price),
                    destination_point_id,
                    buyer_id,
                    product_id,
                ),
            )

            if result:
                parcel_id = result[0]["id"]

                # Уменьшаем количество товара
                self.update_product_quantity(product_id, -1)

                return True, parcel_id, "Посылка успешно создана"
            else:
                return False, None, "Не удалось создать посылку"

        except Exception as e:
            logger.error(f"Error creating parcel: {e}")
            return False, None, f"Ошибка создания посылки: {str(e)}"

    def get_parcels_by_buyer(
        self, buyer_id: int, page: int = 1, page_size: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Получить посылки покупателя

        Args:
            buyer_id: ID покупателя
            page: Номер страницы
            page_size: Размер страницы

        Returns:
            Список посылок
        """
        try:
            offset = (page - 1) * page_size

            query = """
                SELECT p.*, 
                       pr.product_name,
                       pt.addres as destination_address,
                       pt.type as destination_type
                FROM parcel p
                JOIN product pr ON p.product_id = pr.id
                JOIN point pt ON p.destination_point_id = pt.id
                WHERE p.buyer_id = %s
                ORDER BY p.creation_date DESC
                LIMIT %s OFFSET %s
            """

            return self.db.execute_query(query, (buyer_id, page_size, offset))
        except Exception as e:
            logger.error(f"Error getting parcels by buyer: {e}")
            return []

    def get_transfers_by_parcel(self, parcel_id: int) -> List[Dict[str, Any]]:
        """
        Получить трансферы посылки

        Args:
            parcel_id: ID посылки

        Returns:
            Список трансферов
        """
        try:
            query = """
                SELECT t.*,
                       sp.addres as shipping_address,
                       sp.type as shipping_type,
                       dp.addres as destination_address,
                       dp.type as destination_type
                FROM transfer t
                LEFT JOIN point sp ON t.shipping_point_id = sp.id
                LEFT JOIN point dp ON t.destination_point_id = dp.id
                WHERE t.parcel_id = %s
                ORDER BY t.created_date
            """

            return self.db.execute_query(query, (parcel_id,))
        except Exception as e:
            logger.error(f"Error getting transfers by parcel: {e}")
            return []

    def get_seller_statistics(self, seller_id: int) -> Dict[str, Any]:
        """
        Получить статистику по продавцу

        Args:
            seller_id: ID продавца

        Returns:
            Статистика продавца
        """
        try:
            # Количество товаров
            products_query = """
                SELECT COUNT(*) as total_products,
                       SUM(remaining_amount) as total_stock,
                       SUM(price * remaining_amount) as total_value
                FROM product
                WHERE seller_id = %s AND remaining_amount > 0
            """

            products_result = self.db.execute_query(products_query, (seller_id,))

            # Количество проданных товаров через посылки
            sold_query = """
                SELECT COUNT(DISTINCT pc.id) as total_sales,
                       SUM(pc.parcel_price) as total_revenue
                FROM parcel pc
                JOIN product p ON pc.product_id = p.id
                WHERE p.seller_id = %s
            """

            sold_result = self.db.execute_query(sold_query, (seller_id,))

            return {
                "products": products_result[0] if products_result else {},
                "sales": sold_result[0] if sold_result else {},
            }
        except Exception as e:
            logger.error(f"Error getting seller statistics: {e}")
            return {}
