from fastapi import APIRouter, HTTPException, Body
from decimal import Decimal
from db.crud.DatabaseDependecy import DbServiceDep
from pydantic import BaseModel

router = APIRouter(prefix="/api/parcels", tags=["parcels"])

class CreateParcelRequest(BaseModel):
    buyer_id: int
    product_id: int
    destination_point_id: int
    parcel_price: Decimal
    track_number: str
    status: str = "created"

@router.post("/")
async def create_parcel(
    parcel_data: CreateParcelRequest,
    db_service: DbServiceDep
):
    """Создать новую посылку"""
    success, parcel_id, message = db_service.create_parcel(
        buyer_id=parcel_data.buyer_id,
        product_id=parcel_data.product_id,
        destination_point_id=parcel_data.destination_point_id,
        parcel_price=parcel_data.parcel_price,
        track_number=parcel_data.track_number,
        status=parcel_data.status
    )
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {
        "success": success,
        "parcel_id": parcel_id,
        "message": message
    }

@router.get("/{parcel_id}/transfers")
async def get_parcel_transfers(
    parcel_id: int,
    db_service: DbServiceDep
):
    """Получить трансферы посылки"""
    transfers = db_service.get_transfers_by_parcel(parcel_id)
    return {"transfers": transfers}