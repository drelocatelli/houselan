
const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const dayKey = (date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isToday = (iso?: string): boolean => {
  if (!iso) return false;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return dayKey(date) === dayKey();
};

const formatClock = (totalSeconds: number): string => {
  const total = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);


export { dayKey, formatBRL, formatClock, isToday, toNumber };

