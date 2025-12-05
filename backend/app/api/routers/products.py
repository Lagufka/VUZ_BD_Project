from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends
from decimal import Decimal
from db.crud.DatabaseDependecy import DbServiceDep

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
async def get_products(
    db_service: DbServiceDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    active_only: bool = Query(True)
):
    """Получить товары с пагинацией"""
    try:
        products = db_service.get_products_paginated(
            page=page,
            page_size=page_size,
            active_only=active_only
        )
        total = db_service.get_total_products_count(active_only=active_only)
        
        return {
            "products": products,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "pages": (total + page_size - 1) // page_size
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db_service: DbServiceDep
):
    """Получить товар по ID"""
    product = db_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

@router.get("/seller/{seller_id}")
async def get_products_by_seller(
    seller_id: int,
    db_service: DbServiceDep,
    active_only: bool = Query(True)
):
    """Получить товары продавца"""
    products = db_service.get_products_by_seller(seller_id, active_only)
    return {"products": products}

@router.get("/search/")
async def search_products(
    db_service: DbServiceDep,
    q: str = Query(..., min_length=1),
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
    min_weight: Optional[Decimal] = Query(None, ge=0),
    max_weight: Optional[Decimal] = Query(None, ge=0),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100)
):
    """Поиск товаров"""
    try:
        products = db_service.search_products(
            search_term=q,
            min_price=min_price,
            max_price=max_price,
            min_weight=min_weight,
            max_weight=max_weight,
            page=page,
            page_size=page_size
        )
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))