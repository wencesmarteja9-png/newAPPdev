import type { BookingStatus } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-11-09" -> "Mon, Nov 9"
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]}, ${MONTHS[m - 1]} ${d}`;
}

// 4.5 -> "4.5", null -> "–"
export function formatRating(average: number | null): string {
  return average === null ? '–' : average.toFixed(1);
}

// Status pill colors from the guide: green, gold, red
export function statusColors(status: BookingStatus): { bg: string; fg: string } {
  switch (status) {
    case 'Confirmed':
    case 'Checked In':
    case 'Completed':
      return { bg: '#12301F', fg: '#4ADE80' };
    case 'Pending':
    case 'In Progress':
      return { bg: '#2E2710', fg: '#D4AF37' };
    default:
      return { bg: '#3A1517', fg: '#F87171' };
  }
}

// 4 -> "★★★★☆"
export function stars(n: number): string {
  const full = Math.max(0, Math.min(5, Math.round(n)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}