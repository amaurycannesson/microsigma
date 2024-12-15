import click

from ai.agent import Deps, microsigma_agent
from ai.constants import DB_FILE_PATH
from ai.db import Db

db = Db(DB_FILE_PATH)
db.connect()


@click.command()
@click.argument("prompt")
def cli(prompt):
    result = microsigma_agent.run_sync(prompt, deps=Deps(db=db))
    click.echo(result.data)
