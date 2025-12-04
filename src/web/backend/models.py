from dataclasses import dataclass
from datetime import datetime


@dataclass
class buyer:
    id: int
    name: str
    phone: str
    email: str


@dataclass
class seller:
    id: int
    name: str
    phone: str
    email: str


@dataclass
class product:
    id: int
    name: str
    discription: str
    count: int
    weight: float
    price: float
    size: str
    id_seller: int


@dataclass
class parcel:
    id: int
    treck_number: str
    status: str
    price: float
    creating_date: datetime
    id_to_point: int
    id_buyer: int
    id_product: int


@dataclass
class transfer:
    id: int
    accepted_status: str
    date: datetime
    id_from_point: int
    id_to_point: int
    id_parcel: int


@dataclass
class point:
    id: int
    addres: str
    type: str
    phone: str
