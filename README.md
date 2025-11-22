# 株式コンパニオン

Python の標準ライブラリだけで動作するシンプルな株式管理バックエンドです。ウェブフレームワークや追加パッケージに頼らず、ポートフォリオの基本的な CRUD 操作を確認できます。

## 主な機能

- 📁 **保有銘柄の登録・一覧**: 銘柄コード、会社名、保有株数、平均取得単価、メモを保存し、一覧で確認できます。
- ✏️ **保有情報の更新**: 株数やメモなどを部分的に更新できます。
- 🗑️ **削除**: 不要になった銘柄を安全に削除できます。

## セットアップ

追加インストールは不要です。Python 3.11 以上が入っていれば以下の手順で動作確認ができます。

```bash
cd backend
python -m pytest
```

## 使い方

アプリケーション本体は `app.StockApp` クラスとして提供されます。`post`/`get`/`put`/`delete` メソッドを使い、REST 風のインターフェースでデータ操作を行います。

```python
from app import StockApp

app = StockApp()

app.post(
    "/holdings",
    json={
        "symbol": "AAPL",
        "company_name": "Apple Inc.",
        "shares": 10,
        "average_cost": 150,
        "memo": "長期保有",
    },
)
```

内部的には SQLite を使用しており、アプリケーションのインスタンスを破棄するまでデータは保持されます。

## テスト

`pytest` で CRUD の基本的な流れを確認しています。

```bash
cd backend
python -m pytest
```

## 今後のアイデア

- CSV など外部ファイルとのインポート/エクスポート
- 価格データ API との連携
- CLI からの操作サポート
