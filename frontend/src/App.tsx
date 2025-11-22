import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { HoldingForm } from "./components/HoldingForm";
import { HoldingsTable } from "./components/HoldingsTable";
import { NewsPanel } from "./components/NewsPanel";
import { AlertPanel } from "./components/AlertPanel";

type PriceQuote = {
  id: number;
  price: number;
  change_percent: number;
  timestamp: string;
};

type Alert = {
  id: number;
  title: string;
  message: string;
  severity: string;
  created_at: string;
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

type NewsArticle = {
  id: number;
  headline: string;
  url: string;
  published_at: string;
  summary?: string | null;
  sentiment_score?: number | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHoldingId, setSelectedHoldingId] = useState<number | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Holding[]>(`${API_BASE_URL}/holdings`);
      setHoldings(response.data);
    } catch (err) {
      setError("保有銘柄の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async (holdingId: number) => {
    try {
      const response = await axios.get<{ articles: NewsArticle[] }>(
        `${API_BASE_URL}/holdings/${holdingId}/news`
      );
      setNews(response.data.articles);
    } catch (err) {
      setNews([]);
    }
  }, []);

  const fetchAlerts = useCallback(async (holdingId: number) => {
    try {
      const response = await axios.get<{ alerts: Alert[] }>(
        `${API_BASE_URL}/holdings/${holdingId}/alerts`
      );
      setAlerts(response.data.alerts);
    } catch (err) {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchHoldings();
      if (selectedHoldingId) {
        fetchNews(selectedHoldingId);
        fetchAlerts(selectedHoldingId);
      }
    }, 60000);
    return () => window.clearInterval(interval);
  }, [fetchHoldings, fetchNews, fetchAlerts, selectedHoldingId]);

  useEffect(() => {
    if (selectedHoldingId) {
      fetchNews(selectedHoldingId);
      fetchAlerts(selectedHoldingId);
    }
  }, [selectedHoldingId, fetchAlerts, fetchNews]);

  const selectedHolding = useMemo(
    () => holdings.find((holding) => holding.id === selectedHoldingId) || null,
    [holdings, selectedHoldingId]
  );

  const handleHoldingCreated = useCallback(async () => {
    await fetchHoldings();
  }, [fetchHoldings]);

  const handleHoldingUpdated = useCallback(async () => {
    await fetchHoldings();
  }, [fetchHoldings]);

  const handleHoldingDeleted = useCallback(async () => {
    await fetchHoldings();
    setSelectedHoldingId(null);
  }, [fetchHoldings]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>株式コンパニオン</h1>
        <p className="subtitle">リアルタイムで保有銘柄を管理し、ニュースを自動分析します。</p>
      </header>
      <main className="app-main">
        <section className="panel">
          <h2>保有銘柄</h2>
          <HoldingForm onSuccess={handleHoldingCreated} />
          <HoldingsTable
            holdings={holdings}
            isLoading={isLoading}
            error={error}
            onSelect={(holdingId) => setSelectedHoldingId(holdingId)}
            onUpdated={handleHoldingUpdated}
            onDeleted={handleHoldingDeleted}
          />
        </section>
        <section className="panel">
          <h2>ニュース分析</h2>
          {selectedHolding ? (
            <NewsPanel
              holding={selectedHolding}
              news={news}
            />
          ) : (
            <p className="placeholder">ニュースを確認したい銘柄を選択してください。</p>
          )}
        </section>
        <section className="panel">
          <h2>アラート</h2>
          {selectedHolding ? (
            <AlertPanel alerts={alerts} />
          ) : (
            <p className="placeholder">アラートを確認するには銘柄を選択してください。</p>
          )}
        </section>
      </main>
    </div>
  );
}
