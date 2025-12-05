from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from db.crud.DatabaseDependecy import DbServiceDep
from pydantic import BaseModel

router = APIRouter(prefix="/api/points", tags=["points"])

class PointRegistration(BaseModel):
    addres: str
    type: str
    phone_number: Optional[str] = None

@router.get("/")
async def get_points(
    db_service: DbServiceDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    point_type: Optional[str] = None
):
    """Получить пункты с пагинацией"""
    points = db_service.get_points_paginated(page, page_size, point_type)
    return {"points": points}

@router.post("/")
async def register_point(
    point_data: PointRegistration,
    db_service: DbServiceDep
):
    """Зарегистрировать новый пункт"""
    success, point_id, message = db_service.register_point(
        addres=point_data.addres,
        point_type=point_data.type,
        phone_number=point_data.phone_number
    )
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {
        "success": success,
        "point_id": point_id,
        "message": message
    }

@router.delete("/{point_id}")
async def delete_point(
    point_id: int,
    db_service: DbServiceDep
):
    """Удалить пункт"""
    success, message = db_service.delete_point(point_id)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {"success": success, "message": message}