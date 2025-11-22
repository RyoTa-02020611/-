from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable


class DuplicateSymbolError(RuntimeError):
    """Raised when attempting to insert a holding with an existing symbol."""


class HoldingNotFoundError(RuntimeError):
    """Raised when a holding could not be found in the database."""


@dataclass(slots=True)
class Holding:
    id: int
    symbol: str
    company_name: str
    shares: float
    average_cost: float
    memo: str | None
    created_at: datetime


class StockStorage:
    """SQLite powered persistence layer for stock holdings."""

    def __init__(self, database_path: str | None = None) -> None:
        if database_path:
            Path(database_path).expanduser().resolve().parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(database_path or ":memory:", check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._initialise()

    def _initialise(self) -> None:
        with self._conn:
            self._conn.execute(
                """
                CREATE TABLE IF NOT EXISTS stock_holdings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL UNIQUE,
                    company_name TEXT NOT NULL,
                    shares REAL NOT NULL DEFAULT 0,
                    average_cost REAL NOT NULL DEFAULT 0,
                    memo TEXT,
                    created_at TEXT NOT NULL
                )
                """
            )

    # CRUD operations ---------------------------------------------------

    def create_holding(
        self,
        *,
        symbol: str,
        company_name: str,
        shares: float,
        average_cost: float,
        memo: str | None,
    ) -> Holding:
        symbol_normalised = symbol.upper()
        created_at = datetime.utcnow().replace(microsecond=0)
        try:
            with self._conn:
                cursor = self._conn.execute(
                    """
                    INSERT INTO stock_holdings(symbol, company_name, shares, average_cost, memo, created_at)
                    VALUES(?, ?, ?, ?, ?, ?)
                    """,
                    (
                        symbol_normalised,
                        company_name,
                        shares,
                        average_cost,
                        memo,
                        created_at.isoformat(),
                    ),
                )
        except sqlite3.IntegrityError as exc:
            raise DuplicateSymbolError(symbol_normalised) from exc
        return self._row_to_holding(cursor.lastrowid, symbol_normalised, company_name, shares, average_cost, memo, created_at)

    def list_holdings(self) -> list[Holding]:
        rows = self._conn.execute(
            "SELECT id, symbol, company_name, shares, average_cost, memo, created_at FROM stock_holdings ORDER BY id"
        ).fetchall()
        return [self._row_to_holding(**row) for row in map(self._normalise_row, rows)]

    def get_holding(self, holding_id: int) -> Holding:
        row = self._conn.execute(
            "SELECT id, symbol, company_name, shares, average_cost, memo, created_at FROM stock_holdings WHERE id = ?",
            (holding_id,),
        ).fetchone()
        if row is None:
            raise HoldingNotFoundError(holding_id)
        return self._row_to_holding(**self._normalise_row(row))

    def update_holding(self, holding_id: int, payload: dict[str, Any]) -> Holding:
        columns: list[str] = []
        values: list[Any] = []
        for key in ("symbol", "company_name", "shares", "average_cost", "memo"):
            if key in payload:
                columns.append(f"{key} = ?")
                if key == "symbol":
                    values.append(str(payload[key]).upper())
                elif key in {"shares", "average_cost"}:
                    values.append(float(payload[key]))
                else:
                    values.append(payload[key])
        if not columns:
            # nothing to update, just return the existing record
            return self.get_holding(holding_id)
        values.append(holding_id)
        try:
            with self._conn:
                result = self._conn.execute(
                    f"UPDATE stock_holdings SET {', '.join(columns)} WHERE id = ?", values
                )
        except sqlite3.IntegrityError as exc:
            raise DuplicateSymbolError(str(payload.get("symbol", "")).upper()) from exc
        if result.rowcount == 0:
            raise HoldingNotFoundError(holding_id)
        return self.get_holding(holding_id)

    def delete_holding(self, holding_id: int) -> None:
        with self._conn:
            result = self._conn.execute("DELETE FROM stock_holdings WHERE id = ?", (holding_id,))
        if result.rowcount == 0:
            raise HoldingNotFoundError(holding_id)

    # Helpers -----------------------------------------------------------

    @staticmethod
    def _normalise_row(row: sqlite3.Row) -> dict[str, Any]:
        return {
            "id": row["id"],
            "symbol": row["symbol"],
            "company_name": row["company_name"],
            "shares": float(row["shares"]),
            "average_cost": float(row["average_cost"]),
            "memo": row["memo"],
            "created_at": datetime.fromisoformat(row["created_at"]),
        }

    @staticmethod
    def _row_to_holding(
        id: int,
        symbol: str,
        company_name: str,
        shares: float,
        average_cost: float,
        memo: str | None,
        created_at: datetime,
    ) -> Holding:
        return Holding(
            id=id,
            symbol=symbol,
            company_name=company_name,
            shares=shares,
            average_cost=average_cost,
            memo=memo,
            created_at=created_at,
        )

    def clear(self) -> None:
        with self._conn:
            self._conn.execute("DELETE FROM stock_holdings")

    def seed(self, holdings: Iterable[dict[str, Any]]) -> None:
        for item in holdings:
            self.create_holding(**item)
