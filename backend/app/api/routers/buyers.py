from fastapi import APIRouter, HTTPException
from typing import Optional
from db.crud.DatabaseDependecy import DbServiceDep
from pydantic import BaseModel, EmailStr, field_validator
import re

router = APIRouter(prefix="/api/buyers", tags=["buyers"])

class BuyerRegistration(BaseModel):
    first_name: str
    second_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    patronymic: Optional[str] = None


@router.post("/register")
async def register_buyer(
    buyer_data: BuyerRegistration,
    db_service: DbServiceDep
):
    """Регистрация нового покупателя"""
    print("Начали регистрацию")
    success, buyer_id, message = db_service.register_buyer(
        first_name=buyer_data.first_name,
        second_name=buyer_data.second_name,
        phone_number=buyer_data.phone_number,
        email=buyer_data.email,
        patronymic=buyer_data.patronymic
    )
    print("Закончили регистрацию")
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {
        "success": success,
        "buyer_id": buyer_id,
        "message": message
    }

@router.get("/{buyer_id}")
async def get_buyer(
    buyer_id: int,
    db_service: DbServiceDep
):
    """Получить покупателя по ID"""
    buyer = db_service.get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Покупатель не найден")
    return buyer

@router.get("/phone/{phone_number}")
async def get_buyer_by_phone(
    phone_number: str,
    db_service: DbServiceDep
):
    """Найти покупателя по телефону"""
    buyer = db_service.get_buyer_by_phone(phone_number)
    if not buyer:
        raise HTTPException(status_code=404, detail="Покупатель не найден")
    return buyer

@router.delete("/{buyer_id}")
async def delete_buyer(
    buyer_id: int,
    db_service: DbServiceDep
):
    """Удалить покупателя"""
    success, message = db_service.delete_buyer(buyer_id)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {"success": success, "message": message}

@router.get("/{buyer_id}/products")
async def get_buyer_products(
    buyer_id: int,
    db_service: DbServiceDep,
    distinct: bool = True
):
    """Получить товары покупателя"""
    products = db_service.get_products_by_customer(buyer_id, distinct)
    return {"products": products}

@router.get("/{buyer_id}/parcels")
async def get_buyer_parcels(
    buyer_id: int,
    db_service: DbServiceDep,
    page: int = 1,
    page_size: int = 10
):
    """Получить посылки покупателя"""
    parcels = db_service.get_parcels_by_buyer(buyer_id, page, page_size)
    return {"parcels": parcels}