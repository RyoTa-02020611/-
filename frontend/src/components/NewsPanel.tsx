import dayjs from "dayjs";

type NewsArticle = {
  id: number;
  headline: string;
  url: string;
  published_at: string;
  summary?: string | null;
  sentiment_score?: number | null;
};

type Holding = {
  symbol: string;
  company_name: string;
};

type Props = {
  holding: Holding;
  news: NewsArticle[];
};

export function NewsPanel({ holding, news }: Props) {
  if (!news.length) {
    return (
      <div className="news-panel">
        <p className="placeholder">まだ最新ニュースが取得されていません。</p>
      </div>
    );
  }

  return (
    <div className="news-panel">
      <h3>
        {holding.company_name} ({holding.symbol}) の最新ニュース
      </h3>
      <ul>
        {news.map((article) => (
          <li key={article.id} className="news-item">
            <a href={article.url} target="_blank" rel="noreferrer">
              <h4>{article.headline}</h4>
            </a>
            <p className="meta">{dayjs(article.published_at).format("YYYY/MM/DD HH:mm")}</p>
            {article.summary && <p className="summary">{article.summary}</p>}
            {typeof article.sentiment_score === "number" && (
              <p className="sentiment">
                センチメントスコア: {article.sentiment_score.toFixed(2)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
