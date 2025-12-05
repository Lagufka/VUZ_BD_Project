from fastapi import APIRouter, HTTPException
from typing import Optional
from db.crud.DatabaseDependecy import DbServiceDep
from pydantic import BaseModel, EmailStr, field_validator
import re

router = APIRouter(prefix="/api/sellers", tags=["sellers"])

class SellerRegistration(BaseModel):
    first_name: str
    second_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    patronymic: Optional[str] = None
    
    @field_validator('phone_number')
    def validate_phone(cls, v):
        phone_regex = r'^\+?[1-9]\d{1,14}$'
        if not re.match(phone_regex, v):
            raise ValueError('Некорректный формат телефона')
        return v

@router.post("/register")
async def register_seller(
    seller_data: SellerRegistration,
    db_service: DbServiceDep
):
    """Регистрация нового продавца"""
    success, seller_id, message = db_service.register_seller(
        first_name=seller_data.first_name,
        second_name=seller_data.second_name,
        phone_number=seller_data.phone_number,
        email=seller_data.email,
        patronymic=seller_data.patronymic
    )
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {
        "success": success,
        "seller_id": seller_id,
        "message": message
    }

@router.get("/{seller_id}/statistics")
async def get_seller_statistics(
    seller_id: int,
    db_service: DbServiceDep
):
    """Получить статистику продавца"""
    statistics = db_service.get_seller_statistics(seller_id)
    return statistics