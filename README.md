# Fullstack приложение (React + FastAPI)

Учебный проект в рамках дисциплины "Базы данных". Реализовано fullstack веб-приложение с фронтендом на React и бэкендом на FastAPI, интегрированное с реляционной базой данных.

(Не для деплоя)

**Локальный запуск:**
```bash
# frontend
cd frontend
npm install
npm run build

# backend
pip install -r requirements.txt
cd backend/app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```


## Структура проекта

```
VUZ_BD_Project/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI приложение
│       ├── api/
│       │   └── routers/          # Маршруты API
│       │       ├── auth.py
│       │       ├── buyers.py
│       │       ├── sellers.py
│       │       ├── parcels.py
│       │       ├── points.py
│       │       └── products.py
│       ├── db/
│       │   ├── core/             # Конфигурация БД
│       │   ├── crud/             # CRUD операции
│       │   └── utils/            # Вспомогательные функции
│       └── static/               # <- Собранный фронтенд (нужно собирать руками)
├── frontend/
│   ├── src/
│   ├── components/               # React компоненты
│   ├── styles/                   # CSS стили
│   ├── main.jsx                  # Точка входа React
│   ├── vite.config.js            # Конфигурация Vite
│   └── package.json
├── requirements.txt              # Python зависимости
├── package.json                  # Root Node package (можно удалить)
└── README.md                     # Этот файл
```
