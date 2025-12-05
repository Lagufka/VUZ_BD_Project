from api.routers import products, buyers, sellers, parcels, points

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Delivery System API",
    description="API для системы доставки посылок",
    version="1.0.0",
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(products.router)
app.include_router(buyers.router)
app.include_router(sellers.router)
app.include_router(parcels.router)
app.include_router(points.router)


@app.get("/api/")
async def root():
    return {
        "message": "Delivery System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
