from __future__ import annotations

from app import StockApp

app = StockApp()
client = app.test_client()


def test_create_and_list_holdings() -> None:
    response = client.post(
        "/holdings",
        json={
            "symbol": "AAPL",
            "company_name": "Apple Inc.",
            "shares": 10,
            "average_cost": 150,
            "memo": "長期保有",
        },
    )
    assert response.status_code == 201

    list_response = client.get("/holdings")
    assert list_response.status_code == 200
    payload = list_response.json()
    assert len(payload) >= 1
    assert payload[0]["symbol"] == "AAPL"
    assert payload[0]["memo"] == "長期保有"


def test_update_and_delete() -> None:
    create_response = client.post(
        "/holdings",
        json={
            "symbol": "MSFT",
            "company_name": "Microsoft",
            "shares": 5,
            "average_cost": 250,
            "memo": "クラウド事業に期待",
        },
    )
    holding_id = create_response.json()["id"]

    update_response = client.put(
        f"/holdings/{holding_id}",
        json={"memo": "AI投資強化", "shares": 6},
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["memo"] == "AI投資強化"
    assert updated["shares"] == 6.0

    delete_response = client.delete(f"/holdings/{holding_id}")
    assert delete_response.status_code == 204

    list_response = client.get("/holdings")
    assert list_response.status_code == 200
    assert all(item["id"] != holding_id for item in list_response.json())
