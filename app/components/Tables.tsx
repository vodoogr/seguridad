export function RiskLevel({ level }: { level: string }) {
  return <span className={`badge ${level.toLowerCase()}`}>{level}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className="status">{status}</span>;
}
