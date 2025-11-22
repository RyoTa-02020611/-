from __future__ import annotations

from dataclasses import asdict
from datetime import datetime
from typing import Any

from .storage import (
    DuplicateSymbolError,
    HoldingNotFoundError,
    StockStorage,
)


class Response:
    """Lightweight response object used by the tests."""

    def __init__(self, status_code: int, data: Any | None = None) -> None:
        self.status_code = status_code
        self._data = data

    def json(self) -> Any:
        return self._data


class StockApp:
    """In-memory stock management API.

    The class mimics a small subset of the behaviour provided by FastAPI's
    ``TestClient`` so that the backend can be exercised without third party
    dependencies.
    """

    def __init__(self, storage: StockStorage | None = None) -> None:
        self._storage = storage or StockStorage()

    def post(self, path: str, json: dict[str, Any]) -> Response:
        if path != "/holdings":
            return Response(404, {"detail": "Not Found"})
        try:
            holding = self._storage.create_holding(
                symbol=json["symbol"],
                company_name=json["company_name"],
                shares=float(json["shares"]),
                average_cost=float(json["average_cost"]),
                memo=json.get("memo"),
            )
        except KeyError as exc:  # missing required payload field
            return Response(422, {"detail": f"Missing field: {exc.args[0]}"})
        except DuplicateSymbolError:
            return Response(400, {"detail": "この銘柄はすでに登録されています。"})
        return Response(201, asdict(holding))

    def get(self, path: str) -> Response:
        if path == "/holdings":
            holdings = [asdict(item) for item in self._storage.list_holdings()]
            return Response(200, holdings)
        if path.startswith("/holdings/"):
            try:
                holding_id = int(path.split("/")[2])
            except (IndexError, ValueError):
                return Response(404, {"detail": "Not Found"})
            try:
                holding = self._storage.get_holding(holding_id)
            except HoldingNotFoundError:
                return Response(404, {"detail": "保有銘柄が見つかりません。"})
            return Response(200, asdict(holding))
        if path == "/health":
            return Response(200, {"status": "ok", "timestamp": datetime.utcnow().isoformat()})
        return Response(404, {"detail": "Not Found"})

    def put(self, path: str, json: dict[str, Any]) -> Response:
        if not path.startswith("/holdings/"):
            return Response(404, {"detail": "Not Found"})
        try:
            holding_id = int(path.split("/")[2])
        except (IndexError, ValueError):
            return Response(404, {"detail": "Not Found"})
        try:
            holding = self._storage.update_holding(holding_id, json)
        except HoldingNotFoundError:
            return Response(404, {"detail": "保有銘柄が見つかりません。"})
        return Response(200, asdict(holding))

    def delete(self, path: str) -> Response:
        if not path.startswith("/holdings/"):
            return Response(404, {"detail": "Not Found"})
        try:
            holding_id = int(path.split("/")[2])
        except (IndexError, ValueError):
            return Response(404, {"detail": "Not Found"})
        try:
            self._storage.delete_holding(holding_id)
        except HoldingNotFoundError:
            return Response(404, {"detail": "保有銘柄が見つかりません。"})
        return Response(204, None)

    # Convenience helpers -------------------------------------------------

    def test_client(self) -> StockApp:
        """Compatibility helper to mirror the previous FastAPI interface."""

        return self
