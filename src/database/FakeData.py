from faker import Faker
import random


class FakeData:
    def __init__(self, loacale="ru_RU") -> None:
        self.faker = Faker(loacale)

    def generateFakePoints(self, count) -> list[dict]:
        """
        Returns:
            "addres"
            "type"
            "phone_number"
        """
        cities = [
            "Москва",
            "Санкт-Петербург",
            "Новосибирск",
            "Екатеринбург",
            "Казань",
            "Нижний Новгород",
            "Красноярск",
            "Челябинск",
            "Самара",
            "Уфа",
            "Ростов-на-Дону",
            "Краснодар",
            "Омск",
            "Воронеж",
            "Пермь",
            "Волгоград",
            "Тюмень",
            "Иркутск",
            "Ульяновск",
            "Владивосток",
        ]

        points = []
        for _ in range(count):
            point = {
                "addres": f"г. {random.choice(cities)}, {self.faker.street_address()}",
                "type": random.choice(["ПВЗ", "Склад"]),
                "phone_number": (
                    self.faker.phone_number() if random.random() < 0.3 else None
                ),
            }
            points.append(point)
        return points

    def generateFakePeople(self, count: int) -> list[dict[str, str]]:
        """
        Returns:
            list[dict]:
                "second_name"
                "first_name"
                "patronymic"
                "phone_number"
                "email"
        """
        people = []
        for _ in range(count):
            full_name = self.faker.name().split()

            person = {
                "second_name": full_name[0],
                "first_name": full_name[1],
                "patronymic": full_name[2],
                "phone_number": self.faker.phone_number(),
                "email": self.faker.email() if random.random() < 0.3 else None,
            }
            people.append(person)
        return people

    def generateFakeProducts(self, count: int) -> list[dict]:
        """generates fake products from internet shops


        Returns:
            list[dict]:
                "product_name"
                "discription"
                "price"
                "remaining_amount"
                "size
                "weight"
                "category"
        """
        categories = {
            "Электроника": [
                "Смартфон",
                "Ноутбук",
                "Наушники",
                "Умные часы",
                "Планшет",
                "Фитнес-браслет",
                "Портативная колонка",
                "Внешний аккумулятор",
            ],
            "Одежда": [
                "Футболка",
                "Джинсы",
                "Куртка",
                "Платье",
                "Свитер",
                "Брюки",
                "Толстовка",
                "Рубашка",
            ],
            "Обувь": ["Кроссовки", "Туфли", "Ботинки", "Сапоги", "Сандалии", "Тапочки"],
            "Дом и сад": [
                "Кофемашина",
                "Пылесос",
                "Микроволновая печь",
                "Чайник",
                "Блендер",
                "Утюг",
                "Тостер",
            ],
            "Красота и здоровье": [
                "Шампунь",
                "Крем для лица",
                "Духи",
                "Тушь для ресниц",
                "Гель для душа",
                "Масло для тела",
            ],
            "Детские товары": [
                "Конструктор",
                "Кукла",
                "Машинка",
                "Пазл",
                "Мягкая игрушка",
                "Набор для творчества",
            ],
            "Спорт": [
                "Мяч футбольный",
                "Гантели",
                "Йога-мат",
                "Скакалка",
                "Теннисная ракетка",
                "Велосипед",
            ],
            "Книги": [
                "Роман",
                "Детектив",
                "Фэнтези",
                "Научная литература",
                "Кулинарная книга",
                "Учебник",
            ],
        }
        brands = {
            "Электроника": [
                "Samsung",
                "Xiaomi",
                "Apple",
                "Huawei",
                "Sony",
                "Philips",
                "Lenovo",
                "Canon",
            ],
            "Одежда": [
                "Zara",
                "H&M",
                "Nike",
                "Adidas",
                "Reebok",
                "Puma",
                "Columbia",
                "The North Face",
            ],
            "Обувь": [
                "Nike",
                "Adidas",
                "Puma",
                "Reebok",
                "Ecco",
                "Geox",
                "Salomon",
                "Timberland",
            ],
            "Дом и сад": [
                "Bosch",
                "Samsung",
                "LG",
                "Philips",
                "Tefal",
                "Moulinex",
                "Scarlett",
                "Redmond",
            ],
            "Красота и здоровье": [
                "L'Oreal",
                "Nivea",
                "Garnier",
                "Dove",
                "Maybelline",
                "Clinique",
                "Estee Lauder",
            ],
            "Детские товары": [
                "Lego",
                "Barbie",
                "Hot Wheels",
                "Hasbro",
                "Fisher-Price",
                "Ravensburger",
            ],
            "Спорт": [
                "Nike",
                "Adidas",
                "Reebok",
                "Puma",
                "Wilson",
                "Spalding",
                "Kettler",
            ],
            "Книги": [
                "Эксмо",
                "АСТ",
                "Манн, Иванов и Фербер",
                "Питер",
                "Азбука",
                "Росмэн",
            ],
        }

        def generate_product_description(category, product_name, brand):
            descriptions = {
                "Электроника": [
                    f"{product_name} {brand} - инновационное устройство с передовыми технологиями. Высокое качество сборки и современный дизайн.",
                    f"Технологичный {product_name} от бренда {brand}. Отличное сочетание цены и качества для повседневного использования.",
                    f"{product_name} {brand} - надежное и функциональное устройство с длительным сроком службы.",
                ],
                "Одежда": [
                    f"Стильная {product_name.lower()} от {brand}. Изготовлена из качественных материалов, обеспечивающих комфорт в течение всего дня.",
                    f"Модная {product_name.lower()} бренда {brand}. Универсальный дизайн подходит для различных стилей и случаев.",
                    f"Качественная {product_name.lower()} {brand} с отличной посадкой по фигуре. Приятные к телу материалы.",
                ],
                "Обувь": [
                    f"Комфортные {product_name.lower()} {brand}. Ортопедическая стелька и качественные материалы для ежедневной носки.",
                    f"Стильные {product_name.lower()} от бренда {brand}. Подходят для спорта и повседневной носки.",
                    f"Прочные {product_name.lower()} {brand} с устойчивой подошвой. Отличное сцепление с поверхностью.",
                ],
            }

            default_desc = f"Качественный товар {product_name} от бренда {brand}. Надежность и проверенное качество для вашего комфорта."

            return random.choice(descriptions.get(category, [default_desc]))

        def generate_dimensions(category):
            dimensions = {
                "Электроника": [
                    "10x5x1 см",
                    "15x8x1 см",
                    "20x12x2 см",
                    "25x18x3 см",
                    "30x20x2 см",
                ],
                "Одежда": ["30x20x2 см", "25x15x3 см", "35x25x4 см", "40x30x5 см"],
                "Обувь": ["35x20x10 см", "40x25x12 см", "30x18x8 см"],
                "Дом и сад": [
                    "25x15x15 см",
                    "30x20x20 см",
                    "40x25x30 см",
                    "35x35x25 см",
                ],
                "Красота и здоровье": [
                    "8x4x4 см",
                    "10x5x5 см",
                    "12x6x6 см",
                    "15x8x8 см",
                ],
                "Детские товары": [
                    "20x15x5 см",
                    "25x20x8 см",
                    "30x25x10 см",
                    "35x30x15 см",
                ],
                "Спорт": ["25x25x10 см", "30x20x15 см", "35x25x20 см", "40x30x25 см"],
                "Книги": ["21x15x2 см", "24x17x3 см", "26x20x4 см"],
            }
            return random.choice(dimensions.get(category, ["20x15x5 см"]))

        def generate_weight(category):
            weights = {
                "Электроника": [0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0],
                "Одежда": [0.3, 0.4, 0.5, 0.6, 0.8],
                "Обувь": [0.5, 0.7, 0.9, 1.2, 1.5],
                "Дом и сад": [1.0, 1.5, 2.0, 3.0, 5.0],
                "Красота и здоровье": [0.1, 0.2, 0.3, 0.4],
                "Детские товары": [0.3, 0.5, 0.7, 1.0, 1.5],
                "Спорт": [0.5, 1.0, 1.5, 2.0, 3.0],
                "Книги": [0.3, 0.4, 0.5, 0.7],
            }
            return random.choice(weights.get(category, [0.5]))

        def generate_price(category):
            base_prices = {
                "Электроника": (2000, 50000),
                "Одежда": (500, 5000),
                "Обувь": (1000, 8000),
                "Дом и сад": (1000, 15000),
                "Красота и здоровье": (200, 3000),
                "Детские товары": (300, 4000),
                "Спорт": (500, 10000),
                "Книги": (200, 1500),
            }
            min_price, max_price = base_prices.get(category, (500, 5000))
            price = random.randint(min_price, max_price)
            # Округляем до десятков
            return round(price / 10) * 10

        products = []
        for i in range(count):
            category = random.choice(list(categories.keys()))
            product_type = random.choice(categories[category])
            brand = random.choice(brands[category])

            product_name = f"{product_type} {brand}"

            product = {
                "product_name": product_name,
                "discription": generate_product_description(
                    category, product_type, brand
                ),
                "price": generate_price(category),
                "remaining_amount": random.randint(0, 100),
                "size": generate_dimensions(category),
                "weight": generate_weight(category),
                "category": category,
            }
            products.append(product)

        return products
