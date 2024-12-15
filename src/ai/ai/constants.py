from pathlib import Path

ROOT_DIRECTORY = Path().cwd().parents[1]
DB_FILE_PATH = f"{ROOT_DIRECTORY}/sqlite.db"
MIGRATIONS_FOLDER_PATH = f"{ROOT_DIRECTORY}/migrations"
