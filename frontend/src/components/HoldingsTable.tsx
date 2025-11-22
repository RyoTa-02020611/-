import axios from "axios";
import dayjs from "dayjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type PriceQuote = {
  price: number;
  change_percent: number;
  timestamp: string;
};

type Alert = {
  severity: string;
  message: string;
};

type Holding = {
  id: number;
  symbol: string;
  company_name: string;
  shares: number;
  average_cost: number;
  memo: string | null;
  created_at: string;
  latest_quote: PriceQuote | null;
  latest_alert: Alert | null;
};

type Props = {
  holdings: Holding[];
  isLoading: boolean;
  error: string | null;
  onSelect: (holdingId: number) => void;
  onUpdated: () => Promise<void> | void;
  onDeleted: () => Promise<void> | void;
};

export function HoldingsTable({
  holdings,
  isLoading,
  error,
  onSelect,
  onUpdated,
  onDeleted,
}: Props) {
  const updateMemo = async (holdingId: number, memo: string) => {
    await axios.put(`${API_BASE_URL}/holdings/${holdingId}`, { memo });
    await onUpdated();
  };

  const deleteHolding = async (holdingId: number) => {
    await axios.delete(`${API_BASE_URL}/holdings/${holdingId}`);
    await onDeleted();
  };

  if (isLoading) {
    return <p>読み込み中です...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!holdings.length) {
    return <p className="placeholder">まだ保有銘柄が登録されていません。</p>;
  }

  return (
    <div className="holdings-table">
      {holdings.map((holding) => {
        const quote = holding.latest_quote;
        const alert = holding.latest_alert;
        return (
          <article
            key={holding.id}
            className="holding-card"
            onClick={() => onSelect(holding.id)}
            role="button"
            tabIndex={0}
          >
            <header className="holding-card__header">
              <div>
                <h3>{holding.symbol}</h3>
                <p className="company-name">{holding.company_name}</p>
              </div>
              <div className="price-block">
                {quote ? (
                  <>
                    <span className="price">${quote.price.toFixed(2)}</span>
                    <span className={`change ${quote.change_percent >= 0 ? "positive" : "negative"}`}>
                      {quote.change_percent >= 0 ? "+" : ""}
                      {quote.change_percent.toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <span className="price price--empty">-</span>
                )}
              </div>
            </header>
            <section className="holding-card__body">
              <dl>
                <div>
                  <dt>保有株数</dt>
                  <dd>{holding.shares}</dd>
                </div>
                <div>
                  <dt>平均取得単価</dt>
                  <dd>{holding.average_cost}</dd>
                </div>
                <div>
                  <dt>登録日</dt>
                  <dd>{dayjs(holding.created_at).format("YYYY/MM/DD")}</dd>
                </div>
              </dl>
              <textarea
                className="memo-input"
                defaultValue={holding.memo ?? ""}
                placeholder="購入理由や方針を記録"
                onBlur={(event) => updateMemo(holding.id, event.target.value)}
              />
            </section>
            {alert && (
              <footer className={`holding-card__alert alert-${alert.severity}`}>
                <strong>最新アラート:</strong> {alert.message}
              </footer>
            )}
            <button
              type="button"
              className="secondary-button"
              onClick={(event) => {
                event.stopPropagation();
                deleteHolding(holding.id);
              }}
            >
              削除
            </button>
          </article>
        );
      })}
    </div>
  );
}
