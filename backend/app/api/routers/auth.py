from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import random
import time
from datetime import datetime
from db.crud.DatabaseDependecy import DbServiceDep


router = APIRouter()

# Простое хранилище (в реальном проекте используйте Redis/БД)
sessions = {}
verification_codes = {}


class PhoneRequest(BaseModel):
    phone: str


class VerifyCode(BaseModel):
    phone: str
    code: str


class TokenRequest(BaseModel):
    token: str


# Вспомогательные функции
def generate_code():
    return str(random.randint(1000, 9999))


def create_simple_token(phone: str):
    import hashlib
    import secrets

    timestamp = str(int(time.time()))
    random_part = secrets.token_hex(4)
    return f"{phone}_{timestamp}_{random_part}"


@router.post("/request_code")
async def request_code(data: PhoneRequest, db_service: DbServiceDep):
    """
    Запрос кода для входа по номеру телефона
    """
    phone = data.phone.strip()
    print(data.phone)
    buyer = db_service.get_buyer_by_phone(phone)
    if buyer is not None:
        # Очистка старых кодов
        current_time = time.time()
        codes_to_remove = []
        for p, data1 in verification_codes.items():
            if current_time > data1["expires"]:
                codes_to_remove.append(p)

        for p in codes_to_remove:
            del verification_codes[p]

        # Генерируем код
        code = generate_code()

        # Сохраняем код (5 минут)
        verification_codes[phone] = {
            "code": code,
            "expires": current_time + 300,
            "created": current_time,
        }

        print(f"🔐 Код для {phone}: {code} (действителен 5 минут)")

        return {
            "success": True,
            "message": "Код отправлен на телефон",
            "debug_code": code,  # Только для разработки!
        }
    return {"success": False, "message": "Пользователь не зарегестрирован"}


@router.post("/verify")
async def verify_code(data: VerifyCode):
    """
    Проверка кода и вход
    """
    phone = data.phone.strip()
    code = data.code.strip()

    # Проверяем, запрашивался ли код
    if phone not in verification_codes:
        raise HTTPException(status_code=400, detail="Код не запрашивался или устарел")

    stored = verification_codes[phone]

    # Проверяем срок действия
    if time.time() > stored["expires"]:
        del verification_codes[phone]
        raise HTTPException(status_code=400, detail="Код устарел. Запросите новый")

    # Проверяем код
    if stored["code"] != code:
        # Счетчик попыток можно добавить здесь
        raise HTTPException(status_code=400, detail="Неверный код")

    # Код верный - создаем сессию
    token = create_simple_token(phone)

    sessions[token] = {
        "phone": phone,
        "name": f"Пользователь {phone[-4:]}",
        "login_time": time.time(),
        "last_active": time.time(),
    }

    # Удаляем использованный код
    del verification_codes[phone]

    print(f"✅ Пользователь {phone} вошел в систему. Токен: {token[:20]}...")

    return {
        "success": True,
        "message": "Вход выполнен",
        "token": token,
        "user": {"phone": phone, "name": f"Пользователь {phone[-4:]}"},
    }


@router.post("/logout")
async def logout(data: TokenRequest):
    """
    Выход из системы
    """
    token = data.token

    if token in sessions:
        phone = sessions[token]["phone"]
        del sessions[token]
        print(f"👋 Пользователь {phone} вышел из системы")

    return {"success": True, "message": "Выход выполнен"}


@router.get("/check")
async def check_auth(token: str):
    """
    Проверка токена (GET запрос)
    """
    if not token:
        return {"authenticated": False, "message": "Токен не предоставлен"}

    if token in sessions:
        # Обновляем время активности
        sessions[token]["last_active"] = time.time()
        return {"authenticated": True, "user": sessions[token]}

    return {"authenticated": False, "message": "Неверный токен"}


@router.get("/sessions_info")
async def sessions_info():
    """
    Информация о текущих сессиях (для отладки)
    """
    return {
        "active_sessions": len(sessions),
        "pending_codes": len(verification_codes),
        "sessions": sessions,
        "codes": verification_codes,
    }
