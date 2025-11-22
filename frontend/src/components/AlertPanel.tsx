import dayjs from "dayjs";

type Alert = {
  id: number;
  title: string;
  message: string;
  severity: string;
  created_at: string;
};

type Props = {
  alerts: Alert[];
};

export function AlertPanel({ alerts }: Props) {
  if (!alerts.length) {
    return <p className="placeholder">最新のアラートはありません。</p>;
  }

  return (
    <ul className="alert-list">
      {alerts.map((alert) => (
        <li key={alert.id} className={`alert-item alert-${alert.severity}`}>
          <div className="alert-item__header">
            <h4>{alert.title}</h4>
            <time>{dayjs(alert.created_at).format("YYYY/MM/DD HH:mm")}</time>
          </div>
          <p>{alert.message}</p>
        </li>
      ))}
    </ul>
  );
}
