export function formatDate(date: Date): string | undefined {
  return date.toISOString().split('T')[0];
}
