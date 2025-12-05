from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from api.routers import products, buyers, sellers, parcels, points
import os
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
    allow_origins=["http://localhost:5173"],
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


### Подгрузка статики ###

current_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(current_dir, "static")

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
async def serve_root():
    return FileResponse(os.path.join(static_dir, "index.html"))


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Проверяем, существует ли файл
    file_path = os.path.join(static_dir, full_path)

    if os.path.isfile(file_path):
        return FileResponse(file_path)

    # Если файла нет - отдаём index.html (SPA роутинг)
    return FileResponse(os.path.join(static_dir, "index.html"))


### Дополнительные эндпоинты ###


@app.get("/api/")
async def api_root():
    return {
        "message": "Delivery System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
