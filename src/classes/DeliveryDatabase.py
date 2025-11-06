from DatabaseManager import DatabaseManager
from QueryRepository import QueryRepository
from DatabaseConfig import DatabaseConfig

class DeliveryDatabase:
    """
    Select from delivery database to python data and
    Insert python data in delivery database

    Note: Connection forming from env variables
        DB_HOST
        DB_PORT
        DB_NAME
        DB_USER
        DB_PASSWORD
    """

    def __init__(self):
        self.query_repository = QueryRepository
        self.database_manager = DatabaseManager(DatabaseConfig())

