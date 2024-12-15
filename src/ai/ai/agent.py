from dataclasses import dataclass
from datetime import date
from typing import Union

import click
from pydantic import BaseModel
from pydantic_ai import Agent, ModelRetry, RunContext

from ai.db import Db, DbError


@dataclass
class Deps:
    db: Db


class Success(BaseModel):
    sql_query: str
    result: str


class InvalidRequest(BaseModel):
    error_message: str


Response = Union[Success, InvalidRequest]

microsigma_agent = Agent(
    model="openai:gpt-4o-mini",
    deps_type=Deps,
    result_type=Response,  # type: ignore
)


@microsigma_agent.system_prompt
def system_promt(ctx: RunContext[Deps]) -> str:
    db_schemas = ctx.deps.db.list_schemas()

    return f"""\
Given the following SQLite tables, your job is to execute a SQL query that suits the user's request.
When executing an `INSERT` query, if the rate is not provided, prompt the user for it. The same rate should be used consistently across all inserted rows.

Database schema:
{db_schemas}

today's date = {date.today().strftime('%Y-%m-%d')}

Example
    request: show me activity from yesterday
    execute: SELECT * FROM activity WHERE date = DATE('now','-1 day')
Example
    request: log an activity for today
    execute: INSERT INTO activity (date, paid_at, rate, estimated, real) VALUES (DATE('now'), DATE('now'), 100, 1.0, 1.0)
"""


@microsigma_agent.tool
def get_rate(ctx: RunContext[Deps], ask: str) -> int:
    rate = click.prompt(ask, type=int)
    return rate


@microsigma_agent.tool
def run_query(ctx: RunContext[Deps], sql_query: str):
    try:
        return ctx.deps.db.execute(sql_query)
    except DbError as e:
        raise ModelRetry(f"Invalid query: {e}") from e
