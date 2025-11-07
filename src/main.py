from dotenv import load_dotenv
from database.DeliveryDatabase import DeliveryDatabase
from database.FakeData import FakeData
import random
from datetime import datetime, timedelta

fake_data = FakeData()


load_dotenv("dbenv.env")
ddb = DeliveryDatabase()

def generateTestData():
    pass
    # buyers = fake_data.generateFakePeople(30)
    # for buyer in buyers:
    #     query, params = ddb.query_repository.insert("buyer", buyer, ["id", "first_name"])
    #     returnings = ddb.database_manager.execute_query(query, params)
    #     print(returnings)
        
    # print("=" * 50)

    # sellers = fake_data.generateFakePeople(16)
    # for seller in sellers:
    #     query, params = ddb.query_repository.insert("seller", seller, ["id", "first_name"])
    #     returnings = ddb.database_manager.execute_query(query, params)
    #     print(returnings)
        
    # print("=" * 50)

    # points = fake_data.generateFakePoints(30)
    # for point in points:
    #     query, params = ddb.query_repository.insert("point", point, ["id", "addres"])
    #     returnings = ddb.database_manager.execute_query(query, params)
    #     print(returnings)
        
    # print("=" * 50)

    # products = fake_data.generateFakeProducts(90)
    # query, params = ddb.query_repository.select("seller", "id")
    # sellers = ddb.database_manager.execute_query(query, params)

    # for fakeProduct in products:
    #     product = {
    #         "product_name" : fakeProduct["product_name"],
    #         "discription" : fakeProduct["discription"],
    #         "remaining_amount" : fakeProduct["remaining_amount"],
    #         "price" : fakeProduct["price"],
    #         "size" : fakeProduct["size"],
    #         "weight" : fakeProduct["weight"],
    #         "seller_id" : random.choice([x["id"] for x in sellers])
    #         }
        
    #     query, params = ddb.query_repository.insert("product", product, ["id", "product_name"])
    #     returnings = ddb.database_manager.execute_query(query, params)
    #     print(returnings)
        
    # print("=" * 50)
    
    # query, params = ddb.query_repository.select("buyer", "id")
    # buyer_ids = [x["id"] for x in ddb.database_manager.execute_query(query, params)]
    # query, params = ddb.query_repository.select("product", "id")
    # product_ids = [x["id"] for x in ddb.database_manager.execute_query(query, params)]
    # query, params = ddb.query_repository.select("point", "id", {"type" : "ПВЗ"})
    # destination_ids = [x["id"] for x in ddb.database_manager.execute_query(query, params)]
    
    # parcels = fake_data.generateFakeParcels(buyer_ids, product_ids, destination_ids)
    
    # for parcel in parcels:
    #     query, params = ddb.query_repository.insert("parcel", parcel, ["id", "track_number"])
    #     returnings = ddb.database_manager.execute_query(query, params)
    #     print(returnings)

    query, params = ddb.query_repository.select("point")
    points = ddb.database_manager.execute_query(query, params)
    query, params = ddb.query_repository.select("parcel")
    parcels = ddb.database_manager.execute_query(query, params)
    
    transfers = fake_data.generateFakeTransfers(points, parcels)
    for transfer in transfers:
        query, params = ddb.query_repository.insert("transfer", transfer, ["id"])
        returnings = ddb.database_manager.execute_query(query, params)
        print(returnings)

generateTestData()
ddb.database_manager.close()
