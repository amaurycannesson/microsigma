import os
import sqlite3
from sqlite3 import Connection, Cursor

from ai.constants import MIGRATIONS_FOLDER_PATH


class DbError(Exception):
    """Something went wrong with db"""


class Db:
    path: str
    conn: Connection
    cursor: Cursor

    def __init__(self, path: str):
        self.path = path

    def connect(self):
        self.conn = sqlite3.connect(self.path, check_same_thread=False)
        self.cursor = self.conn.cursor()

    def close(self):
        self.cursor.close()

    def execute(self, query):
        try:
            self.cursor.execute(query)

            if query.upper().startswith("SELECT"):
                return self.cursor.fetchall()
            else:
                self.conn.commit()
                return self.cursor.rowcount
        except Exception as err:
            raise DbError() from err

    def list_schemas(self) -> str:
        schemas = ""
        migration_files = [
            f for f in os.listdir(MIGRATIONS_FOLDER_PATH) if f.endswith(".sql")
        ]

        for migration_file in migration_files:
            migration_file_path = os.path.join(MIGRATIONS_FOLDER_PATH, migration_file)

            with open(migration_file_path, "r", encoding="utf-8") as file:
                schemas += file.read() + "\n"

        return schemas
