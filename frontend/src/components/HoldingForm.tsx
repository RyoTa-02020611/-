import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type Props = {
  onSuccess: () => Promise<void> | void;
};

export function HoldingForm({ onSuccess }: Props) {
  const [symbol, setSymbol] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shares, setShares] = useState(0);
  const [averageCost, setAverageCost] = useState(0);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/holdings`, {
        symbol,
        company_name: companyName,
        shares,
        average_cost: averageCost,
        memo,
      });
      setSymbol("");
      setCompanyName("");
      setShares(0);
      setAverageCost(0);
      setMemo("");
      await onSuccess();
    } catch (err) {
      setError("銘柄の登録に失敗しました。入力内容を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="holding-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="symbol">ティッカー</label>
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          placeholder="例: AAPL"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="companyName">企業名</label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder="Apple Inc."
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="shares">株数</label>
          <input
            id="shares"
            type="number"
            min={0}
            step="0.01"
            value={shares}
            onChange={(event) => setShares(Number(event.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="averageCost">平均取得単価</label>
          <input
            id="averageCost"
            type="number"
            min={0}
            step="0.01"
            value={averageCost}
            onChange={(event) => setAverageCost(Number(event.target.value))}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="memo">購入理由メモ</label>
        <textarea
          id="memo"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="なぜこの銘柄を購入したのか記録しましょう。"
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="primary-button">
        {isSubmitting ? "登録中..." : "銘柄を追加"}
      </button>
    </form>
  );
}
